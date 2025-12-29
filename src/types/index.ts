export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export type UserRole = 'user' | 'admin';
export type RoomStatus = 'active' | 'expired' | 'deleted';
export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  code: string;
  creator_id: string | null;
  name: string;
  max_participants: number;
  initial_duration: number;
  expires_at: string;
  status: RoomStatus;
  created_at: string;
  updated_at: string;
}

export interface RoomParticipant {
  id: string;
  room_id: string;
  avatar_name: string;
  is_banned: boolean;
  joined_at: string;
}

export interface Message {
  id: string;
  room_id: string;
  participant_id: string;
  content: string;
  created_at: string;
  participant?: RoomParticipant;
}

export interface Order {
  id: string;
  room_id: string;
  items: OrderItem[];
  total_amount: number;
  currency: string;
  status: OrderStatus;
  stripe_session_id?: string;
  stripe_payment_intent_id?: string;
  customer_email?: string;
  customer_name?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface TimeExtensionOption {
  minutes: number;
  price: number;
  label: string;
}
