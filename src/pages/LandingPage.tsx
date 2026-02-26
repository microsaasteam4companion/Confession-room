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
  CheckCircle2,
  Moon,
  Sun,
  ArrowRight,
  Heart,
  PlusCircle,
  MinusCircle,
  Terminal,
  Mail
} from 'lucide-react';

// Custom Social Media Icon Components
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037c-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065c0-1.138.92-2.063 2.063-2.063c1.14 0 2.064.925 2.064 2.063c0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07c3.252.148 4.771 1.691 4.919 4.919c.058 1.265.069 1.645.069 4.849c0 3.205-.012 3.584-.069 4.849c-.149 3.225-1.664 4.771-4.919 4.919c-1.266.058-1.644.07-4.85.07c-3.204 0-3.584-.012-4.849-.07c-3.26-.149-4.771-1.699-4.919-4.92c-.058-1.265-.07-1.644-.07-4.849c0-3.204.013-3.583.07-4.849c.149-3.227 1.664-4.771 4.919-4.919c1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072C2.695.272.273 2.69.073 7.052C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98c.059-1.28.073-1.689.073-4.948c0-3.259-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324a6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8a4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881a1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);
import PageMeta from '@/components/common/PageMeta';
import { supabase } from '@/db/supabase';
import { roomApi } from '@/db/api';
import { cn } from '@/lib/utils';

// Helper for default room params
const DEFAULT_ROOM_PARAMS = {
  name: "Anonymous Room",
  max_participants: 10,
  initial_duration: 420 // 7 minutes
};

interface Secret {
  id: string; // UUID from DB
  text: string;
  ghostId: string;
  votes: number;
  avatar: string;
  voted?: boolean; // Local state only
}

export default function LandingPage() {
  const [roomCode, setRoomCode] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState<string | null>(null);
  const navigate = useNavigate();

  const [votedIds, setVotedIds] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [localSecrets, setLocalSecrets] = useState<Secret[]>([]);

  // Initialize dark mode and load upvotes on mount
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Load upvote history
    try {
      const savedVotes = JSON.parse(localStorage.getItem('secret_votes') || '[]');
      setVotedIds(savedVotes);
      fetchSecrets(savedVotes);
    } catch (e) {
      console.error('Failed to parse votes:', e);
      fetchSecrets([]);
    }
  }, []);

  // No longer need second redundant useEffect

  const fetchSecrets = async (currentVotedIds?: string[]) => {
    const activeVotedIds = currentVotedIds || votedIds;
    try {
      const { data, error } = await supabase
        .from('secrets')
        .select('*')
        .order('votes', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (data && data.length > 0) {
        setLocalSecrets((data as any[]).map(s => {
          // Some records store content as a JSON string (e.g. from wall format)
          let text = s.content;
          if (typeof text === 'string' && text.trim().startsWith('{')) {
            try {
              const parsed = JSON.parse(text);
              text = parsed.text || text;
            } catch {
              // Not valid JSON, use as-is
            }
          }
          return {
            id: s.id,
            text,
            ghostId: s.ghost_id,
            votes: s.votes,
            avatar: s.avatar,
            voted: activeVotedIds.includes(s.id)
          };
        }));
      } else {
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
      { content: "I've been using my roommate's Netflix account for three years. I'm 'Guest 2'. They think it's a glitch.", ghost_id: "GHOST-48", votes: 443, avatar: "🐰" },
      { content: "I pretend to be on a phone call while walking in the street just to avoid talking to people I know.", ghost_id: "GHOST-49", votes: 567, avatar: "🦉" },
      { content: "I have a secret stash of luxury chocolate hidden in an empty frozen peas bag in the freezer.", ghost_id: "GHOST-50", votes: 312, avatar: "🐹" },
      { content: "I once accidentally liked my boss's photo from 2012 at 3 AM. I deleted my account for a whole week.", ghost_id: "GHOST-51", votes: 1204, avatar: "🐸" }
    ];

    const { error } = await supabase.from('secrets').insert(initialSecrets);
    if (!error) {
      fetchSecrets();
    }
  };

  const handleInitializeBilling = async (plan: any) => {
    if (plan.price === '₹0') {
      navigate('/admin/create-room');
      return;
    }

    try {
      setLoadingPayment(plan.name);

      const { data, error } = await roomApi.createPaymentSession({
        name: `New Room: ${plan.name}`,
        price: Number(plan.price.replace('$', '')),
        quantity: 1,
        type: 'create_room',
        product_id: plan.dodoProductId,
        metadata: {
          plan_id: plan.name.toLowerCase(),
          duration_bonus: plan.durationBonus,
          room_params: DEFAULT_ROOM_PARAMS
        }
      });

      if (error) {
        console.error('Supabase Function Error:', error);
        // Extract the actual JSON error message from the backend if available
        let detailedError = error.message;
        try {
          if (error.context) {
            const body = await error.context.json();
            if (body && body.error) {
              detailedError = body.error;
            }
          }
        } catch (e) {
          // Fallback to text if JSON parsing fails
          try {
            const text = await error.context?.text();
            if (text) detailedError = text;
          } catch (textErr) {
            // Ignore
          }
        }
        throw new Error(detailedError);
      }

      if (!data?.url) throw new Error('No checkout URL returned from backend');

      window.location.href = data.url;
    } catch (err) {
      console.error('Payment Error:', err);
      // You might want to import useToast to show error
      const errorMessage = err instanceof Error ? err.message : JSON.stringify(err);
      alert(`Payment Setup Failed: ${errorMessage}`);
    } finally {
      setLoadingPayment(null);
    }
  };

  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      navigate(`/join/${roomCode.toUpperCase()}`);
    }
  };

  const handleUpvote = async (id: string) => {
    const isVoted = votedIds.includes(id);
    const increment = isVoted ? -1 : 1;

    setLocalSecrets(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, votes: s.votes + increment, voted: !isVoted };
      }
      return s;
    }));

    // Persistence Logic
    let newVotedIds;
    if (isVoted) {
      newVotedIds = votedIds.filter(vid => vid !== id);
    } else {
      newVotedIds = [...votedIds, id];
    }
    setVotedIds(newVotedIds);
    localStorage.setItem('secret_votes', JSON.stringify(newVotedIds));

    try {
      const { error } = await supabase.rpc('increment_secret_vote', {
        row_id: id,
        inc: increment
      });

      if (error) {
        // Fallback or retry logic if needed
        console.error("RPC failed", error);
      }
    } catch (err) {
      console.error("Vote persistence failed", err);
    }
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
      duration: '7 Minutes / Room',
      features: ['Full Anonymity', 'Random Avatars', 'Real-time Chat'],
      popular: false
    },
    {
      name: 'Standard',
      price: '$0.99',
      duration: '+15 minutes',
      durationBonus: 15,
      dodoProductId: 'pdt_0NVOHP937hNKmy8IC4uPw',
      features: ['All free features', 'Extended chat time', 'Better value', 'Multiple extensions', 'Priority support'],
      popular: true,
      hot: false
    },
    {
      name: 'Pro',
      price: '$1.99',
      duration: '+30 minutes',
      durationBonus: 30,
      dodoProductId: 'pdt_0NVOHazP6EyvlJEPTCSgK',
      features: ['All free features', 'Double extended time', 'Best for long talks', 'Crystal clear privacy', 'Dedicated help'],
      popular: false
    },
    {
      name: 'Premium',
      price: '$3.99',
      duration: '+1 hour',
      durationBonus: 60,
      dodoProductId: 'pdt_0NVOHiAPdhK7HTAUzKK2E',
      features: ['All free features', 'Maximum chat time', 'Best value per minute', 'Deep conversations', 'VIP experience'],
      popular: false
    }
  ];

  const faqs = [
    {
      question: "How does the anonymity work?",
      answer: "No signup or personal info is required. You're assigned a random avatar, and your IP/data is never linked to your identity. Once a room expires, all traces are wiped."
    },
    {
      question: "Is my chat history stored?",
      answer: "Absolutely not. We follow a 'Zero Knowledge' policy. As soon as the room timer hits zero, the database records are permanently deleted. There are no backups."
    },
    {
      question: "Can I extend the room time?",
      answer: "Yes! Any participant can extend the room lifespan by choosing a plan. This adds extra minutes to the current session instantly."
    },
    {
      question: "Is Secret Room free to use?",
      answer: "We offer a 'First One Free' policy for new users to test the platform (7 minutes). For longer sessions or priority features, we offer affordable micro-plans."
    },
    {
      question: "What is the Community Wall?",
      answer: "It's a collection of anonymous confessions shared by users from their private rooms. You can choose to 'Whisper to the Void' to feature your message there."
    }
  ];

  // AEO: FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // SEO: Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://secretroom.entrext.in"
    }]
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <PageMeta
        title="Free Anonymous Chat Platform | No Signups, No Email, No Trace"
        description="Free Anonymous Chat Platform. No Login, No Email, No History. Secure and encrypted communication. Start chatting instantly."
        url="https://secretroom.entrext.in"
        type="website"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-xl transition-all duration-300">
        <div className="w-full px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20 group">
                <span className="text-sm md:text-xl group-hover:scale-110 transition-transform">🤫</span>
              </div>
              <span className="text-lg md:text-xl font-black tracking-tighter text-foreground dark:text-white">SecretRoom</span>
            </div>

            {/* Desktop Nav - Hidden on Mobile */}
            <nav className="hidden xl:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <a href="#features" className="text-sm font-black hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-black hover:text-primary transition-colors">How it works</a>
              <a href="#pricing" className="text-sm font-black hover:text-primary transition-colors">Pricing</a>
              <button onClick={() => navigate('/wall')} className="text-sm font-black hover:text-primary transition-colors">Community</button>
            </nav>

            <div className="flex items-center gap-2 md:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="w-8 h-8 md:w-10 md:h-10 p-0 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {darkMode ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
              </Button>
              <Button
                variant="default"
                size="sm"
                className="rounded-full font-black px-4 md:px-8 h-9 md:h-11 text-xs md:text-sm shadow-lg shadow-primary/20"
                onClick={() => navigate('/admin')}
              >
                My rooms
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Redesigned for Massive Impact */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 md:pt-40 pb-16 px-4 grid-bg overflow-hidden">
        <div className="container mx-auto max-w-7xl relative z-10 text-center">

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="space-y-2 md:space-y-0 mb-8 md:mb-12"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
              Free Anonymous
            </h1>
            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] cycling-gradient italic">
              Chat Platform.
            </h2>
          </motion.div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-lg md:text-2xl text-slate-500 dark:text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed mb-10 md:mb-16 px-2"
          >
            Skip the login hassle. Start chatting instantly. <span className="text-slate-900 dark:text-white font-bold block sm:inline mt-2 sm:mt-0">Free. No Email. No History. Pure Privacy by Secret Room.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full sm:w-auto"
          >
            <Button
              size="lg"
              onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-base md:text-lg hover:scale-105 transition-transform shadow-2xl"
            >
              Join a room now
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/admin/create-room')}
              className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-12 rounded-2xl border-2 border-slate-200 dark:border-white/10 font-bold text-base md:text-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
            >
              Create a room
            </Button>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center mt-8"
          >
            <a
              href="https://entrextlabs.substack.com/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-slate-200 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/30 transition-all text-sm font-bold"
            >
              <Mail className="w-4 h-4" />
              Subscribe to Newsletter
            </a>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] md:w-[800px] h-[300px] sm:h-[500px] md:h-[800px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[60px] md:blur-[120px] -z-10 animate-pulse" />
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
            View All Community Whispers
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

      {/* Pricing Section */}
      <section id="pricing" className="py-32 grid-bg relative">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 mb-24">
            <h3 className="text-5xl md:text-7xl wide-headline text-foreground">
              Upgrade the void
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
                      onClick={() => handleInitializeBilling(plan)}
                      disabled={!!loadingPayment}
                    >
                      {loadingPayment === plan.name ? 'PROCESSING...' : 'INITIALIZE BILLING'}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
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

      {/* FAQ Section - Massive Impact for SEO/AEO */}
      <section id="faq" className="py-24 xl:py-32 bg-slate-50/50 dark:bg-zinc-900/50 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center space-y-4 mb-20">
            <Badge variant="outline" className="px-6 py-1 bg-primary/5 border-primary/20 text-primary font-bold uppercase tracking-wider">Common Questions</Badge>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
              Everything you need to <span className="text-primary italic">know</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card
                key={idx}
                className={cn(
                  "rounded-3xl border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden transition-all duration-300",
                  openFaq === idx ? "ring-1 ring-primary/50 shadow-lg shadow-primary/5" : "hover:border-primary/20"
                )}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-6 md:p-8 flex items-center justify-between text-left group"
                >
                  <span className="text-lg md:text-xl font-black text-slate-800 dark:text-white/90 group-hover:text-primary transition-colors">
                    {faq.question}
                  </span>
                  <div className="shrink-0 ml-4">
                    {openFaq === idx ? (
                      <MinusCircle className="w-6 h-6 text-primary" />
                    ) : (
                      <PlusCircle className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                    )}
                  </div>
                </button>
                {openFaq === idx && (
                  <div className="px-6 md:px-8 pb-8 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-slate-500 dark:text-gray-400 font-medium leading-relaxed text-base md:text-lg">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>


        </div>
      </section>

      {/* SEO Keywords Section - Hidden from UI but present for Bots */}
      <section className="sr-only">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">Trending Topics & User Needs</p>
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {[
              "#AnonymousChat", "#NoSignup", "#PrivacyMatters", "#PrivateConversation",
              "#OnlineSecurity", "#SecretChat", "#GhostMode", "#NoLogin",
              "#EncryptedMessaging", "#TalkToStrangers", "#DataPrivacy",
              "#Secretroom", "#Entrext", "#SecureChat", "#FreePlatform",
              "#FreeChat", "#Anonymous", "#PrivateChat", "#OnlinePrivacy",
              "#SafeSpace", "#ChatFree", "#NoTrace"
            ].map((tag, i) => (
              <span key={i} className="text-[10px] md:text-xs font-medium px-3 py-1 rounded-full bg-background border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors cursor-default">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Restored to simple original style */}
      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center justify-center gap-2 mb-6 text-center">
            <span className="text-3xl mb-2">🤫</span>
            <h4 className="font-bold text-xl gradient-text">Secret Room</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Ephemeral anonymous chat platform. Share secrets, leave no trace.
          </p>
          <div className="mb-8">
            <p className="text-primary/80 font-medium text-sm">
              Contact on <a href="mailto:business@entrext.in" className="text-primary underline font-bold">business@entrext.in</a> for any queries or support
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center gap-6 mb-8">
            <a
              href="https://discord.com/invite/ZZx3cBrx2"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all hover:scale-110"
              aria-label="Discord"
            >
              <DiscordIcon className="w-5 h-5 text-primary" />
            </a>
            <a
              href="https://www.linkedin.com/company/entrext/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all hover:scale-110"
              aria-label="LinkedIn"
            >
              <LinkedInIcon className="w-5 h-5 text-primary" />
            </a>
            <a
              href="https://www.instagram.com/entrext.labs/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all hover:scale-110"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-5 h-5 text-primary" />
            </a>
            <a
              href="https://entrextlabs.substack.com/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-all hover:scale-110"
              aria-label="Substack Newsletter"
            >
              <Mail className="w-5 h-5 text-primary" />
            </a>
          </div>

          <div className="flex justify-center gap-8 mb-8 text-sm font-medium flex-wrap">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <button onClick={() => navigate('/privacy')} className="hover:text-primary transition-colors">Privacy Policy</button>
            <button onClick={() => navigate('/terms')} className="hover:text-primary transition-colors">Terms of Service</button>
          </div>
          <Separator className="my-8 opacity-50" />
          <p className="text-xs text-muted-foreground">
            © 2026 Secret Room. All conversations are ephemeral and end-to-end encrypted.
          </p>
        </div>
      </footer>
    </div>
  );
}
