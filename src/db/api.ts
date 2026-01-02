import { supabase } from './supabase';
import type { Room, RoomParticipant, Message, Order } from '@/types';

// Room API
export const roomApi = {
  // Create a new room
  async createRoom(data: {
    name: string;
    max_participants: number;
    initial_duration: number;
  }) {
    const code = await this.generateUniqueCode();
    const expiresAt = new Date(Date.now() + data.initial_duration * 1000).toISOString();

    const { data: room, error } = await supabase
      .from('rooms')
      .insert({
        code,
        name: data.name,
        max_participants: data.max_participants,
        initial_duration: data.initial_duration,
        expires_at: expiresAt,
        status: 'active'
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    return room as Room;
    if (error) throw error;
    return room as Room;
  },

  // Initiate Dodo Payments Session
  async createPaymentSession(data: {
    name: string;
    price: number;
    quantity: number;
    type: 'create_room' | 'extend_time';
    metadata?: any;
    product_id: string; // Dynamic mapping for Dodo Header: Using product_id.
  }) {
    const { data: session, error } = await supabase.functions.invoke('create_dodo_checkout', {
      body: {
        product_id: data.product_id,
        room_id: data.metadata?.room_id || null,
        name: data.name,
        price: data.price,
        quantity: data.quantity,
        type: data.type,
        customer: data.metadata?.customer
      }
    });

    return { data: session, error: error }; // Returning session data Header: Fixing return value.
  },

  // Generate unique room code
  async generateUniqueCode(): Promise<string> {
    const { data, error } = await supabase.rpc('generate_room_code');
    if (error) throw error;

    // Check if code already exists
    const { data: existing } = await supabase
      .from('rooms')
      .select('code')
      .eq('code', data)
      .maybeSingle();

    if (existing) {
      // Recursively generate new code if collision
      return this.generateUniqueCode();
    }

    return data;
  },

  // Get room by code
  async getRoomByCode(code: string) {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('status', 'active')
      .maybeSingle();

    if (error) throw error;
    return data as Room | null;
  },

  // Get room by ID
  async getRoomById(id: string) {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as Room | null;
  },

  // Get rooms created by user
  async getUserRooms(userId: string) {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('creator_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (Array.isArray(data) ? data : []) as Room[];
  },

  // Update room
  async updateRoom(id: string, updates: Partial<Room>) {
    const { data, error } = await supabase
      .from('rooms')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as Room;
  },

  // Extend room time
  async extendRoomTime(roomId: string, minutes: number) {
    const { error } = await supabase.rpc('extend_room_time', {
      p_room_id: roomId,
      p_minutes: minutes
    });

    if (error) throw error;
  },

  // Delete room
  async deleteRoom(id: string) {
    const { error } = await supabase
      .from('rooms')
      .update({ status: 'deleted' })
      .eq('id', id);

    if (error) throw error;
  },

  // Mark room as expired
  async expireRoom(id: string) {
    const { error } = await supabase
      .from('rooms')
      .update({ status: 'expired' })
      .eq('id', id);

    if (error) throw error;
  }
};

// Participant API
export const participantApi = {
  // Join room as anonymous participant
  async joinRoom(roomId: string, avatarName: string) {
    const { data, error } = await supabase
      .from('room_participants')
      .insert({
        room_id: roomId,
        avatar_name: avatarName
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as RoomParticipant;
  },

  // Get participants in room
  async getRoomParticipants(roomId: string) {
    const { data, error } = await supabase
      .from('room_participants')
      .select('*')
      .eq('room_id', roomId)
      .eq('is_banned', false)
      .order('joined_at', { ascending: true });

    if (error) throw error;
    return (Array.isArray(data) ? data : []) as RoomParticipant[];
  },

  // Ban participant
  async banParticipant(participantId: string) {
    const { error } = await supabase
      .from('room_participants')
      .update({ is_banned: true })
      .eq('id', participantId);

    if (error) throw error;
  },

  // Generate random avatar name
  generateAvatarName(): string {
    const avatars = ['👻 Ghost', '🥷 Ninja', '🎭 Mask', '🦊 Fox', '🐺 Wolf', '🦉 Owl', '🐉 Dragon', '🦄 Unicorn'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    const randomNumber = Math.floor(Math.random() * 100);
    return `${randomAvatar}-${randomNumber}`;
  }
};

// Message API
export const messageApi = {
  // Send message
  async sendMessage(roomId: string, participantId: string, content: string) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        room_id: roomId,
        participant_id: participantId,
        content: content.trim()
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as Message;
  },

  // Get messages for room
  async getRoomMessages(roomId: string, limit = 100) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        participant:room_participants(*)
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return (Array.isArray(data) ? data : []) as Message[];
  },

  // Subscribe to new messages
  subscribeToMessages(roomId: string, callback: (message: Message) => void) {
    return supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        async (payload) => {
          // Fetch participant data
          const { data: participant } = await supabase
            .from('room_participants')
            .select('*')
            .eq('id', payload.new.participant_id)
            .maybeSingle();

          callback({
            ...payload.new,
            participant
          } as Message);
        }
      )
      .subscribe();
  }
};

// Order API
export const orderApi = {
  // Get orders for room
  async getRoomOrders(roomId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (Array.isArray(data) ? data : []) as Order[];
  },

  // Get order by session ID
  async getOrderBySessionId(sessionId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .maybeSingle();

    if (error) throw error;
    return data as Order | null;
  }
};
