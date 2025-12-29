import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomApi, messageApi, participantApi } from '@/db/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Send, Clock, Users, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Room, Message, RoomParticipant } from '@/types';
import { cn } from '@/lib/utils';

export default function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [participantId, setParticipantId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!roomId) {
      navigate('/');
      return;
    }

    loadRoomData();
    
    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [roomId]);

  // Timer countdown
  useEffect(() => {
    if (!room) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, new Date(room.expires_at).getTime() - Date.now());
      setTimeRemaining(remaining);

      if (remaining === 0) {
        handleRoomExpired();
      } else if (remaining <= 60000 && remaining > 59000) {
        // 1 minute warning
        toast({
          title: '⏰ 1 Minute Remaining!',
          description: 'The room will expire soon. Extend time to continue chatting.',
          variant: 'destructive'
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [room]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadRoomData = async () => {
    try {
      setLoading(true);
      
      // Get participant ID from session
      const storedParticipantId = sessionStorage.getItem(`participant_${roomId}`);
      if (!storedParticipantId) {
        toast({
          title: 'Access Denied',
          description: 'Please join the room first',
          variant: 'destructive'
        });
        navigate(`/join/${roomId}`);
        return;
      }
      setParticipantId(storedParticipantId);

      // Load room
      const roomData = await roomApi.getRoomById(roomId!);
      if (!roomData || roomData.status !== 'active') {
        toast({
          title: 'Room Not Found',
          description: 'This room has expired or been deleted',
          variant: 'destructive'
        });
        navigate('/');
        return;
      }
      setRoom(roomData);

      // Load messages
      const messagesData = await messageApi.getRoomMessages(roomId!);
      setMessages(messagesData);

      // Load participants
      const participantsData = await participantApi.getRoomParticipants(roomId!);
      setParticipants(participantsData);

      // Subscribe to new messages
      channelRef.current = messageApi.subscribeToMessages(roomId!, (message) => {
        setMessages(prev => [...prev, message]);
      });

      setLoading(false);
    } catch (err) {
      console.error('Failed to load room:', err);
      toast({
        title: 'Error',
        description: 'Failed to load room data',
        variant: 'destructive'
      });
      navigate('/');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !participantId || !roomId) return;

    try {
      setSending(true);
      await messageApi.sendMessage(roomId, participantId, newMessage);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  const handleRoomExpired = async () => {
    toast({
      title: '⏰ Time\'s Up!',
      description: 'The room has expired. All messages will be deleted.',
      variant: 'destructive'
    });
    
    if (roomId) {
      await roomApi.expireRoom(roomId);
    }
    
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const handleExtendTime = () => {
    if (roomId) {
      navigate(`/extend/${roomId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!room) return null;

  const totalDuration = room.initial_duration * 1000;
  const progress = ((totalDuration - timeRemaining) / totalDuration) * 100;
  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);
  
  const timerColor = 
    timeRemaining > 300000 ? 'text-timer-safe' : 
    timeRemaining > 60000 ? 'text-timer-warning' : 
    'text-timer-danger';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Timer Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold gradient-text">{room.name}</h1>
              <p className="text-xs text-muted-foreground">Code: {room.code}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4" />
                <span>{participants.length}/{room.max_participants}</span>
              </div>
              <div className={cn("flex items-center gap-2 text-lg font-mono font-bold", timerColor)}>
                <Clock className="w-5 h-5" />
                <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="container mx-auto max-w-4xl space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.participant_id === participantId;
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    isOwnMessage ? "justify-end" : "justify-start"
                  )}
                >
                  <Card className={cn(
                    "max-w-[70%] p-3 glass-card",
                    isOwnMessage ? "bg-primary/10" : ""
                  )}>
                    <p className="text-xs font-semibold text-primary mb-1">
                      {message.participant?.avatar_name || 'Anonymous'}
                    </p>
                    <p className="text-sm break-words">{message.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </Card>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Extend Time Button (Floating) */}
      {timeRemaining < 300000 && (
        <div className="fixed bottom-24 right-4 xl:right-8">
          <Button
            onClick={handleExtendTime}
            size="lg"
            className="rounded-full shadow-lg neon-glow"
          >
            <DollarSign className="w-5 h-5 mr-2" />
            Extend Time
          </Button>
        </div>
      )}

      {/* Message Input */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm sticky bottom-0">
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending || timeRemaining === 0}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={!newMessage.trim() || sending || timeRemaining === 0}
              size="lg"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </footer>
    </div>
  );
}
