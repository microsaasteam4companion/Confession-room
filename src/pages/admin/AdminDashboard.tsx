import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { roomApi } from '@/db/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Clock, Users, ExternalLink, ArrowLeft } from 'lucide-react';
import type { Room } from '@/types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role !== 'admin') {
      navigate('/');
      return;
    }

    loadRooms();
  }, [profile]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      if (profile?.id) {
        const roomsData = await roomApi.getUserRooms(profile.id);
        setRooms(roomsData);
      }
    } catch (err) {
      console.error('Failed to load rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const remaining = Math.max(0, new Date(expiresAt).getTime() - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return { minutes, seconds, expired: remaining === 0 };
  };

  const activeRooms = rooms.filter(r => r.status === 'active');
  const expiredRooms = rooms.filter(r => r.status === 'expired');

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto max-w-6xl py-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-4xl font-bold gradient-text">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your anonymous chat rooms</p>
          </div>
          <Button onClick={() => navigate('/admin/create-room')} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Create Room
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Active Rooms */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Active Rooms ({activeRooms.length})</h2>
              {activeRooms.length === 0 ? (
                <Card className="glass-card">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <p>No active rooms. Create one to get started!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {activeRooms.map((room) => {
                    const { minutes, seconds, expired } = getTimeRemaining(room.expires_at);
                    return (
                      <Card key={room.id} className="glass-card">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl">{room.name}</CardTitle>
                              <CardDescription>
                                Code: <span className="font-mono font-bold text-primary">{room.code}</span>
                              </CardDescription>
                            </div>
                            <Badge variant={expired ? "destructive" : "default"}>
                              {expired ? 'Expired' : 'Active'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {expired ? 'Expired' : `${minutes}m ${seconds}s`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span>Max: {room.max_participants}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                const url = `${window.location.origin}/join/${room.code}`;
                                navigator.clipboard.writeText(url);
                              }}
                            >
                              Copy Link
                            </Button>
                            <Button
                              className="flex-1"
                              onClick={() => navigate(`/room/${room.id}`)}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Enter
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Expired Rooms */}
            {expiredRooms.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Expired Rooms ({expiredRooms.length})</h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {expiredRooms.map((room) => (
                    <Card key={room.id} className="glass-card opacity-60">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{room.name}</CardTitle>
                            <CardDescription>
                              Code: <span className="font-mono">{room.code}</span>
                            </CardDescription>
                          </div>
                          <Badge variant="secondary">Expired</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Expired: {new Date(room.expires_at).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
