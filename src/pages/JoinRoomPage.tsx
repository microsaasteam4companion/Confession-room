import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomApi, participantApi } from '@/db/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, Sparkles, UserCircle, ArrowRight } from 'lucide-react';
import type { Room } from '@/types';

export default function JoinRoomPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!code) {
      setError('No room code provided');
      setLoading(false);
      return;
    }

    loadRoom();
  }, [code]);

  const loadRoom = async () => {
    try {
      setLoading(true);
      setError(null);
      const roomData = await roomApi.getRoomByCode(code!);

      if (!roomData) {
        setError('Room not found or has expired');
        return;
      }

      // Check if room has expired
      if (new Date(roomData.expires_at) < new Date()) {
        setError('This room has expired');
        await roomApi.expireRoom(roomData.id);
        return;
      }

      setRoom(roomData);
    } catch (err) {
      console.error('Failed to load room:', err);
      setError('Failed to load room');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!room) return;

    try {
      setJoining(true);

      // Generate random avatar name
      const avatarName = participantApi.generateAvatarName();

      // Join room
      const participant = await participantApi.joinRoom(room.id, avatarName);

      // Store participant ID in sessionStorage
      sessionStorage.setItem(`participant_${room.id}`, participant.id);
      sessionStorage.setItem(`avatar_${room.id}`, avatarName);

      // Navigate to chat room
      navigate(`/room/${room.id}`);
    } catch (err) {
      console.error('Failed to join room:', err);
      setError('Failed to join room. Please try again.');
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-20" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Locating secure channel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-20" />
        <Card className="w-full max-w-md glass-card relative z-10 border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-6 h-6" />
              Connection Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => navigate('/')} className="w-full" variant="outline">
              Return to Safe Zone
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!room) {
    return null;
  }

  const timeRemaining = Math.max(0, new Date(room.expires_at).getTime() - Date.now());
  const minutesRemaining = Math.floor(timeRemaining / 60000);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-bg opacity-30" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl float-delayed" />

      <Card className="w-full max-w-md glass-card relative z-10 glow-border animate-in zoom-in fade-in duration-500 mx-4">
        <CardHeader className="text-center pb-2 px-4 md:px-6">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto float">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl md:text-3xl gradient-text font-bold">
            {room.name}
          </CardTitle>
          <CardDescription className="text-sm md:text-base mt-2">
            Invited to join secure room <br />
            <span className="font-mono font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/20 inline-block mt-1">
              {room.code}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 md:space-y-8 px-4 md:px-6">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="bg-white/5 p-3 rounded-xl text-center border border-white/10 hover:border-primary/30 transition-colors">
              <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider mb-1">Duration</p>
              <p className="text-lg md:text-xl font-bold font-mono">{minutesRemaining}m</p>
            </div>
            <div className="bg-white/5 p-3 rounded-xl text-center border border-white/10 hover:border-primary/30 transition-colors">
              <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider mb-1">Capacity</p>
              <p className="text-lg md:text-xl font-bold font-mono">{room.max_participants}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground p-3 rounded-lg bg-primary/5 border border-primary/10">
              <UserCircle className="w-5 h-5 text-primary shrink-0" />
              <p>You will be assigned a random <span className="text-primary font-semibold">Anonymous Avatar</span></p>
            </div>
            <p className="text-[10px] md:text-xs text-center text-muted-foreground/60">
              ⚠️ Chat history wipes automatically when timer ends
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              onClick={handleJoinRoom}
              className="w-full h-12 text-lg btn-shimmer hover-scale shadow-lg shadow-primary/20"
              size="lg"
              disabled={joining}
            >
              {joining ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Establishing Connection...
                </>
              ) : (
                <>
                  Join Room Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
