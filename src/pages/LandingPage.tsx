import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
// In motion v12, React components are imported from 'motion/react'
import { motion } from 'motion/react';
import {
  Sparkles,
  UserCircle,
  Shield,
  Clock,
  Zap,
  Users,
  Lock,
  Trash2,
  QrCode,
  MessageSquare,
  Timer,
  CheckCircle,
  Moon,
  Sun,
  ArrowRight,
  Terminal,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const [roomCode, setRoomCode] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  // Initialize dark mode on component mount
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') !== 'false';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

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
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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
      idx: 1,
      title: 'Create or Join',
      description: 'Admin creates a room with custom settings. Users join with a simple code or QR scan.',
      icon: Users
    },
    {
      idx: 2,
      title: 'Get Anonymous Avatar',
      description: 'Automatically assigned a random avatar like "Ghost-42" or "Ninja-15". No personal info needed.',
      icon: UserCircle
    },
    {
      idx: 3,
      title: 'Chat Freely',
      description: 'Share thoughts anonymously. Real-time messaging with complete privacy protection.',
      icon: MessageSquare
    },
    {
      idx: 4,
      title: 'Timer Expires',
      description: 'When time runs out, all messages and room data are permanently deleted. Zero trace.',
      icon: Timer
    }
  ];

  const pricingPlans = [
    {
      name: 'Free Access',
      price: '₹0',
      duration: '10 Minutes / Room',
      features: ['Full Anonymity', 'Random Avatars', 'Real-time Chat'],
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
      name: 'Pro',
      price: '₹49',
      duration: '+30 minutes',
      features: [
        'All free features',
        'Double extended time',
        'Best for long talks',
        'Crystal clear privacy',
        'Dedicated help'
      ],
      popular: false
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

  // State to track local upvotes for carousels
  const [localSecrets, setLocalSecrets] = useState([
    { id: 1, text: "I actually sent an anonymous text to my ex just to see if they'd reply. They didn't.", gradient: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30", glow: "shadow-amber-500/20", votes: 421, voted: false },
    { id: 2, text: "I've been 'mentally dating' my co-worker for two years. He has no idea I exist outside of meetings.", gradient: "from-purple-500/20 to-indigo-500/20", border: "border-purple-500/30", glow: "shadow-purple-500/20", votes: 892, voted: false },
    { id: 3, text: "I once faked a flat tire just so I wouldn't have to go to a boring family dinner. I stayed in bed eating pizza.", gradient: "from-rose-500/20 to-pink-500/20", border: "border-rose-500/30", glow: "shadow-rose-500/20", votes: 154, voted: false },
    { id: 4, text: "I still have my high school crush's middle school yearbook. I look at it every time I'm drunk.", gradient: "from-purple-500/20 to-indigo-500/20", border: "border-purple-500/30", glow: "shadow-purple-500/20", votes: 632, voted: false },
    { id: 5, text: "I tell everyone I'm a vegetarian but I secretly eat bacon in my car when no one is looking.", gradient: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30", glow: "shadow-amber-500/20", votes: 219, voted: false },
    { id: 6, text: "I let my neighbor's dog into my house for snacks because my own cat is a jerk and won't cuddle.", gradient: "from-rose-500/20 to-pink-500/20", border: "border-rose-500/30", glow: "shadow-rose-500/20", votes: 98, voted: false },
    { id: 7, text: "I've been using my roommate's Netflix account for three years. I'm 'Guest 2'. They think it's a glitch.", gradient: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30", glow: "shadow-amber-500/20", votes: 443, voted: false }
  ]);

  const handleUpvote = (id: number) => {
    setLocalSecrets(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, votes: s.voted ? s.votes - 1 : s.votes + 1, voted: !s.voted };
      }
      return s;
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
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
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How It Works</a>
              <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
              <button onClick={() => navigate('/wall')} className="text-sm font-medium hover:text-primary transition-colors">Global Wall</button>
              <a href="#join" className="text-sm font-medium hover:text-primary transition-colors">Join Now</a>
            </nav>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="w-9 h-9 p-0"
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleAdminDashboard}>
                My Rooms
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 xl:py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-50 dark:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl float-delayed" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="outline" className="text-sm px-4 py-1 border-primary/20 bg-primary/5 text-primary">
              🎭 Ephemeral Anonymous Chat Platform
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold gradient-text neon-glow leading-tight fade-in-up stagger-2">
              Share Secrets.<br />Leave No Trace.
            </h2>
            <p className="text-base md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto fade-in-up stagger-3 px-4 leading-relaxed">
              Time-limited anonymous chat rooms where conversations vanish into the void.
              No signup. No history. Complete privacy.
            </p>
            <div className="flex flex-col xl:flex-row gap-4 justify-center items-center pt-4 fade-in-up stagger-4">
              <Button size="lg" className="text-lg px-10 py-7 btn-shimmer hover-scale shadow-lg shadow-primary/20" onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}>
                <Sparkles className="w-5 h-5 mr-2" />
                Join a Room Now
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 btn-shimmer hover-scale border-primary/20 hover:bg-primary/5" onClick={handleCreateRoom}>
                Create Room
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 xl:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-sm px-4 py-1 border-primary/20">Features</Badge>
            <h3 className="text-3xl xl:text-5xl font-bold gradient-text">
              Built for Privacy & Anonymity
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card border-white/5 dark:border-white/10 hover:border-primary/50 transition-all duration-500 bg-background/50 dark:bg-card/50">
                <CardHeader className="p-4 md:p-6 text-center lg:text-left">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto lg:mx-0 hover-scale shadow-inner">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0 text-center lg:text-left">
                  <p className="text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Whisper Carousel - Refining with Blurred Gradient Aesthetics and Spicy Confessions */}
      <section className="py-24 relative overflow-hidden bg-slate-50/50 dark:bg-black/40 border-y border-border/50 transition-colors">
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[150px] -z-10 animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-purple-600/10 dark:bg-purple-600/5 rounded-full blur-[150px] -z-10 animate-pulse-delayed" />

        <div className="container mx-auto px-4 mb-16 relative z-20">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="px-6 py-1 bg-primary/5 border-primary/20 text-primary font-bold">🎡 Top Wildest Secrets</Badge>
            <h2 className="text-4xl md:text-6xl font-bold mt-4 tracking-tight text-foreground/90 dark:text-white/90">
              The <span className="text-primary italic">Whisper</span> Carousel
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto italic font-medium">
              "Real secrets from real users, drifting through the digital void."
            </p>
          </div>
        </div>

        {/* Infinite Marquee Carousel */}
        <div className="relative w-full overflow-hidden py-10 z-20">
          <motion.div
            className="flex gap-6 md:gap-10 whitespace-nowrap"
            animate={{ x: [0, -2000] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear"
              }
            }}
          >
            {/* Double the array for infinite loop effect */}
            {[...localSecrets, ...localSecrets, ...localSecrets].map((item, index) => (
              <motion.div
                key={`${item.id}-${index}`}
                whileHover={{ scale: 1.05, translateY: -12 }}
                className={cn(
                  "inline-block w-[320px] md:w-[450px] h-[260px] md:h-[320px] p-8 md:p-12 rounded-[2.5rem] border backdrop-blur-3xl transition-all cursor-default relative overflow-hidden group shrink-0",
                  "bg-white/40 dark:bg-white/5 border-white/20 dark:border-white/10",
                  item.border,
                  "shadow-xl hover:shadow-2xl",
                  item.glow
                )}
              >
                {/* Internal Blurred Gradient */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-30 dark:opacity-20 blur-3xl -z-10 group-hover:opacity-50 dark:group-hover:opacity-40 transition-opacity duration-700",
                  item.gradient
                )} />

                <div className="h-full flex flex-col justify-center relative z-10">
                  <div className="mb-4">
                    <Zap className="w-5 h-5 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xl md:text-2xl font-bold leading-relaxed italic text-foreground/80 dark:text-white/80 group-hover:text-foreground dark:group-hover:text-white transition-colors whitespace-normal break-words tracking-tight">
                    "{item.text}"
                  </p>
                </div>

                <div className="absolute top-6 right-8 z-30">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpvote(item.id);
                    }}
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-bold transition-all p-2 rounded-full hover:bg-primary/10 active:scale-90",
                      item.voted ? "text-primary" : "text-primary/60 group-hover:text-primary"
                    )}
                  >
                    <Heart className={cn("w-4 h-4 transition-all", item.voted ? "fill-primary" : "fill-primary/20 group-hover:fill-primary/40")} />
                    <span>{item.votes}</span>
                  </button>
                </div>

                {/* Decorative glow corner */}
                <div className={cn(
                  "absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[80px] opacity-20 dark:opacity-10 group-hover:opacity-40 transition-all duration-1000",
                  item.gradient
                )} />
              </motion.div>
            ))}
          </motion.div>

          {/* Gradient Overlays for smooth edges - Theme Adjusted */}
          <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-background to-transparent z-30 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-background to-transparent z-30 pointer-events-none" />
        </div>

        <div className="container mx-auto px-4 mt-20 text-center relative z-20 space-y-6">
          <Button
            variant="outline"
            onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-primary/5 border-primary/20 text-primary hover:bg-primary-foreground hover:text-primary rounded-full px-12 py-7 h-auto group transition-all font-bold text-lg shadow-lg hover:shadow-primary/20 mr-4"
          >
            Whisper Your Secret
            <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-2" />
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigate('/wall')}
            className="text-muted-foreground hover:text-primary transition-all font-bold text-lg group"
          >
            View All Global Whispers
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 xl:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-sm px-4 py-1 border-primary/20">How It Works</Badge>
            <h3 className="text-3xl xl:text-5xl font-bold gradient-text">
              Simple. Fast. Anonymous.
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative group">
                <Card className="glass-card h-full border-white/5 dark:border-white/10 group-hover:border-primary/50 transition-all duration-500 bg-background/50 dark:bg-card/50">
                  <CardHeader>
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 mx-auto hover-scale shadow-inner transition-transform group-hover:rotate-6">
                      <item.icon className="w-10 h-10 text-primary transition-transform duration-300" />
                    </div>
                    <div className="text-center">
                      <Badge className="mb-3 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">Step {item.idx}</Badge>
                      <CardTitle className="text-2xl font-bold">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center text-base leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Restored to original 4 carts */}
      <section id="pricing" className="py-20 xl:py-32 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-sm px-4 py-1 border-primary/20">Pricing</Badge>
            <h3 className="text-3xl xl:text-5xl font-bold gradient-text">
              Pay Only When You Need More Time
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={cn(
                  "glass-card relative flex flex-col items-center p-8 text-center transition-all duration-500 hover:scale-[1.03] border-white/5 dark:border-white/10 bg-background/50 dark:bg-card/50",
                  plan.popular ? 'border-primary shadow-2xl shadow-primary/20 border-2 scale-[1.05]' : 'hover:border-primary/30'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground text-xs font-black uppercase px-4 py-1 shadow-lg">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center p-0 mb-4 pb-0">
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  <div className="py-4">
                    <div className="text-4xl font-black text-primary">{plan.price}</div>
                    <div className="text-sm font-medium text-muted-foreground mt-1">{plan.duration}</div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 mb-8 text-left w-full overflow-hidden">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs font-medium">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span className="truncate">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-0 w-full mt-auto">
                  <Button className="w-full h-11 btn-shimmer group font-bold text-sm" variant={plan.popular ? 'default' : 'outline'}>
                    Choose Plan
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Room Section */}
      <section id="join" className="py-20 xl:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full opacity-30 animate-pulse" />
            <Card className="glass-card relative border-primary/20 overflow-hidden bg-background/80 dark:bg-card/80 shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 mx-auto hover-scale shadow-inner">
                  <Terminal className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-4xl font-black gradient-text mb-4 tracking-tight">Join a Room</CardTitle>
                <CardDescription className="text-lg font-medium text-muted-foreground px-4">
                  Enter a 6-character room code to join an anonymous chat session instantly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 px-6 md:px-12 pb-12">
                <div className="flex flex-col md:flex-row gap-4">
                  <Input
                    placeholder="E.G., ABC123"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
                    className="text-2xl h-16 text-center font-black tracking-[0.2em] bg-background/50 border-primary/20 focus:border-primary focus:ring-primary/20 shadow-inner"
                    maxLength={6}
                  />
                  <Button
                    onClick={handleJoinRoom}
                    size="lg"
                    disabled={!roomCode.trim()}
                    className="h-16 px-12 btn-shimmer hover-scale shrink-0 font-black text-lg shadow-lg shadow-primary/20"
                  >
                    Enter Room
                  </Button>
                </div>
                <div className="relative">
                  <Separator className="bg-primary/10" />
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-xs font-bold text-primary/40 uppercase tracking-widest">or</span>
                </div>
                <div className="text-center group">
                  <Button variant="link" onClick={() => navigate('/admin/create-room')} className="text-primary font-bold hover:text-primary/80 transition-all text-base">
                    Create a Private Secret Room
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer - Restored to simple original style */}
      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-primary" />
            <h4 className="font-bold text-xl gradient-text">Secret Room</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
            Ephemeral anonymous chat platform. Share secrets, leave no trace.
          </p>
          <div className="flex justify-center gap-8 mb-8 text-sm font-medium">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </div>
          <Separator className="my-8 opacity-50" />
          <p className="text-xs text-muted-foreground">
            © 2025 Secret Room. All conversations are ephemeral and end-to-end encrypted.
          </p>
        </div>
      </footer>
    </div>
  );
}
