import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomApi } from '@/db/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import QRCodeDataUrl from '@/components/ui/qrcodedataurl';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function CreateRoomPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [roomName, setRoomName] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [duration, setDuration] = useState(10); // minutes
  const [creating, setCreating] = useState(false);
  const [createdRoom, setCreatedRoom] = useState<{ code: string; id: string } | null>(null);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a room name',
        variant: 'destructive'
      });
      return;
    }

    try {
      setCreating(true);
      const room = await roomApi.createRoom({
        name: roomName,
        max_participants: maxParticipants,
        initial_duration: duration * 60 // convert to seconds
      });

      setCreatedRoom({ code: room.code, id: room.id });
      
      toast({
        title: 'Success',
        description: 'Room created successfully!'
      });
    } catch (err) {
      console.error('Failed to create room:', err);
      toast({
        title: 'Error',
        description: 'Failed to create room',
        variant: 'destructive'
      });
    } finally {
      setCreating(false);
    }
  };

  const roomUrl = createdRoom ? `${window.location.origin}/join/${createdRoom.code}` : '';

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-3xl gradient-text">Create New Room</CardTitle>
            <CardDescription>
              Set up a new anonymous chat room with custom settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateRoom} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="roomName">Room Name</Label>
                <Input
                  id="roomName"
                  placeholder="e.g., Secret Confessions"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  disabled={creating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min="2"
                  max="100"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(Number(e.target.value))}
                  disabled={creating}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum number of people who can join this room
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Initial Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="5"
                  max="120"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  disabled={creating}
                />
                <p className="text-xs text-muted-foreground">
                  How long the room will stay active (can be extended later)
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={creating}
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Room'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Success Dialog with QR Code */}
      <Dialog open={!!createdRoom} onOpenChange={(open) => !open && setCreatedRoom(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-text">Room Created!</DialogTitle>
            <DialogDescription>
              Share this code or QR code with participants
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Room Code</p>
              <p className="text-4xl font-bold font-mono text-primary neon-glow">
                {createdRoom?.code}
              </p>
            </div>

            <div className="flex justify-center">
              <QRCodeDataUrl text={roomUrl} width={200} />
            </div>

            <div className="space-y-2">
              <Label>Share Link</Label>
              <div className="flex gap-2">
                <Input value={roomUrl} readOnly className="font-mono text-sm" />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(roomUrl);
                    toast({ title: 'Copied!', description: 'Link copied to clipboard' });
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/admin')}
              >
                Dashboard
              </Button>
              <Button
                className="flex-1"
                onClick={() => navigate(`/room/${createdRoom?.id}`)}
              >
                Enter Room
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
