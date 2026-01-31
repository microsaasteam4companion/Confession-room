import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock, ArrowRight, Sun, Moon } from 'lucide-react';
import PageMeta from '@/components/common/PageMeta';

const BLOG_POSTS = [
    {
        id: 1,
        title: "Mastering the Art of Anonymous Feedback",
        excerpt: "Discover why anonymity is the key to honest communication in modern organizations and personal relationships.",
        date: "May 15, 2024",
        readTime: "5 min read",
        category: "Communication",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 2,
        title: "Why Privacy Matters More Than Ever in 2024",
        excerpt: "A deep dive into the digital footprint we leave behind and how platforms like Secret Room are changing the game.",
        date: "May 12, 2024",
        readTime: "8 min read",
        category: "Privacy",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60"
    },
    {
        id: 3,
        title: "Building Trust Through Secure Channels",
        excerpt: "How end-to-end encryption and zero-log policies are building the next generation of trust on the internet.",
        date: "May 10, 2024",
        readTime: "6 min read",
        category: "Security",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60"
    }
];

export default function BlogPage() {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(true);

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

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <PageMeta
                title="Blog | Secret Room Anonymous Chat"
                description="Insights on privacy, security, and the future of anonymous communication."
                url="https://secretroom.entrext.in/blog"
                type="website"
            />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
                <div className="w-full px-4 md:px-6 py-3 md:py-4">
                    <div className="flex items-center justify-between container mx-auto max-w-7xl">
                        <div
                            className="flex items-center gap-2 md:gap-3 cursor-pointer group"
                            onClick={() => navigate('/')}
                        >
                            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20">
                                <ArrowLeft className="w-4 h-4 text-primary group-hover:-translate-x-1 transition-transform" />
                            </div>
                            <span className="text-lg md:text-xl font-black tracking-tighter uppercase">Back to Home</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleDarkMode}
                                className="w-10 h-10 p-0 rounded-full"
                            >
                                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4">
                <div className="container mx-auto max-w-7xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <Badge variant="outline" className="px-6 py-1.5 bg-primary/5 text-primary border-primary/20 font-black uppercase tracking-widest">
                            Our Blog
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                            Insights from <br />
                            <span className="cycling-gradient italic">The Void</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg text-muted-foreground font-medium">
                            Deep dives into privacy, security, and the human psychology behind anonymous communication.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="pb-24 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {BLOG_POSTS.map((post, idx) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className="h-full flex flex-col overflow-hidden border-black/5 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm hover:border-primary/30 transition-all group cursor-pointer rounded-[2rem]">
                                    <div className="aspect-video overflow-hidden">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <CardHeader className="space-y-2 p-6">
                                        <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-primary">
                                            <span>{post.category}</span>
                                        </div>
                                        <CardTitle className="text-2xl font-black leading-tight group-hover:text-primary transition-colors uppercase italic">
                                            {post.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6 pb-6">
                                        <p className="text-muted-foreground font-medium text-sm leading-relaxed line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="mt-auto px-6 py-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {post.readTime}
                                            </span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="font-black uppercase tracking-tighter group-hover:translate-x-1 transition-transform">
                                            Read More <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Newsletter Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-24 p-8 md:p-16 rounded-[3rem] bg-primary/5 border border-primary/10 text-center space-y-8"
                    >
                        <div className="max-w-2xl mx-auto space-y-4">
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
                                Stay in the <span className="italic text-primary">Loop</span>
                            </h2>
                            <p className="text-muted-foreground font-medium">
                                Subscribe to our newsletter and get the latest insights on digital privacy and secure communication delivered straight to your inbox.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full h-14 px-6 rounded-2xl bg-white dark:bg-black border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold"
                            />
                            <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                                Subscribe
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-black/5 dark:border-white/5">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">
                        © 2024 SECRET ROOM. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </footer>
        </div>
    );
}
