import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { roomApi } from '@/db/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Copy, ArrowLeft, LayoutDashboard, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCodeDataUrl from '@/components/ui/qrcodedataurl';

export default function CreateRoomPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();

  const [roomName, setRoomName] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [duration, setDuration] = useState(10); // minutes
  const [isLoading, setIsLoading] = useState(false);
  const [createdRoom, setCreatedRoom] = useState<{ code: string; id: string } | null>(null);

  // Pre-fill name from URL if reusing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get('name');
    if (nameParam) {
      setRoomName(nameParam);
    }
  }, []);

  const handlePaymentFlow = async () => {
    try {
      setIsLoading(true);

      // Save pending room details
      sessionStorage.setItem('pending_room_params', JSON.stringify({
        name: roomName,
        max_participants: maxParticipants,
        initial_duration: duration * 60
      }));

      // Redirect to Plan Selection Page
      navigate('/select-plan');
    } catch (err) {
      console.error('Navigation Error:', err);
      toast({
        title: 'Error',
        description: 'Could not proceed to plan selection.',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomName.trim()) {
      toast({ title: 'Error', description: 'Please enter a room name', variant: 'destructive' });
      return;
    }

    // CHECK: First One Free Logic
    const myRooms = JSON.parse(localStorage.getItem('my_rooms') || '[]');
    if (myRooms.length > 0) {
      // User has already created a room -> Enforce Payment
      await handlePaymentFlow();
      return;
    }

    try {
      setIsLoading(true);

      const newRoom = await roomApi.createRoom({
        name: roomName,
        max_participants: maxParticipants,
        initial_duration: duration * 60
      });

      setCreatedRoom({ code: newRoom.code, id: newRoom.id });

      // Save to local storage
      myRooms.push(newRoom.id);
      localStorage.setItem('my_rooms', JSON.stringify(myRooms));

      toast({ title: 'Success', description: 'Room created successfully!' });
    } catch (err) {
      console.error('Failed to create room:', err);
      toast({ title: 'Error', description: 'Failed to create room', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const copyRoomLink = () => {
    if (createdRoom) {
      const url = `${window.location.origin}/join/${createdRoom.code}`;
      navigator.clipboard.writeText(url);
      toast({
        title: 'Copied!',
        description: 'Room link copied to clipboard'
      });
    }
  };

  const roomUrl = createdRoom ? `${window.location.origin}/join/${createdRoom.code}` : '';

  return (
    <div className="min-h-screen p-4 flex items-center justify-center relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl float-delayed" />

      <Card className="glass-card w-full max-w-lg relative z-10 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-2xl gradient-text">Create Secret Room</CardTitle>
          </div>
          <CardDescription>
            Configure your anonymous room settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateRoom} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="roomName">Room Name</Label>
              <Input
                id="roomName"
                placeholder="e.g. Late Night Talks"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
                className="bg-background/50"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Max Participants</Label>
                <span className="text-sm font-mono text-primary">{maxParticipants}</span>
              </div>
              <Slider
                value={[maxParticipants]}
                onValueChange={(vals) => setMaxParticipants(vals[0])}
                min={2}
                max={50}
                step={1}
                className="py-4"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Initial Duration (Minutes)</Label>
                <span className="text-sm font-mono text-primary">{duration}m</span>
              </div>
              <Slider
                value={[duration]}
                onValueChange={(vals) => setDuration(vals[0])}
                min={5}
                max={60}
                step={5}
                className="py-4"
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full btn-shimmer group" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Universe...
                </>
              ) : (
                <>
                  Create Room
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={!!createdRoom} onOpenChange={(open) => !open && setCreatedRoom(null)}>
        <DialogContent className="bg-[hsl(var(--glass-bg))] backdrop-blur-xl border border-[hsl(var(--glass-border))] shadow-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl gradient-text">Room Ready!</DialogTitle>
            <DialogDescription className="text-center">
              Share this code or QR with your friends
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="bg-white p-4 rounded-xl">
              <QRCodeDataUrl text={roomUrl} width={200} />
            </div>

            <div className="text-center space-y-2 w-full">
              <p className="text-sm text-muted-foreground">Room Code</p>
              <div className="text-4xl font-mono font-bold tracking-wider text-primary select-all">
                {createdRoom?.code}
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1" onClick={copyRoomLink}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button
                className="flex-1 transform-none transition-none hover:transform-none !scale-100"
                onClick={() => navigate(`/room/${createdRoom?.id}`)}
              >
                Enter Room
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
