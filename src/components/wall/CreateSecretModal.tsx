import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CATEGORIES } from '@/data/categories';
import { cn } from '@/lib/utils';
import { Loader2, Send, Clock, Trash2 } from 'lucide-react';
import { supabase } from '@/db/supabase';

// Random identities
const ADJECTIVES = ['Neon', 'Silent', 'Cosmic', 'Glitch', 'Hollow', 'Midnight', 'Rogue', 'Digital'];
const NOUNS = ['Ghost', 'Panda', 'Fox', 'Specter', 'Echo', 'Phantom', 'Viper', 'Seeker'];
const AVATARS = ['👻', '🐼', '🦊', '👽', '🤖', '👾', '🦁', '🦄'];

const DURATIONS = [
    { label: '1 Hour', value: 1, icon: '🔥' },
    { label: '6 Hours', value: 6, icon: '⏳' },
    { label: '24 Hours', value: 24, icon: '🌙' },
    { label: 'Forever', value: 0, icon: '♾️' }
];

interface CreateSecretModalProps {
    onPostSuccess: () => void;
    trigger?: React.ReactNode;
    defaultCategory?: string;
}

export default function CreateSecretModal({ onPostSuccess, trigger, defaultCategory }: CreateSecretModalProps) {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(defaultCategory || CATEGORIES[0].id);
    const [loading, setLoading] = useState(false);
    const [identity, setIdentity] = useState({ name: '', avatar: '' });
    const [duration, setDuration] = useState(24);

    // Sync selected category if default changes or on open
    useEffect(() => {
        if (open && defaultCategory) {
            setSelectedCategory(defaultCategory);
        }
    }, [open, defaultCategory]);

    // Generate identity on open
    useEffect(() => {
        if (open) {
            const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
            const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
            const num = Math.floor(Math.random() * 999);
            setIdentity({
                name: `${adj} ${noun} #${num}`,
                avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)]
            });
        }
    }, [open]);

    const { toast } = useToast();

    const handleSubmit = async () => {
        if (!text.trim()) return;

        setLoading(true);
        try {
            let expiresAt = undefined;
            if (duration > 0) {
                const date = new Date();
                date.setHours(date.getHours() + duration);
                expiresAt = date.toISOString();
            }

            const secretData = {
                text: text.trim(),
                categoryId: selectedCategory,
                identity,
                expiresAt
            };

            const { error } = await supabase
                .from('secrets')
                .insert([{
                    content: JSON.stringify(secretData),
                    votes: 0,
                    ghost_id: `ghost-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    avatar: identity.avatar
                }]);

            if (error) {
                console.error('Supabase Error:', error);
                throw new Error(error.message || 'Failed to post secret');
            }

            setText('');
            setOpen(false);
            onPostSuccess();

            toast({
                title: "Secret Whispered",
                description: `Your secret has been released into the ${activeCategory.label}.`,
                className: "bg-primary text-primary-foreground border-none"
            });

        } catch (err: any) {
            console.error('Failed to post secret:', err);
            toast({
                variant: "destructive",
                title: "Failed to Whisper",
                description: err.message || "Something went wrong. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const activeCategory = CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button>Post Secret</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-black gradient-text">
                        Whisper to the Wall
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Category Selector */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Choose a Vibe</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={cn(
                                        "flex flex-col items-center gap-1 p-2 rounded-xl border transition-all text-xs font-medium",
                                        selectedCategory === cat.id
                                            ? `bg-primary/10 border-primary ${cat.color}`
                                            : "bg-muted/50 border-transparent hover:bg-muted text-muted-foreground"
                                    )}
                                >
                                    <cat.icon className="w-4 h-4" />
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Text Area */}
                    <div className="relative">
                        <Textarea
                            placeholder={`Share your ${activeCategory.description.toLowerCase()}...`}
                            className={cn(
                                "min-h-[120px] resize-none bg-muted/30 border-2 focus-visible:ring-0 text-base p-4 rounded-xl",
                                activeCategory.borderColor
                            )}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            maxLength={500}
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground font-mono bg-background/80 px-2 py-0.5 rounded-full">
                            {text.length}/500
                        </div>
                    </div>

                    {/* Expiry Timer */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Vanish After
                        </label>
                        <div className="flex bg-muted/50 p-1 rounded-lg">
                            {DURATIONS.map(d => (
                                <button
                                    key={d.value}
                                    onClick={() => setDuration(d.value)}
                                    className={cn(
                                        "flex-1 py-1.5 text-[10px] sm:text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1",
                                        duration === d.value
                                            ? "bg-background shadow-sm text-foreground"
                                            : "text-muted-foreground hover:bg-white/5"
                                    )}
                                    title={d.label}
                                >
                                    <span>{d.icon}</span>
                                    {d.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Identity Preview */}
                    <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg border border-border/50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-lg border border-border">
                                {identity.avatar}
                            </div>
                            <div className="text-sm">
                                <p className="text-xs text-muted-foreground uppercase font-bold">Posting As</p>
                                <p className="font-mono font-bold text-primary">{identity.name}</p>
                            </div>
                        </div>
                        <Button
                            onClick={handleSubmit}
                            disabled={!text.trim() || loading}
                            className={cn(
                                "font-bold transition-all",
                                !text.trim() && "opacity-50"
                            )}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                            Post
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
