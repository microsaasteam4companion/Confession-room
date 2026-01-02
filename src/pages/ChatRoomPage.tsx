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
import { Loader2, Send, Clock, Users, DollarSign, Sparkles, Image as ImageIcon, ArrowLeft } from 'lucide-react';
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
    <div className="h-screen w-full overflow-hidden flex relative bg-background">
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
          <Card className="w-full max-w-md glass-card border-primary/50 text-center space-y-6 p-8 dark:bg-black/95 dark:border-white/10">
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
                Reveal & Re-open ($0.99)
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
        </div >
      )
      }

      {/* Main Layout Container */}
      <div className="flex w-full h-full relative z-10">

        {/* LEFT AD GUTTER (Hidden on mobile) */}
        <div className="hidden xl:flex flex-1 items-center justify-center border-r border-white/5 bg-black/20 p-4">
          <div className="text-center opacity-30 select-none">
            <ImageIcon className="w-12 h-12 mx-auto mb-2 text-white/20" />
            <p className="text-sm font-mono tracking-widest uppercase text-white/40">Ad Space Left</p>
          </div>
        </div>

        {/* CENTER CHAT INTERFACE */}
        <div className="w-full md:max-w-3xl lg:max-w-4xl h-full flex flex-col shadow-2xl relative">
          {/* Chat Card Container */}
          <div className="flex-1 flex flex-col w-full h-full glass-card border-x border-white/10 dark:bg-black dark:border-white/10 transition-colors duration-300">

            {/* Timer Header */}
            <header className={cn("border-b border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-md p-3 md:p-4 transition-colors", warningClass)}>
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate('/admin')}
                      className="h-8 w-8 md:h-10 md:w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                      title="Back to Dashboard"
                    >
                      <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </Button>
                    <div className="h-6 w-[1px] bg-white/10 mx-1" />
                    <div>
                      <h1 className="text-lg md:text-xl font-bold gradient-text neon-glow flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                        {room.name}
                      </h1>
                      <p className="text-[10px] md:text-xs text-muted-foreground font-mono">CODE: {room.code}</p>
                    </div>
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
            <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
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
                        "flex flex-col gap-1 message-pop",
                        isOwnMessage ? "items-end message-pop-right" : "items-start message-pop-left"
                      )}
                    >
                      <span className="text-[10px] text-muted-foreground px-1">
                        {!isOwnMessage && (message.participant?.avatar_name || 'Anonymous')}
                      </span>
                      <div className={cn(
                        "max-w-[85%] md:max-w-[75%] py-2 px-3.5 rounded-[1.25rem] text-sm md:text-base relative transition-all duration-300 hover:scale-[1.01] group/msg shadow-sm",
                        isOwnMessage
                          ? "bg-primary text-primary-foreground rounded-br-sm shadow-primary/10"
                          : "bg-muted/50 dark:bg-white/5 border border-white/5 rounded-bl-sm"
                      )}>
                        <p className="break-words leading-tight">{message.content}</p>
                        <div className="flex items-center justify-between mt-1.5 gap-2">
                          <span className={cn(
                            "text-[9px] opacity-60 font-medium",
                            isOwnMessage ? "text-primary-foreground/80" : "text-muted-foreground"
                          )}>
                            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <div className="flex items-center gap-1 ml-auto">
                            <button
                              onClick={() => handleShareMoment(message)}
                              className={cn(
                                "p-1 rounded-full transition-all duration-200 bg-white/10 hover:bg-white/20 active:scale-90",
                                isOwnMessage ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-muted-foreground/70 hover:text-primary"
                              )}
                              title="Share as Card"
                            >
                              <Share className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                toast({
                                  title: "Pinned!",
                                  description: "Pinned to local memory.",
                                });
                              }}
                              className={cn(
                                "p-1 rounded-full transition-all duration-200 bg-white/10 hover:bg-white/20 active:scale-90",
                                isOwnMessage ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-muted-foreground/70 hover:text-primary"
                              )}
                              title="Pin"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
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

            {/* Floating Extend Button */}
            {timeRemaining < 300000 && (
              <div className="absolute bottom-[90px] left-0 right-0 flex justify-center z-20 pointer-events-none">
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
            <div className="p-3 md:p-4 border-t border-white/10 bg-background/80 dark:bg-black/80 backdrop-blur-lg flex flex-col gap-3">
              <TruthOrDareBot
                onSend={(msg) => handleSendMessage(undefined, msg)}
                messages={messages}
              />
              <form onSubmit={handleSendMessage} className="flex gap-3 w-full max-w-4xl mx-auto">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={
                    room.status === 'active'
                      ? "Type a message..."
                      : "Expired"
                  }
                  disabled={room.status === 'expired'}
                  className="flex-1 h-12 bg-muted/50 dark:bg-white/5 border-transparent focus:border-primary/50 text-base"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-12 w-12 shrink-0 shadow-lg shadow-primary/20 rounded-xl"
                  disabled={!newMessage.trim() || room.status === 'expired'}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>

          </div>
        </div>

        {/* RIGHT AD GUTTER (Hidden on mobile) */}
        <div className="hidden xl:flex flex-1 items-center justify-center border-l border-white/5 bg-black/20 p-4">
          <div className="text-center opacity-30 select-none">
            <ImageIcon className="w-12 h-12 mx-auto mb-2 text-white/20" />
            <p className="text-sm font-mono tracking-widest uppercase text-white/40">Ad Space Right</p>
          </div>
        </div>

      </div>
    </div >
  );
}
