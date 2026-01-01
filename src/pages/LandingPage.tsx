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
  CheckCircle2,
  Moon,
  Sun,
  ArrowRight,
  Terminal,
  Heart
} from 'lucide-react';
import { supabase } from '../db/supabase';

interface Secret {
  id: string; // UUID from DB
  text: string;
  ghostId: string;
  votes: number;
  avatar: string;
  voted?: boolean; // Local state only
}
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
      price: '$0',
      duration: '10 Minutes / Room',
      features: ['Full Anonymity', 'Random Avatars', 'Real-time Chat'],
      popular: false
    },
    {
      name: 'Standard',
      price: '$0.99',
      duration: '+15 minutes',
      features: ['All free features', 'Extended chat time', 'Better value', 'Multiple extensions', 'Priority support'],
      popular: true,
      hot: false // "Most Popular" is usually what 'popular' flag triggers
    },
    {
      name: 'Pro',
      price: '$1.99',
      duration: '+30 minutes',
      features: ['All free features', 'Double extended time', 'Best for long talks', 'Crystal clear privacy', 'Dedicated help'],
      popular: false
    },
    {
      name: 'Premium',
      price: '$3.99',
      duration: '+1 hour',
      features: ['All free features', 'Maximum chat time', 'Best value per minute', 'Deep conversations', 'VIP experience'],
      popular: false
    }
  ];

  // State to track secrets from DB
  const [localSecrets, setLocalSecrets] = useState<Secret[]>([]);

  // Fetch secrets on mount
  useEffect(() => {
    fetchSecrets();
  }, []);

  const fetchSecrets = async () => {
    try {
      const { data, error } = await supabase
        .from('secrets')
        .select('*')
        .order('votes', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Map DB structure to UI structure if needed (currently 1:1 matches mostly)
        // Ensure we handle the 'voted' state locally (default false as we don't auth users yet)
        setLocalSecrets((data as any[]).map(s => ({
          id: s.id,
          text: s.content, // Map content to text
          ghostId: s.ghost_id, // Map ghost_id to ghostId
          votes: s.votes,
          avatar: s.avatar,
          voted: false
        })));
      } else {
        // If DB is empty, seed it (Onetime)
        seedSecrets();
      }
    } catch (err) {
      console.error('Error fetching secrets:', err);
    }
  };

  const seedSecrets = async () => {
    const initialSecrets = [
      { content: "I actually sent an anonymous text to my ex just to see if they'd reply. They didn't.", ghost_id: "GHOST-42", votes: 421, avatar: "👻" },
      { content: "I've been 'mentally dating' my co-worker for two years. He has no idea I exist outside of meetings.", ghost_id: "GHOST-43", votes: 892, avatar: "🦊" },
      { content: "I once faked a flat tire just so I wouldn't have to go to a boring family dinner. I stayed in bed eating pizza.", ghost_id: "GHOST-44", votes: 154, avatar: "🐱" },
      { content: "I still have my high school crush's middle school yearbook. I look at it every time I'm drunk.", ghost_id: "GHOST-45", votes: 632, avatar: "🐼" },
      { content: "I tell everyone I'm a vegetarian but I secretly eat bacon in my car when no one is looking.", ghost_id: "GHOST-46", votes: 219, avatar: "🦁" },
      { content: "I let my neighbor's dog into my house for snacks because my own cat is a jerk and won't cuddle.", ghost_id: "GHOST-47", votes: 98, avatar: "🐨" },
      { content: "I've been using my roommate's Netflix account for three years. I'm 'Guest 2'. They think it's a glitch.", ghost_id: "GHOST-48", votes: 443, avatar: "🐰" }
    ];

    const { error } = await supabase.from('secrets').insert(initialSecrets);
    if (!error) {
      fetchSecrets(); // Reload after seed
    }
  };

  const handleUpvote = async (id: string) => {
    // Optimistic Update
    setLocalSecrets(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, votes: s.voted ? s.votes - 1 : s.votes + 1, voted: !s.voted };
      }
      return s;
    }));

    // Find the secret to determine increment/decrement
    const secret = localSecrets.find(s => s.id === id);
    if (!secret) return;

    const increment = !secret.voted ? 1 : -1;

    // Persist to DB
    // Note: This simple update is vulnerable to race conditions under high load, 
    // but sufficient for this demo. Ideally use an RPC 'increment_vote' function.
    try {
      const { error } = await supabase.rpc('increment_secret_vote', {
        row_id: id,
        inc: increment
      });

      // Fallback if RPC doesn't exist (using direct update, less safe)
      if (error) {
        const { error: updateError } = await supabase
          .from('secrets')
          .update({ votes: secret.votes + increment })
          .eq('id', id);

        if (updateError) console.error("Update failed", updateError);
      }
    } catch (err) {
      console.error("Vote persistence failed", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-xl transition-all duration-300">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20 group">
                <span className="text-white font-black text-lg group-hover:scale-110 transition-transform">SR</span>
              </div>
              <h1 className="text-xl font-black tracking-tighter text-foreground dark:text-white">SECRETROOM</h1>
            </div>

            <nav className="hidden xl:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <a href="#features" className="text-sm font-black uppercase hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-black uppercase hover:text-primary transition-colors">How It Works</a>
              <a href="#pricing" className="text-sm font-black uppercase hover:text-primary transition-colors">Pricing</a>
              <button onClick={() => navigate('/wall')} className="text-sm font-black uppercase hover:text-primary transition-colors">Global Wall</button>
              <a href="#join" className="text-sm font-black uppercase hover:text-primary transition-colors">Join Now</a>
            </nav>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="w-10 h-10 p-0 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button variant="default" size="lg" className="rounded-full font-black px-8 shadow-lg shadow-primary/20" onClick={() => navigate('/admin')}>
                MY ROOMS
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Redesigned for Massive Impact */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-40 pb-16 px-4 grid-bg overflow-hidden translate-y-[-5vh]">
        <div className="container mx-auto max-w-7xl relative z-10 text-center">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-pink-500/20 bg-pink-500/5 mb-12"
          >
            <span className="text-[10px] md:text-xs font-black tracking-[0.2em] text-pink-500 uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              🛰️ Anonymous Communication Layer
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="space-y-0 mb-12"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.85] uppercase">
              Share Secrets.
            </h1>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase cycling-gradient italic">
              Leave No Trace.
            </h1>
          </motion.div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed mb-16 px-4"
          >
            Time-limited anonymous chat nodes where words dissolve into the void. <span className="text-slate-900 dark:text-white font-bold">No signup. No history. Pure privacy.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button
              size="lg"
              onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}
              className="h-16 px-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-lg hover:scale-105 transition-transform shadow-2xl"
            >
              JOIN A ROOM NOW
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/admin/create-room')}
              className="h-16 px-12 rounded-2xl border-2 border-slate-200 dark:border-white/10 font-bold text-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
            >
              CREATE A ROOM
            </Button>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      </section>

      {/* Features Section - Redesigned to 1+4 Grid */}
      <section id="features" className="py-24 xl:py-32 bg-slate-50/30 dark:bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-20">
            <Badge variant="outline" className="text-sm px-6 py-1 bg-primary/5 border-primary/20 text-primary font-bold uppercase tracking-wider">Features</Badge>
            <h3 className="text-4xl xl:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
              Built for <span className="text-primary italic">Absolute</span> Privacy and Anonymity
            </h3>
          </div>

          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-stretch">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Top Card - Complete Anonymity - Full Width */}
              <div className="w-full">
                <Card className="rounded-[3rem] border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-primary opacity-80" />
                  <div className="p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-24 h-24 shrink-0 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform text-primary">
                      {(() => {
                        const Icon = features[0].icon;
                        return <Icon className="w-12 h-12" />;
                      })()}
                    </div>
                    <div className="text-center md:text-left">
                      <CardTitle className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4">{features[0].title}</CardTitle>
                      <p className="text-base text-slate-500 dark:text-gray-400 font-medium leading-relaxed max-w-3xl">
                        {features[0].description}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Bottom Grid - Remaining Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.slice(1, 6).map((feature, idx) => (
                  <Card key={idx} className="rounded-[2.5rem] border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900 shadow-sm flex flex-col p-8 md:p-10 group hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-8 group-hover:-translate-y-1 transition-transform text-primary">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">{feature.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-gray-400 font-medium leading-[1.6]">
                      {feature.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Whisper Carousel - Refining with Blurred Gradient Aesthetics and Spicy Confessions */}
      < section className="py-24 relative overflow-hidden bg-slate-50/50 dark:bg-black/40 border-y border-border/50 transition-colors" >
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
                whileHover={{ scale: 1.02, translateY: -8 }}
                className={cn(
                  "inline-block w-[320px] md:w-[480px] h-[280px] md:h-[340px] p-8 md:p-12 rounded-[2.5rem] border transition-all cursor-default relative overflow-hidden group shrink-0 shadow-sm hover:shadow-md",
                  "bg-[#f0f2f5] dark:bg-zinc-900 border-black/5 dark:border-white/5"
                )}
              >
                <div className="h-full flex flex-col justify-between relative z-10">
                  <p className="text-xl md:text-2xl font-black italic leading-[1.3] text-slate-800 dark:text-white/90 whitespace-normal break-words tracking-tight">
                    "{item.text}"
                  </p>

                  <div className="flex justify-between items-end mt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center text-2xl shadow-sm border border-black/5 dark:border-white/5">
                        {item.avatar}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-700 dark:text-white/80 uppercase tracking-tighter">{item.ghostId}</span>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest">Verified Identity</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpvote(item.id);
                      }}
                      className={cn(
                        "vote-badge transition-all active:scale-90",
                        item.voted ? "bg-pink-100 border-pink-300" : "hover:bg-pink-50"
                      )}
                    >
                      <Heart className={cn("w-4 h-4 transition-all", item.voted ? "fill-pink-500 text-pink-500" : "text-pink-400")} />
                      <span>{item.votes}</span>
                    </button>
                  </div>
                </div>
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
      </section >

      {/* How It Works Section */}
      < section id="how-it-works" className="py-20 xl:py-32" >
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
      </section >

      {/* Pricing Section */}
      < section id="pricing" className="py-32 grid-bg relative" >
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 mb-24">
            <h3 className="text-5xl md:text-7xl wide-headline text-foreground">
              UPGRADE THE VOID
            </h3>
            <p className="text-primary font-black tracking-[0.2em] uppercase text-sm">
              Pay only for the existence you need
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
            {pricingPlans.map((plan: any, index) => (
              <div key={index} className="relative group flex">
                <Card
                  className={cn(
                    "relative flex flex-col items-start p-10 backdrop-blur-2xl transition-all duration-700 rounded-[2.5rem] border-black/5 dark:border-white/5 overflow-hidden flex-1",
                    "bg-white/80 dark:bg-black/60",
                    plan.popular ? 'border-primary shadow-[0_0_50px_rgba(255,0,128,0.15)] ring-1 ring-primary/50' : 'hover:border-primary/20'
                  )}
                >
                  {plan.hot && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className="hot-tag">HOT</span>
                    </div>
                  )}

                  {/* Glowing background for popular */}
                  {plan.popular && (
                    <div className="absolute inset-0 bg-primary/5 opacity-50 blur-3xl -z-10" />
                  )}

                  <CardHeader className="p-0 mb-6 space-y-1">
                    <span className="text-slate-500 dark:text-muted-foreground text-[10px] font-black tracking-widest uppercase">{plan.name}</span>
                    <CardTitle className="text-5xl font-black text-slate-900 dark:text-white">{plan.price}</CardTitle>
                    <p className="text-primary font-bold text-xs">{plan.duration}</p>
                  </CardHeader>

                  <CardContent className="p-0 mb-10 w-full">
                    <ul className="space-y-4">
                      {plan.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-3 text-slate-600 dark:text-white/70 font-bold text-xs uppercase tracking-tight">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary fill-primary/20" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="p-0 w-full mt-auto">
                    <Button
                      className={cn(
                        "w-full h-14 rounded-2xl font-black text-xs tracking-widest uppercase transition-all duration-300",
                        plan.popular
                          ? "bg-primary text-white hover:bg-primary/90 shadow-[0_10px_20px_rgba(255,0,128,0.3)] hover:translate-y-[-2px]"
                          : "bg-slate-100 text-slate-900 border border-slate-200 hover:bg-slate-200 dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
                      )}
                    >
                      INITIALIZE BILLING
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Join Room Section */}
      < section id="join" className="py-20 xl:py-32 relative overflow-hidden" >
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
      </section >

      {/* Footer - Restored to simple original style */}
      < footer className="border-t border-border py-12 bg-muted/30" >
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
      </footer >
    </div >
  );
}
