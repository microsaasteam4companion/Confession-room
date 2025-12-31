import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { motion } from 'motion/react';
import {
    Sparkles,
    Heart,
    ArrowLeft,
    Zap,
    Moon,
    Sun,
    MessageSquare,
    Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PublicWallPage() {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(true);

    // Sample dynamic secrets (replacing static list with something more extensive for the wall)
    const [secrets, setSecrets] = useState([
        { id: 1, text: "I actually sent an anonymous text to my ex just to see if they'd reply. They didn't.", gradient: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30", glow: "shadow-amber-500/20", votes: 421, voted: false, size: 'large' },
        { id: 2, text: "I've been 'mentally dating' my co-worker for two years. He has no idea I exist outside of meetings.", gradient: "from-purple-500/20 to-indigo-500/20", border: "border-purple-500/30", glow: "shadow-purple-500/20", votes: 892, voted: false, size: 'medium' },
        { id: 3, text: "I once faked a flat tire just so I wouldn't have to go to a boring family dinner.", gradient: "from-rose-500/20 to-pink-500/20", border: "border-rose-500/30", glow: "shadow-rose-500/20", votes: 154, voted: false, size: 'small' },
        { id: 4, text: "I still have my high school crush's middle school yearbook. I look at it every time I'm drunk.", gradient: "from-purple-500/20 to-indigo-500/20", border: "border-purple-500/30", glow: "shadow-purple-500/20", votes: 632, voted: false, size: 'medium' },
        { id: 5, text: "I tell everyone I'm a vegetarian but I secretly eat bacon in my car when no one is looking.", gradient: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30", glow: "shadow-amber-500/20", votes: 219, voted: false, size: 'medium' },
        { id: 6, text: "I let my neighbor's dog into my house for snacks because my own cat is a jerk.", gradient: "from-rose-500/20 to-pink-500/20", border: "border-rose-500/30", glow: "shadow-rose-500/20", votes: 98, voted: false, size: 'small' },
        { id: 7, text: "I've been using my roommate's Netflix account for three years. I'm 'Guest 2'. They think it's a glitch.", gradient: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30", glow: "shadow-amber-500/20", votes: 443, voted: false, size: 'medium' },
        { id: 8, text: "I pretend to be on a phone call while walking in the street just to avoid talking to people I know.", gradient: "from-indigo-500/20 to-blue-500/20", border: "border-indigo-500/30", glow: "shadow-indigo-500/20", votes: 567, voted: false, size: 'medium' },
        { id: 9, text: "I have a secret stash of luxury chocolate hidden in an empty frozen peas bag in the freezer.", gradient: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/30", glow: "shadow-emerald-500/20", votes: 312, voted: false, size: 'small' },
        { id: 10, text: "I once accidentally liked my boss's photo from 2012 at 3 AM. I deleted my account for a week.", gradient: "from-rose-500/20 to-pink-500/20", border: "border-rose-500/30", glow: "shadow-rose-500/20", votes: 1204, voted: false, size: 'large' },
        { id: 11, text: "I use my neighbor's unsecured Wi-Fi for my smart TV because I'm too cheap to upgrade my plan.", gradient: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30", glow: "shadow-amber-500/20", votes: 289, voted: false, size: 'medium' },
        { id: 12, text: "I stole a cool pen from a job interview and I still use it today. I didn't get the job.", gradient: "from-purple-500/20 to-indigo-500/20", border: "border-purple-500/30", glow: "shadow-purple-500/20", votes: 745, voted: false, size: 'medium' }
    ]);

    useEffect(() => {
        const isDark = localStorage.getItem('darkMode') !== 'false';
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

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

    const handleUpvote = (id: number) => {
        setSecrets(prev => prev.map(s => {
            if (s.id === id) {
                return { ...s, votes: s.voted ? s.votes - 1 : s.votes + 1, voted: !s.voted };
            }
            return s;
        }));
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
            {/* Wall Header */}
            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-primary" />
                            <h1 className="text-xl font-bold gradient-text hidden sm:block">Global Whisper Wall</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full">
                            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </Button>
                        <Button variant="default" size="sm" onClick={() => navigate('/admin/create-room')} className="btn-shimmer font-bold rounded-full px-6">
                            <Plus className="w-4 h-4 mr-2" />
                            New Room
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-12">
                <div className="text-center space-y-4 mb-20 max-w-2xl mx-auto">
                    <Badge variant="outline" className="px-6 py-1 bg-primary/5 border-primary/20 text-primary font-bold">🌌 The Void Speaks</Badge>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Public Confessions</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Real secrets from real users who chose to speak their truth.
                        Scroll, upvote, and explore the unfiltered digital void.
                    </p>
                </div>

                {/* Masonry Grid UI using columns */}
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    {secrets.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.02 }}
                            className={cn(
                                "break-inside-avoid relative p-8 rounded-3xl border backdrop-blur-3xl transition-all cursor-default overflow-hidden group mb-6",
                                "bg-white/40 dark:bg-white/5 border-white/20 dark:border-white/10",
                                item.border,
                                "shadow-lg hover:shadow-2xl",
                                item.glow
                            )}
                        >
                            {/* Internal Blurred Gradient */}
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-br opacity-20 blur-3xl -z-10 group-hover:opacity-40 transition-opacity duration-700",
                                item.gradient
                            )} />

                            <div className="relative z-10 space-y-4">
                                <div className="flex justify-between items-start">
                                    <Zap className="w-5 h-5 text-primary opacity-50" />
                                    <button
                                        onClick={() => handleUpvote(item.id)}
                                        className={cn(
                                            "flex items-center gap-1.5 text-xs font-bold transition-all p-2 rounded-full hover:bg-primary/10",
                                            item.voted ? "text-primary scale-110" : "text-muted-foreground hover:text-primary"
                                        )}
                                    >
                                        <Heart className={cn("w-4 h-4 transition-all", item.voted ? "fill-primary" : "fill-primary/20")} />
                                        <span>{item.votes}</span>
                                    </button>
                                </div>

                                <p className={cn(
                                    "font-bold leading-relaxed italic text-foreground/80 dark:text-white/80 group-hover:text-foreground dark:group-hover:text-white transition-colors",
                                    item.size === 'large' ? "text-2xl" : "text-lg"
                                )}>
                                    "{item.text}"
                                </p>

                                <div className="pt-4 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                        ?
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground italic">Anonymous Guest</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Action Bar */}
                <div className="mt-20 text-center">
                    <Card className="max-w-xl mx-auto glass-card p-10 space-y-6 border-primary/20">
                        <h3 className="text-2xl font-bold">Have your own secret?</h3>
                        <p className="text-muted-foreground">
                            Create a room, invite friends, and share your truth. Choose to make it public if you dare.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" onClick={() => navigate('/admin/create-room')} className="btn-shimmer px-8">
                                <MessageSquare className="w-5 h-5 mr-2" />
                                Start Gossiping
                            </Button>
                            <Button size="lg" variant="outline" onClick={() => navigate('/')} className="px-8">
                                Back Home
                            </Button>
                        </div>
                    </Card>
                </div>
            </main>

            {/* Basic Footer */}
            <footer className="border-t border-border py-8 mt-12 opacity-50 px-4 text-center">
                <p className="text-xs text-muted-foreground">
                    © 2025 Secret Room. Global Whisper Wall. All messages are ephemeral by nature.
                </p>
            </footer>
        </div>
    );
}
