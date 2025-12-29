import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomApi, participantApi } from '@/db/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-6 h-6" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => navigate('/')} className="w-full">
              Back to Home
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader>
          <CardTitle className="text-3xl gradient-text text-center">
            {room.name}
          </CardTitle>
          <CardDescription className="text-center">
            Room Code: <span className="font-mono font-bold text-primary">{room.code}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 text-center">
            <p className="text-sm text-muted-foreground">
              Time Remaining: <span className="font-bold text-foreground">{minutesRemaining} minutes</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Max Participants: <span className="font-bold text-foreground">{room.max_participants}</span>
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Rules:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>You will be assigned a random anonymous avatar</li>
              <li>All messages are ephemeral and will be deleted when the timer expires</li>
              <li>Be respectful and follow community guidelines</li>
              <li>No personal information should be shared</li>
            </ul>
          </div>

          <Button 
            onClick={handleJoinRoom} 
            className="w-full" 
            size="lg"
            disabled={joining}
          >
            {joining ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              'Join Room Anonymously'
            )}
          </Button>

          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="w-full"
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
