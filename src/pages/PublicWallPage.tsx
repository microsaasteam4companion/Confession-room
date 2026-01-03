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
    Plus,
    Loader2
} from 'lucide-react';
import { supabase } from '@/db/supabase';
import { cn } from '@/lib/utils';

export default function PublicWallPage() {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(true);

    const [secrets, setSecrets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [votedIds, setVotedIds] = useState<string[]>([]);

    useEffect(() => {
        const isDark = localStorage.getItem('darkMode') !== 'false';
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Load upvote history
        const savedVotes = JSON.parse(localStorage.getItem('secret_votes') || '[]');
        setVotedIds(savedVotes);

        fetchSecrets(savedVotes);
    }, []);

    const fetchSecrets = async (currentVotedIds?: string[]) => {
        const activeVotedIds = currentVotedIds || votedIds;
        try {
            const { data, error } = await supabase
                .from('secrets')
                .select('*')
                .order('votes', { ascending: false })
                .limit(10);

            if (error) throw error;

            // Assign random visual styles if they don't exist
            const styles = [
                { gradient: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30", glow: "shadow-amber-500/20" },
                { gradient: "from-purple-500/20 to-indigo-500/20", border: "border-purple-500/30", glow: "shadow-purple-500/20" },
                { gradient: "from-rose-500/20 to-pink-500/20", border: "border-rose-500/30", glow: "shadow-rose-500/20" },
                { gradient: "from-indigo-500/20 to-blue-500/20", border: "border-indigo-500/30", glow: "shadow-indigo-500/20" },
                { gradient: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/30", glow: "shadow-emerald-500/20" }
            ];

            const formatted = (data || []).map((s, idx) => ({
                ...s,
                ...styles[idx % styles.length],
                voted: activeVotedIds.includes(s.id),
                size: s.content.length > 100 ? 'large' : s.content.length > 50 ? 'medium' : 'small'
            }));

            setSecrets(formatted);
        } catch (err) {
            console.error('Wall Fetch Error:', err);
        } finally {
            setLoading(false);
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

    const handleUpvote = async (id: string) => {
        const isVoted = votedIds.includes(id);
        const increment = isVoted ? -1 : 1;

        // Local State Update
        setSecrets(prev => prev.map(s => {
            if (s.id === id) {
                return { ...s, votes: s.votes + increment };
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

        // DB Sync
        try {
            await supabase.rpc('increment_secret_vote', {
                row_id: id,
                inc: increment
            });
        } catch (err) {
            console.error('Vote Sync Error:', err);
        }
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
                            <span className="text-2xl">🤫</span>
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
            < main className="flex-1 container mx-auto px-4 py-12" >
                <div className="text-center space-y-4 mb-20 max-w-2xl mx-auto">
                    <Badge variant="outline" className="px-6 py-1 bg-primary/5 border-primary/20 text-primary font-bold">🌌 The Void Speaks</Badge>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Public Confessions</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Real secrets from real users who chose to speak their truth.
                        Scroll, upvote, and explore the unfiltered digital void.
                    </p>
                </div>

                {
                    loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                            <p className="text-muted-foreground animate-pulse">Summoning secrets from the void...</p>
                        </div>
                    ) : (
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
                                        "bg-white/40 dark:bg-white/10 border-white/20 dark:border-white/20",
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
                                                    votedIds.includes(item.id) ? "text-primary scale-110" : "text-muted-foreground hover:text-primary"
                                                )}
                                            >
                                                <Heart className={cn("w-4 h-4 transition-all", votedIds.includes(item.id) ? "fill-primary" : "fill-primary/20")} />
                                                <span>{item.votes}</span>
                                            </button>
                                        </div>

                                        <p className={cn(
                                            "font-bold leading-relaxed italic text-foreground/80 dark:text-white/80 group-hover:text-foreground dark:group-hover:text-white transition-colors",
                                            item.size === 'large' ? "text-2xl" : "text-lg"
                                        )}>
                                            "{item.content}"
                                        </p>

                                        <div className="pt-4 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                {item.avatar || '?'}
                                            </div>
                                            <span className="text-xs font-medium text-muted-foreground italic">{item.ghost_id || 'Anonymous Guest'}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )
                }

                {/* Action Bar */}
                <div className="mt-20 text-center">
                    <Card className="max-w-xl mx-auto glass-card dark:bg-black/90 dark:border-white/20 p-10 space-y-6 border-primary/20 transition-colors duration-300">
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
            </main >

            {/* Basic Footer */}
            < footer className="border-t border-border py-8 mt-12 opacity-50 px-4 text-center" >
                <p className="text-xs text-muted-foreground">
                    © 2025 Secret Room. Global Whisper Wall. All messages are ephemeral by nature.
                </p>
            </footer >
        </div >
    );
}
