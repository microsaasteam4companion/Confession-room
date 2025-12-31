import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomApi } from '@/db/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Clock, Users, ExternalLink, ArrowLeft, Trash2, RefreshCw } from 'lucide-react';
import type { Room } from '@/types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRooms(true);
  }, []);

  const loadRooms = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) setLoading(true);

      let allRooms: Room[] = [];

      // Load from local storage (anonymous rooms)
      const myRoomsIds = JSON.parse(localStorage.getItem('my_rooms') || '[]');
      if (myRoomsIds.length > 0) {
        // Fetch details for each room ID
        const localRoomsPromises = myRoomsIds.map((id: string) => roomApi.getRoomById(id));
        const localRooms = await Promise.all(localRoomsPromises);

        // Filter out nulls and duplicates
        const existingIds = new Set(allRooms.map(r => r.id));
        localRooms.forEach(room => {
          if (room && !existingIds.has(room.id)) {
            allRooms.push(room);
          }
        });
      }

      // Sort by created_at desc
      allRooms.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setRooms(allRooms);
    } catch (err) {
      console.error('Failed to load rooms:', err);
    } finally {
      if (isInitialLoad) setLoading(false);
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const remaining = Math.max(0, new Date(expiresAt).getTime() - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return { minutes, seconds, expired: remaining === 0 };
  };

  const isRoomExpired = (room: Room) => {
    return room.status === 'expired' || new Date(room.expires_at).getTime() < Date.now();
  };

  const activeRooms = rooms.filter(r => !isRoomExpired(r));
  const expiredRooms = rooms.filter(r => isRoomExpired(r));

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto max-w-6xl py-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-2 -ml-2"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">Admin Dashboard</h1>
            <p className="text-sm md:text-base text-muted-foreground">Manage your anonymous chat rooms</p>
          </div>
          <Button onClick={() => navigate('/admin/create-room')} size="lg" className="w-full md:w-auto">
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
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Expired: {new Date(room.expires_at).toLocaleString()}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              // Reuse: Navigate to create with same name
                              navigate(`/admin/create-room?name=${encodeURIComponent(room.name)}`);
                            }}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reuse
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete this room history?')) {
                                try {
                                  // Remove from local storage
                                  const myRoomsIds = JSON.parse(localStorage.getItem('my_rooms') || '[]');
                                  const newIds = myRoomsIds.filter((id: string) => id !== room.id);
                                  localStorage.setItem('my_rooms', JSON.stringify(newIds));

                                  // Remove from UI
                                  setRooms(prev => prev.filter(r => r.id !== room.id));

                                  // Optional: Call API to mark deleted if needed
                                  // await roomApi.deleteRoom(room.id); 
                                } catch (err) {
                                  console.error('Failed to delete', err);
                                }
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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
