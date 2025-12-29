import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  LogIn, 
  UserCircle, 
  LogOut, 
  Shield, 
  Clock, 
  Zap, 
  Users, 
  Lock, 
  Trash2, 
  QrCode, 
  MessageSquare, 
  Timer, 
  CreditCard,
  CheckCircle,
  Moon,
  Sun
} from 'lucide-react';

export default function LandingPage() {
  const [roomCode, setRoomCode] = useState('');
  const [darkMode, setDarkMode] = useState(true);
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const features = [
    {
      icon: Shield,
      title: 'Complete Anonymity',
      description: 'No signup required. Join instantly with a random avatar. Your identity stays hidden.'
    },
    {
      icon: Clock,
      title: 'Time-Limited Sessions',
      description: 'Rooms expire automatically. All messages self-destruct when the timer reaches zero.'
    },
    {
      icon: Trash2,
      title: 'Zero Digital Footprint',
      description: 'No chat history. No data retention. Complete privacy guaranteed by design.'
    },
    {
      icon: Zap,
      title: 'Real-Time Messaging',
      description: 'Instant message delivery with WebSocket technology. Chat flows naturally.'
    },
    {
      icon: QrCode,
      title: 'Easy Access',
      description: 'Share QR codes or simple room codes. Join from any device in seconds.'
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'End-to-end encryption. Row-level security. Your conversations stay private.'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Create or Join',
      description: 'Admin creates a room with custom settings. Users join with a simple code or QR scan.',
      icon: Users
    },
    {
      step: '2',
      title: 'Get Anonymous Avatar',
      description: 'Automatically assigned a random avatar like "Ghost-42" or "Ninja-15". No personal info needed.',
      icon: UserCircle
    },
    {
      step: '3',
      title: 'Chat Freely',
      description: 'Share thoughts anonymously. Real-time messaging with complete privacy protection.',
      icon: MessageSquare
    },
    {
      step: '4',
      title: 'Timer Expires',
      description: 'When time runs out, all messages and room data are permanently deleted. Zero trace.',
      icon: Timer
    }
  ];

  const pricingPlans = [
    {
      name: 'Free Tier',
      price: '₹0',
      duration: '10 minutes',
      features: [
        'Anonymous chat access',
        'Random avatar assignment',
        'Real-time messaging',
        'Auto-delete on expiry',
        'QR code access'
      ],
      popular: false
    },
    {
      name: 'Quick Extend',
      price: '₹10',
      duration: '+5 minutes',
      features: [
        'All free features',
        'Extend active session',
        'Continue conversations',
        'Instant activation',
        'Secure payment'
      ],
      popular: false
    },
    {
      name: 'Standard',
      price: '₹29',
      duration: '+15 minutes',
      features: [
        'All free features',
        'Extended chat time',
        'Better value',
        'Multiple extensions',
        'Priority support'
      ],
      popular: true
    },
    {
      name: 'Premium',
      price: '₹99',
      duration: '+1 hour',
      features: [
        'All free features',
        'Maximum chat time',
        'Best value per minute',
        'Deep conversations',
        'VIP experience'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">Secret Room</h1>
            </div>
            <nav className="hidden xl:flex items-center gap-6">
              <a href="#features" className="text-sm hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm hover:text-primary transition-colors">How It Works</a>
              <a href="#pricing" className="text-sm hover:text-primary transition-colors">Pricing</a>
              <a href="#join" className="text-sm hover:text-primary transition-colors">Join Now</a>
            </nav>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="hidden xl:flex"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              {profile ? (
                <>
                  <span className="text-sm text-muted-foreground hidden xl:flex items-center gap-1">
                    <UserCircle className="w-4 h-4" />
                    {profile.username}
                  </span>
                  {profile.role === 'admin' && (
                    <Button variant="outline" size="sm" onClick={handleAdminDashboard}>
                      Dashboard
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    <LogOut className="w-4 h-4 xl:mr-2" />
                    <span className="hidden xl:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                  <LogIn className="w-4 h-4 xl:mr-2" />
                  <span className="hidden xl:inline">Admin Login</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 xl:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="outline" className="text-sm px-4 py-1">
              🎭 Ephemeral Anonymous Chat Platform
            </Badge>
            <h2 className="text-4xl xl:text-7xl font-bold gradient-text neon-glow leading-tight">
              Share Secrets.<br />Leave No Trace.
            </h2>
            <p className="text-lg xl:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Time-limited anonymous chat rooms where conversations vanish into the void. 
              No signup. No history. Complete privacy.
            </p>
            <div className="flex flex-col xl:flex-row gap-4 justify-center items-center pt-4">
              <Button size="lg" className="text-lg px-8 py-6" onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}>
                <Sparkles className="w-5 h-5 mr-2" />
                Join a Room Now
              </Button>
              {profile?.role === 'admin' && (
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={handleCreateRoom}>
                  Create Room
                </Button>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>No Signup Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>100% Anonymous</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Auto-Delete Messages</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 xl:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-sm px-4 py-1">Features</Badge>
            <h3 className="text-3xl xl:text-5xl font-bold gradient-text">
              Built for Privacy & Anonymity
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every feature designed with one goal: protect your identity and ensure zero digital footprint.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card hover:border-primary/50 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 xl:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-sm px-4 py-1">How It Works</Badge>
            <h3 className="text-3xl xl:text-5xl font-bold gradient-text">
              Simple. Fast. Anonymous.
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four steps to complete anonymity. No complicated setup. Just pure, private conversations.
            </p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <Card className="glass-card h-full">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <Badge className="mb-2">Step {item.step}</Badge>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">{item.description}</p>
                  </CardContent>
                </Card>
                {index < howItWorks.length - 1 && (
                  <div className="hidden xl:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-primary/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 xl:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-sm px-4 py-1">Pricing</Badge>
            <h3 className="text-3xl xl:text-5xl font-bold gradient-text">
              Pay Only When You Need More Time
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free with 10 minutes. Extend anytime with flexible pricing options.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`glass-card relative ${plan.popular ? 'border-primary shadow-lg shadow-primary/20 scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="py-4">
                    <div className="text-4xl font-bold text-primary">{plan.price}</div>
                    <div className="text-sm text-muted-foreground mt-1">{plan.duration}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              💳 Secure payments powered by Stripe • All transactions encrypted
            </p>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section id="join" className="py-20 xl:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="glass-card border-primary/50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-3xl gradient-text">Join a Room</CardTitle>
                <CardDescription className="text-base">
                  Enter a 6-character room code to join an anonymous chat session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col xl:flex-row gap-3">
                  <Input
                    placeholder="Enter room code (e.g., ABC123)"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
                    className="text-lg h-14 text-center font-mono tracking-widest"
                    maxLength={6}
                  />
                  <Button 
                    onClick={handleJoinRoom} 
                    size="lg" 
                    disabled={!roomCode.trim()}
                    className="h-14 px-8"
                  >
                    Join Room
                  </Button>
                </div>
                <Separator />
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Don't have a code?</p>
                  {profile?.role === 'admin' ? (
                    <Button variant="outline" onClick={handleCreateRoom} className="w-full">
                      Create Your Own Room
                    </Button>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Ask an admin to create a room and share the code with you
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h3 className="text-3xl xl:text-5xl font-bold gradient-text">
              Ready to Share Anonymously?
            </h3>
            <p className="text-lg text-muted-foreground">
              Join thousands of users who trust Secret Room for private, ephemeral conversations.
            </p>
            <Button size="lg" className="text-lg px-8 py-6" onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}>
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
                <h4 className="font-bold text-lg gradient-text">Secret Room</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Ephemeral anonymous chat platform. Share secrets, leave no trace.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Product</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Security</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>End-to-End Encryption</li>
                <li>Zero Data Retention</li>
                <li>Anonymous by Design</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Community Guidelines</li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col xl:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 Secret Room. All conversations are ephemeral.</p>
            <div className="flex items-center gap-4">
              <span>Built with privacy in mind</span>
              <span>•</span>
              <span>Powered by Supabase & Stripe</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
