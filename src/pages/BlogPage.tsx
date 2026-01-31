import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock, ArrowRight, Sun, Moon, Sparkles, BookOpen, ShieldCheck, Zap } from 'lucide-react';
import PageMeta from '@/components/common/PageMeta';
import { cn } from '@/lib/utils';

const BLOG_POSTS = [
    {
        id: 1,
        title: "The Psychology of Anonymity: Why We Need Safe Digital Voids",
        excerpt: "In an era of hyper-connectivity and social scoring, the need for truly anonymous spaces has grown from a luxury to a psychological necessity. Explore why 'whispering to the void' is becoming the new therapy.",
        content: "Content goes here...",
        date: "Feb 01, 2024",
        readTime: "12 min read",
        category: "Psychology",
        featured: true,
        image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1200&auto=format&fit=crop&q=80"
    },
    {
        id: 2,
        title: "Digital Footprints: How to Truly Disappear",
        excerpt: "Most people think 'Private Mode' is enough. It's not. Here's how Secret Room implements zero-trace technology by design.",
        date: "Jan 28, 2024",
        readTime: "6 min read",
        category: "Technology",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 3,
        title: "The Art of Constructive Confession",
        excerpt: "Sharing your heaviest thoughts shouldn't be scary. Learn how anonymous communities help people process trauma and guilt.",
        date: "Jan 25, 2024",
        readTime: "5 min read",
        category: "Mental Health",
        image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 4,
        title: "Securing Your Voice with End-to-End Encryption",
        excerpt: "A deep dive into the math that keeps your secrets safe. Why we chose E2EE as our primary defense mechanism.",
        date: "Jan 20, 2024",
        readTime: "8 min read",
        category: "Security",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60"
    }
];

export default function BlogPage() {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const isDark = localStorage.getItem('darkMode') === 'true';
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

    const featuredPost = BLOG_POSTS.find(p => p.featured);
    const regularPosts = BLOG_POSTS.filter(p => !p.featured);

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-primary selection:text-white">
            <PageMeta
                title="Blog | Secret Room Anonymous Chat"
                description="Insights on privacy, security, and the future of anonymous communication."
                url="https://secretroom.entrext.in/blog"
                type="website"
            />

            {/* Dynamic Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-delayed" />
            </div>

            {/* Navbar - Premium Glassmorphism */}
            <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-black/5 dark:border-white/5 bg-white/70 dark:bg-black/70 backdrop-blur-2xl">
                <div className="container mx-auto max-w-7xl px-4 md:px-6">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        <div
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => navigate('/')}
                        >
                            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-all">
                                <ArrowLeft className="w-5 h-5 text-primary group-hover:-translate-x-1 transition-transform" />
                            </div>
                            <span className="text-xl font-black tracking-tighter uppercase hidden sm:block">The Void Archive</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleDarkMode}
                                className="w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </Button>
                            <Button
                                onClick={() => navigate('/')}
                                className="rounded-full font-black px-6 h-10 text-xs shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 hidden md:flex"
                            >
                                JOIN THE VOID
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 md:pt-48 pb-16 px-4 relative">
                <div className="container mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6 mb-16 md:mb-24"
                    >
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-primary/20 bg-primary/5 mb-4">
                            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                            <span className="text-xs font-black tracking-[0.2em] text-primary uppercase">The Secret Chronicles</span>
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-8">
                            Digital <br />
                            <span className="cycling-gradient italic">Whispers.</span>
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-2xl text-muted-foreground font-medium leading-relaxed">
                            Where thoughts are shared, identities are erased, and the <span className="text-foreground font-bold italic">truth</span> finds a home.
                        </p>
                    </motion.div>

                    {/* Featured Post Card */}
                    {featuredPost && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="group relative"
                        >
                            <Card className="overflow-hidden border-none bg-zinc-900 text-white rounded-[3rem] shadow-2xl transition-all duration-700 hover:shadow-primary/5">
                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                    <div className="h-[300px] lg:h-[600px] overflow-hidden relative">
                                        <img
                                            src={featuredPost.image}
                                            alt={featuredPost.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    </div>
                                    <div className="p-8 md:p-16 flex flex-col justify-center space-y-8">
                                        <div className="space-y-4">
                                            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-black uppercase text-xs px-4 py-1">
                                                Featured Commentary
                                            </Badge>
                                            <h2 className="text-3xl md:text-6xl font-black leading-tight uppercase italic tracking-tighter">
                                                {featuredPost.title}
                                            </h2>
                                            <p className="text-xl text-zinc-400 font-medium leading-relaxed">
                                                {featuredPost.excerpt}
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
                                            <Button size="lg" className="h-16 px-10 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:scale-105 transition-transform group/btn shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
                                                Deep Dive <ArrowRight className="w-5 h-5 ml-3 group-hover/btn:translate-x-2 transition-transform" />
                                            </Button>
                                            <div className="flex items-center gap-4 text-zinc-500 font-bold uppercase text-xs tracking-widest">
                                                <span className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    {featuredPost.readTime}
                                                </span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                <span>{featuredPost.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Grid Features - Premium Dividers */}
            <section className="py-24 bg-muted/30 dark:bg-zinc-900/30 border-y border-black/5 dark:border-white/5">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                        <div className="space-y-4 group">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                                <BookOpen className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Curation</h3>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                Manually picked perspectives from the deep web and community wall, edited for maximum impact.
                            </p>
                        </div>
                        <div className="space-y-4 group">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                                <ShieldCheck className="w-8 h-8 text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Integrity</h3>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                Zero AI-filler content. Every article is crafted by humans who value digital freedom.
                            </p>
                        </div>
                        <div className="space-y-4 group">
                            <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                                <Zap className="w-8 h-8 text-pink-500" />
                            </div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Velocity</h3>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                Weekly updates from the edge of the void, keeping you ahead of the digital evolution.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Posts Grid */}
            <section className="py-32 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex items-center justify-between mb-16 px-4">
                        <div className="space-y-1">
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">LATEST ECHOES</h2>
                            <div className="h-1.5 w-32 bg-primary rounded-full shadow-[0_0_20px_rgba(255,0,128,0.5)]" />
                        </div>
                        <Button variant="outline" className="rounded-full font-bold px-8 h-12 border-2 hidden sm:flex">VIEW ALL</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {regularPosts.map((post, idx) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className="h-full flex flex-col group cursor-pointer border-none bg-transparent hover:shadow-2xl transition-all duration-500 rounded-[2.5rem]">
                                    <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] relative mb-6">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-6 left-6">
                                            <Badge className="bg-white/90 backdrop-blur-md text-black font-black uppercase text-[10px] px-4 py-1.5 border-none shadow-xl">
                                                {post.category}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-4 px-2">
                                        <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors leading-tight">
                                            {post.title}
                                        </h3>
                                        <p className="text-muted-foreground font-medium text-base line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    </div>

                                    <div className="pt-8 px-2 mt-auto">
                                        <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-6">
                                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                                                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                                <span>{post.date}</span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full border border-black/5 dark:border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter - Massive Impact */}
            <section className="pb-32 px-4">
                <div className="container mx-auto max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="p-10 md:p-24 rounded-[4rem] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-center space-y-12 relative overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.1)]"
                    >
                        {/* Background Texture */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                        <div className="relative z-10 space-y-6">
                            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic leading-[0.9]">
                                JOIN THE <br />
                                <span className="text-primary italic">DIGITAL DISCOURSE</span>
                            </h2>
                            <p className="max-w-xl mx-auto text-lg text-zinc-400 dark:text-zinc-500 font-medium">
                                No spam. Only deep technical insights and philosophical musings on privacy. Unsubscribe if you find the truth too heavy.
                            </p>
                        </div>

                        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="YOUR EMAIL ADRESS"
                                className="w-full h-16 px-8 rounded-3xl bg-white/10 dark:bg-zinc-100 border-none focus:outline-none focus:ring-4 focus:ring-primary/40 font-black uppercase tracking-widest text-sm"
                            />
                            <Button size="lg" className="w-full sm:w-auto h-16 px-10 rounded-3xl font-black uppercase tracking-widest bg-primary text-white hover:scale-105 transition-transform shadow-2xl shadow-primary/40 group">
                                SUBSCRIBE <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>

                        <p className="relative z-10 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600 dark:text-zinc-400 opacity-50">
                            TRUSTED BY 2,400+ GHOSTS WORLDWIDE
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 border-t border-black/5 dark:border-white/5 opacity-80">
                <div className="container mx-auto px-4 text-center space-y-8">
                    <div className="flex items-center justify-center gap-3 grayscale opacity-50">
                        <span className="text-3xl">🤫</span>
                        <span className="text-xl font-black uppercase tracking-tighter">SECRET ROOM</span>
                    </div>
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.4em]">
                        © 2024 THE VOID PROJECTS. ALL DATA EPHEMERAL.
                    </p>
                </div>
            </footer>
        </div>
    );
}
