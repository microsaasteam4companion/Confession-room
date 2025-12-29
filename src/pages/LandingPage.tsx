import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, LogIn, UserCircle, LogOut } from 'lucide-react';

export default function LandingPage() {
  const [roomCode, setRoomCode] = useState('');
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      navigate(`/join/${roomCode.toUpperCase()}`);
    }
  };

  const handleCreateRoom = () => {
    navigate('/admin/create-room');
  };

  const handleAdminDashboard = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold gradient-text">Secret Room</h1>
          <div className="flex items-center gap-4">
            {profile ? (
              <>
                <span className="text-sm text-muted-foreground">
                  <UserCircle className="inline w-4 h-4 mr-1" />
                  {profile.username}
                </span>
                {profile.role === 'admin' && (
                  <Button variant="outline" size="sm" onClick={handleAdminDashboard}>
                    Admin Dashboard
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                <LogIn className="w-4 h-4 mr-2" />
                Admin Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-5xl xl:text-6xl font-bold gradient-text neon-glow">
              Ephemeral Anonymous Chat
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Share your thoughts anonymously in time-limited rooms. No signup required. Complete privacy guaranteed.
            </p>
          </div>

          {/* Join Room Card */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Join a Room
              </CardTitle>
              <CardDescription>
                Enter a room code to join an anonymous chat session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter room code (e.g., ABC123)"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
                  className="text-lg"
                  maxLength={6}
                />
                <Button onClick={handleJoinRoom} size="lg" disabled={!roomCode.trim()}>
                  Join Room
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Create Room Card (Admin Only) */}
          {profile?.role === 'admin' && (
            <Card className="glass-card border-primary/50">
              <CardHeader>
                <CardTitle className="text-2xl">Create a New Room</CardTitle>
                <CardDescription>
                  Set up a new anonymous chat room with custom settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleCreateRoom} size="lg" className="w-full">
                  Create Room
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-8">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">🎭 Complete Anonymity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No signup required. Random avatars assigned automatically.
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">⏱️ Time-Limited</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Rooms expire automatically. All messages self-destruct.
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">🔒 Zero Footprint</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No chat history. No data retention. Complete privacy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>© 2025 Secret Room. All conversations are ephemeral.</p>
      </footer>
    </div>
  );
}
