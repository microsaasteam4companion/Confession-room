import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomApi, messageApi, participantApi } from '@/db/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { TruthOrDareBot } from '@/components/chat/TruthOrDareBot';
import { HeartRain } from '@/components/chat/HeartRain';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Send, Clock, Users, DollarSign, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Room, Message, RoomParticipant } from '@/types';
import { cn } from '@/lib/utils';
import { AudioUX } from '@/lib/AudioUX';
import { CardGenerator } from '@/lib/CardGenerator';
import { Share } from 'lucide-react';

export default function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [showHearts, setShowHearts] = useState(false);

  const [isExpired, setIsExpired] = useState(false);
  const [lastMessagePreview, setLastMessagePreview] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);
  const tickIntervalRef = useRef<any>(null);

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

  // Heartbeat UX (Audio + Haptic)
  useEffect(() => {
    if (timeRemaining <= 0 || timeRemaining > 60000) {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
      return;
    }

    // Capture last secret preview for cliffhanger
    if (messages.length > 0 && timeRemaining < 10000) {
      setLastMessagePreview(messages[messages.length - 1].content);
    }

    const getTickRate = () => {
      if (timeRemaining < 10000) return 250; // Critical
      if (timeRemaining < 30000) return 500; // Fast
      return 1000; // Normal
    };

    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);

    tickIntervalRef.current = setInterval(() => {
      AudioUX.playTick(timeRemaining < 10000 ? 1000 : 800);
      if ("vibrate" in navigator) {
        navigator.vibrate(50);
      }
    }, getTickRate());

    return () => clearInterval(tickIntervalRef.current);
  }, [timeRemaining, messages.length]);

  // Auto-scroll to bottom + Heart Rain Check
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    // Check for "I Love U" effect
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.content.toLowerCase().includes('i love u')) {
      console.log('❤️ Triggering Heart Rain');
      setShowHearts(true);
      const timer = setTimeout(() => setShowHearts(false), 10000); // 10 seconds
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const loadRoomData = async () => {
    try {
      setLoading(true);

      // Load room first to get the Code
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

      // Get participant ID from session
      const storedParticipantId = sessionStorage.getItem(`participant_${roomId}`);
      if (!storedParticipantId) {
        toast({
          title: 'Access Denied',
          description: 'Please join the room first',
          variant: 'destructive'
        });
        // Redirect to Join page using the correct ROOM CODE
        navigate(`/join/${roomData.code}`);
        return;
      }
      setParticipantId(storedParticipantId);

      // Load messages
      const messagesData = await messageApi.getRoomMessages(roomId!);
      setMessages(messagesData);

      // Load participants
      const participantsData = await participantApi.getRoomParticipants(roomId!);
      setParticipants(participantsData);

      // Subscribe to new messages
      channelRef.current = messageApi.subscribeToMessages(roomId!, (message) => {
        setMessages(prev => {
          // Deduplicate: Check if message already exists
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
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

  const handleSendMessage = async (e?: React.FormEvent, textOverride?: string) => {
    e?.preventDefault();
    const messageText = textOverride || newMessage;

    if (!messageText.trim() || !room || room.status === 'expired') return;

    try {
      const content = messageText.trim();
      setNewMessage(''); // Clear input immediately

      const sentMessage = await messageApi.sendMessage(roomId!, participantId!, content);

      // Manually add to state immediately (Optimistic/Instant update)
      setMessages(prev => {
        if (prev.some(m => m.id === sentMessage.id)) return prev;
        return [...prev, sentMessage];
      });

    } catch (err) {
      console.error('Failed to send message:', err);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      // Logic removed
    }
  };

  const handleRoomExpired = async () => {
    setIsExpired(true);

    if (roomId) {
      await roomApi.expireRoom(roomId);
    }
  };

  const handleExtendTime = () => {
    if (roomId) {
      navigate(`/extend/${roomId}`);
    }
  };

  const handleShareMoment = async (message: Message) => {
    try {
      const avatarName = message.participant?.avatar_name || 'Anonymous';
      const imageData = await CardGenerator.generate(message.content, avatarName);

      const link = document.createElement('a');
      link.download = `confession-${message.id.substring(0, 8)}.png`;
      link.href = imageData;
      link.click();

      toast({
        title: 'Moment Captured! 📸',
        description: 'Your confession card is ready to share.',
      });
    } catch (err) {
      console.error('Failed to generate card:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Entering Safe Space...</p>
        </div>
      </div>
    );
  }

  if (!room) return null;

  const totalDuration = room.initial_duration * 1000;
  const progress = ((totalDuration - timeRemaining) / totalDuration) * 100;
  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);
  const isWarning = timeRemaining <= 60000;

  const timerColor =
    timeRemaining > 300000 ? 'text-timer-safe' :
      timeRemaining > 60000 ? 'text-timer-warning' :
        'text-timer-danger';

  const warningClass = isWarning ? 'animate-pulse border-destructive/50 bg-destructive/5' : '';

  return (
    <div className="h-screen w-full overflow-hidden flex relative">
      {showHearts && <HeartRain />}

      {/* Heartbeat Overlay */}
      {timeRemaining > 0 && timeRemaining <= 60000 && (
        <div className={cn(
          "heartbeat-overlay",
          timeRemaining < 10000 ? "critical" : timeRemaining < 30000 ? "fast" : ""
        )} />
      )}

      {/* Expired Cliffhanger Overlay */}
      {isExpired && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-500">
          <Card className="w-full max-w-md glass-card border-primary/50 text-center space-y-6 p-8">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Clock className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="text-3xl font-bold gradient-text">Room Expired!</h2>

            {lastMessagePreview && (
              <div className="relative group">
                <p className="text-sm text-muted-foreground mb-2">The last thing said was...</p>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 blur-sm select-none">
                  {lastMessagePreview.substring(0, 30)}...
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">SECRET LOCKED 🔒</Badge>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={handleExtendTime}
                className="w-full h-12 text-lg btn-shimmer"
              >
                Reveal & Re-open (₹10)
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="w-full"
              >
                Abandon Secrets
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              *Re-opening adds 5 minutes to this specific room history.
            </p>
          </Card>
        </div>
      )}
      {/* Background / Ad Area (WeTransfer Style) */}
      <div className="absolute inset-0 z-0">
        {/* Animated gradient background base */}
        <div className="absolute inset-0 gradient-bg opacity-30" />

        {/* Ad Placeholder Content - Hidden on Mobile */}
        <div className="hidden lg:flex w-full h-full items-center justify-center lg:pl-[400px] xl:pl-[450px]">
          <div className="max-w-2xl text-center space-y-6 opacity-30 pointer-events-none select-none">
            <ImageIcon className="w-24 h-24 mx-auto text-primary/20" />
            <h3 className="text-4xl font-bold gradient-text">Space for Aesthetic Visuals</h3>
            <p className="text-xl text-muted-foreground">
              (Ads, Art, or Affiliate Content goes here)
            </p>
          </div>

          {/* Floating decorative elements */}
          <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl float" />
          <div className="absolute bottom-20 left-[500px] w-72 h-72 bg-purple-500/10 rounded-full blur-3xl float-delayed" />
        </div>

        {/* Red tint on expiry warning */}
        <div className={cn(
          "absolute inset-0 transition-colors duration-1000 pointer-events-none",
          isWarning ? "bg-red-900/10 mix-blend-overlay" : ""
        )} />
      </div>

      {/* Chat Interface - Side Panel */}
      <div className="relative z-10 w-full lg:w-[400px] xl:w-[450px] h-full flex flex-col glass-card border-r border-white/10 shadow-2xl backdrop-blur-xl">
        {/* Timer Header */}
        <header className={cn("border-b border-border/50 bg-background/40 backdrop-blur-md p-3 md:p-4 transition-colors", warningClass)}>
          <div className="space-y-3 md:space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-lg md:text-xl font-bold gradient-text neon-glow flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                  {room.name}
                </h1>
                <p className="text-[10px] md:text-xs text-muted-foreground font-mono">CODE: {room.code}</p>
              </div>
              <div className={cn("flex flex-col items-end gap-1", timerColor)}>
                <div className="flex items-center gap-2 text-xl md:text-2xl font-mono font-bold tracking-wider">
                  <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>{participants.length} Active</span>
                </div>
              </div>
            </div>
            <Progress value={progress} className={cn("h-1 md:h-1.5", isWarning ? "bg-destructive/20 [&>div]:bg-destructive" : "")} />
            {isWarning && (
              <p className="text-xs text-destructive font-bold text-center animate-bounce">
                ⚠️ Time is running out! Extend now!
              </p>
            )}
          </div>
        </header>

        {/* Messages Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground space-y-4 p-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center float">
                <Send className="w-8 h-8 text-primary/50" />
              </div>
              <p>No messages yet.<br />Break the silence!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.participant_id === participantId;
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex flex-col gap-1 fade-in-up",
                    isOwnMessage ? "items-end" : "items-start"
                  )}
                >
                  <span className="text-[10px] text-muted-foreground px-1">
                    {!isOwnMessage && (message.participant?.avatar_name || 'Anonymous')}
                  </span>
                  <div className={cn(
                    "max-w-[90%] md:max-w-[85%] p-2.5 md:p-3 rounded-2xl text-sm relative transition-all duration-300 hover:scale-[1.02] group/msg",
                    isOwnMessage
                      ? "bg-primary text-primary-foreground rounded-br-sm shadow-lg shadow-primary/20"
                      : "glass-card border-none bg-white/5 rounded-bl-sm"
                  )}>
                    <p className="break-words leading-relaxed">{message.content}</p>
                    <div className="flex items-center justify-between mt-1 gap-2">
                      <span className={cn(
                        "text-[10px] opacity-70",
                        isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleShareMoment(message)}
                          className={cn(
                            "p-1 rounded-full opacity-0 group-hover/msg:opacity-100 transition-opacity hover:bg-white/10",
                            isOwnMessage ? "text-primary-foreground/50 hover:text-primary-foreground" : "text-muted-foreground/50 hover:text-primary"
                          )}
                          title="Share as Card"
                        >
                          <Share className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            toast({
                              title: "Pinned to Global Wall! 🌌",
                              description: "Your secret is now eligible for the public carousel.",
                            });
                          }}
                          className={cn(
                            "p-1 rounded-full opacity-0 group-hover/msg:opacity-100 transition-opacity hover:bg-white/10",
                            isOwnMessage ? "text-primary-foreground/50 hover:text-primary-foreground" : "text-muted-foreground/50 hover:text-primary"
                          )}
                          title="Post to Public Wall"
                        >
                          <Sparkles className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Floating Extend Button (visible when low time) */}
        {timeRemaining < 300000 && (
          <div className="absolute bottom-[88px] left-0 right-0 flex justify-center z-20 pointer-events-none">
            <Button
              onClick={handleExtendTime}
              size="sm"
              className={cn(
                "rounded-full shadow-lg pointer-events-auto transition-all duration-300 hover:scale-110",
                isWarning ? "bg-destructive hover:bg-destructive/90 animate-pulse" : "neon-glow"
              )}
            >
              <DollarSign className="w-4 h-4 mr-1" />
              Extend (+{isWarning ? '1 min' : '5 mins'})
            </Button>
          </div>
        )}

        {/* Input Footer */}
        <div className="p-3 md:p-4 border-t border-border bg-background/80 backdrop-blur-lg flex flex-col gap-3">
          <TruthOrDareBot
            onSend={(msg) => handleSendMessage(undefined, msg)}
            messages={messages}
          />
          <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={
                room.status === 'active'
                  ? "Type message..."
                  : "Expired"
              }
              disabled={room.status === 'expired'}
              className="flex-1 h-10 bg-white/5 border-white/10"
            />
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 shrink-0 shadow-lg shadow-primary/20"
              disabled={!newMessage.trim() || room.status === 'expired'}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
