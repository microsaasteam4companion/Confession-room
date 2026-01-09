import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/db/supabase';
import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/data/categories';
import { ArrowLeft, Loader2, Plus, Sun, Moon } from 'lucide-react';
import CreateSecretModal from '@/components/wall/CreateSecretModal';
import SecretCard from '@/components/wall/SecretCard';
import { parseSecretContent } from '@/utils/secretUtils';
import { Card } from '@/components/ui/card';
import { DUMMY_SECRETS } from '@/data/dummySecrets';

import MidnightBlackout from '@/components/wall/MidnightBlackout';

export default function PublicWallPage() {
    // ... existing hooks ...
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(true);
    const [secrets, setSecrets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [votedIds, setVotedIds] = useState<string[]>([]);
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        const isDark = localStorage.getItem('darkMode') !== 'false';
        setDarkMode(isDark);
        if (isDark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');

        const savedVotes = JSON.parse(localStorage.getItem('secret_votes') || '[]');
        setVotedIds(savedVotes);
        fetchSecrets();
    }, []);

    const fetchSecrets = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('secrets')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            // 1. Merge with Dummy Data
            const realSecrets = data || [];

            // 2. Filter Expired Secrets
            const now = new Date();
            const validSecrets = [...realSecrets, ...DUMMY_SECRETS].filter(secret => {
                const contentData = parseSecretContent(secret.content);
                if (contentData.expiresAt) {
                    const expiry = new Date(contentData.expiresAt);
                    if (expiry < now) return false; // Expired
                }
                return true;
            });

            // 3. Sort by Votes/Date: Real secrets first (usually newer), then mixed with random dummy
            // For now, simpler: just use the merged list.
            setSecrets(validSecrets);
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
        if (newDarkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    };

    const handleUpvote = async (id: string) => {
        // Optimistic update handled in Card, this handles DB/Storage
        const isVoted = votedIds.includes(id);
        if (isVoted) return;

        const newVotedIds = [...votedIds, id];
        setVotedIds(newVotedIds);
        localStorage.setItem('secret_votes', JSON.stringify(newVotedIds));

        try {
            await supabase.rpc('increment_secret_vote', { row_id: id, inc: 1 });
        } catch (err) {
            console.error('Vote Sync Error:', err);
        }
    };

    // Filter Logic
    const filteredSecrets = secrets.filter(secret => {
        if (activeFilter === 'all') return true;
        const data = parseSecretContent(secret.content);
        return data.categoryId === activeFilter;
    });

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
            {/* Mobile-First Header */}
            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
                <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="rounded-full -ml-2">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="font-black text-lg tracking-tight">The Global Secret Wall</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full">
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </Button>
                        <CreateSecretModal
                            onPostSuccess={fetchSecrets}
                            defaultCategory={activeFilter !== 'all' ? activeFilter : undefined}
                            trigger={
                                <Button size="sm" className="rounded-full font-bold px-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
                                    <Plus className="w-4 h-4 mr-1" /> Post
                                </Button>
                            }
                        />
                    </div>
                </div>

                {/* Categories Tab Scroll (Mobile Only) */}
                <div className="md:hidden border-t border-border/50 bg-muted/20">
                    <div className="container max-w-xl mx-auto px-4 overflow-x-auto scrollbar-hide py-2">
                        <div className="flex items-center gap-2 min-w-max">
                            <button
                                onClick={() => setActiveFilter('all')}
                                className={cn(
                                    "whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                                    activeFilter === 'all'
                                        ? "bg-foreground text-background border-foreground text-foreground"
                                        : "bg-background/50 text-muted-foreground border-transparent"
                                )}
                            >
                                All Posts
                            </button>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveFilter(cat.id)}
                                    className={cn(
                                        "whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-2",
                                        activeFilter === cat.id
                                            ? `bg-background border-current ${cat.color}`
                                            : "bg-transparent text-muted-foreground border-transparent"
                                    )}
                                >
                                    <cat.icon className="w-3 h-3" />
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            <div className="container max-w-7xl mx-auto px-4 py-6 flex-1 grid md:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_320px] gap-8 items-start">
                {/* Desktop Sidebar */}
                <aside className="hidden md:block sticky top-24 space-y-6">
                    <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-4">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 px-2">Vibes</h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => setActiveFilter('all')}
                                className={cn(
                                    "w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-3",
                                    activeFilter === 'all'
                                        ? "bg-foreground text-background shadow-lg"
                                        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <span className="text-lg">🌍</span>
                                All Posts
                            </button>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveFilter(cat.id)}
                                    className={cn(
                                        "w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-3",
                                        activeFilter === cat.id
                                            ? `bg-primary/10 border border-primary/20 ${cat.color}`
                                            : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <cat.icon className={cn("w-4 h-4", activeFilter === cat.id ? "text-current" : "text-muted-foreground")} />
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">🕵️‍♂️</span>
                            <span className="text-xs font-bold text-primary uppercase">Privacy Check</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Your identity is randomly generated for <strong>every single post</strong>.
                            <br /><br />
                            No profiles. No history. Just the wall.
                        </p>
                    </div>
                </aside>

                {/* Main Feed */}
                <main className="max-w-xl mx-auto w-full space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            <p className="text-sm text-muted-foreground font-medium animate-pulse">Syncing with the void...</p>
                        </div>
                    ) : (
                        <>
                            {filteredSecrets.length === 0 ? (
                                <div className="text-center py-20 opacity-50">
                                    <p>No secrets found in this void... yet.</p>
                                    <div className="mt-4">
                                        <CreateSecretModal onPostSuccess={fetchSecrets} />
                                    </div>
                                </div>
                            ) : (
                                filteredSecrets.map((secret) => (
                                    <SecretCard
                                        key={secret.id}
                                        secret={secret}
                                        onVote={handleUpvote}
                                        isVoted={votedIds.includes(secret.id)}
                                    />
                                ))
                            )}

                            {/* End of Feed CTA */}
                            {filteredSecrets.length > 0 && (
                                <div className="py-12 text-center space-y-4">
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest">End of the Wall</p>
                                    <div className="w-1 h-8 bg-gradient-to-b from-border to-transparent mx-auto" />
                                    <Card className="p-6 bg-muted/30 border-dashed border-border">
                                        <p className="text-sm text-muted-foreground mb-4">Have something to confess?</p>
                                        <CreateSecretModal
                                            onPostSuccess={fetchSecrets}
                                            defaultCategory={activeFilter !== 'all' ? activeFilter : undefined}
                                        />
                                    </Card>
                                </div>
                            )}
                        </>
                    )}
                </main>

                {/* Highlights Sidebar (Desktop XL+) */}
                <aside className="hidden xl:block sticky top-24 space-y-6 w-80">
                    <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-4 px-2">
                            <span className="text-lg">🏆</span>
                            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">Wall Highlights</h3>
                        </div>

                        <div className="space-y-4">
                            {CATEGORIES.filter(c => c.id !== 'all')
                                .map(cat => {
                                    const topSecret = secrets
                                        .filter(s => {
                                            const d = parseSecretContent(s.content);
                                            return d.categoryId === cat.id;
                                        })
                                        .sort((a, b) => (b.votes || 0) - (a.votes || 0))[0];

                                    if (!topSecret) return null;
                                    return { cat, secret: topSecret };
                                })
                                .filter((item): item is { cat: any, secret: any } => !!item)
                                .sort((a, b) => b.secret.votes - a.secret.votes)
                                .slice(0, 3)
                                .map(({ cat, secret }) => {
                                    const content = parseSecretContent(secret.content);
                                    return (
                                        <div key={cat.id} className="group cursor-pointer" onClick={() => setActiveFilter(cat.id)}>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className={cn("text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5", cat.color)}>
                                                    <cat.icon className="w-3 h-3" />
                                                    {cat.label}
                                                </div>
                                                <div className="text-[10px] font-mono font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                    {secret.votes} votes
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "p-3 rounded-xl border bg-background/50 hover:bg-background transition-all hover:scale-[1.02] hover:shadow-md",
                                                cat.borderColor
                                            )}>
                                                <p className="text-xs line-clamp-2 text-foreground/90 font-medium">"{content.text}"</p>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className="text-[10px] text-muted-foreground">{content.identity.name}</span>
                                                    <div className="flex gap-1">
                                                        {(content.reactions?.relatable || 0) > 0 && <span className="text-[10px]">❤️ {content.reactions?.relatable}</span>}
                                                        {(content.reactions?.shock || 0) > 0 && <span className="text-[10px]">🤯 {content.reactions?.shock}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>


                    {/* The Midnight Club - Entry Point */}
                    <div
                        onClick={() => navigate('/club')}
                        className="cursor-pointer group relative overflow-hidden rounded-2xl border border-purple-500/30 bg-black p-5 shadow-lg shadow-purple-900/10 hover:shadow-purple-900/30 transition-all hover:scale-[1.02]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-black opacity-50" />
                        <div className="absolute inset-0 opacity-[0.1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-white italic tracking-tighter uppercase">
                                    The Midnight Club
                                </h3>
                                <p className="text-[10px] text-purple-400 font-mono mt-1 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                                    Opens 12AM - 4AM
                                </p>
                            </div>
                            <div className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                                🌙
                            </div>
                        </div>
                    </div>
                </aside>
            </div >
        </div >
    );
}
