import { motion } from 'motion/react';
import { getCategory, parseSecretContent, SecretData } from '@/utils/secretUtils';
import { cn } from '@/lib/utils';
import { Share2, Clock } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/db/supabase';
import { useToast } from '@/hooks/use-toast'; // Assuming hook exists, if not will use alert

interface SecretCardProps {
    secret: any;
    onVote: (id: string) => void;
    isVoted: boolean;
}

export default function SecretCard({ secret, onVote }: SecretCardProps) {
    const secretData: SecretData = parseSecretContent(secret.content);
    const category = getCategory(secretData.categoryId);
    const [reactions, setReactions] = useState(secretData.reactions || { hug: 0, shock: 0, relatable: 0 });
    // Track current active reaction. 'null' if none. We strictly enforce 1 per user per session for simplicity.
    const [userReaction, setUserReaction] = useState<'hug' | 'shock' | 'relatable' | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [justShared, setJustShared] = useState(false);

    const handleReaction = async (type: 'hug' | 'shock' | 'relatable') => {
        if (userReaction === type) return; // Already selected this one

        setIsUpdating(true);
        try {
            // Calculate new counts
            const newReactions = { ...reactions };

            // If switching, decrement old
            if (userReaction) {
                newReactions[userReaction] = Math.max(0, newReactions[userReaction] - 1);
            }

            // Increment new
            newReactions[type] = newReactions[type] + 1;

            // Optimistic Update
            setReactions(newReactions);
            setUserReaction(type);

            // Save to DB
            const updatedSecretData: SecretData = {
                ...secretData,
                reactions: newReactions
            };

            const { error } = await supabase
                .from('secrets')
                .update({
                    content: JSON.stringify(updatedSecretData),
                    // We only increment total votes if it's a net new interaction (no previous reaction)
                    // But for simplicity/activity tracking, let's keep incrementing activity score
                    votes: secret.votes + (userReaction ? 0 : 1)
                })
                .eq('id', secret.id);

            if (error) throw error;
            onVote(secret.id);

        } catch (err) {
            console.error('Failed to save reaction:', err);
            // Revert state if needed ( omitted for brevity/UX flow )
        } finally {
            setIsUpdating(false);
        }
    };

    const handleShare = async () => {
        const shareText = `"${secretData.text}" - ${secretData.identity.name} \n\nRead more on The Void: ${window.location.origin}/wall`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Secret from The Void',
                    text: shareText,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(shareText);
                setJustShared(true);
                setTimeout(() => setJustShared(false), 2000);
            } catch (err) {
                console.error('Failed to copy', err);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "relative overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm p-0 transition-all hover:shadow-lg",
                category.borderColor
            )}
        >
            <div className={cn("absolute inset-0 opacity-[0.03] bg-gradient-to-br", category.gradient)} />

            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-2 border-b border-white/5 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-xl border border-white/10 shadow-inner">
                        {secretData.identity.avatar}
                    </div>
                    <div>
                        <p className={cn("font-bold text-sm leading-none", category.color)}>
                            {secretData.identity.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                                {category.label}
                            </p>
                            {secretData.expiresAt && (
                                <div className="flex items-center gap-0.5 text-[10px] text-orange-500 font-mono bg-orange-500/10 px-1 rounded">
                                    <Clock className="w-2.5 h-2.5" />
                                    <span>Expiring</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className={cn("p-2 rounded-full opacity-20", category.color)}>
                    <category.icon className="w-5 h-5" />
                </div>
            </div>

            {/* Content */}
            <div className="p-5 relative z-10">
                <p className={cn(
                    "text-lg md:text-xl font-medium leading-relaxed whitespace-pre-wrap dark:text-gray-100",
                    "selection:bg-primary/20 bg-clip-text"
                )}>
                    {secretData.text}
                </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-3 bg-black/5 dark:bg-black/20 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleReaction('relatable')} disabled={isUpdating}
                        className={cn("h-8 flex gap-1.5 rounded-full px-3", userReaction === 'relatable' ? "bg-red-500/10 text-red-500" : "text-muted-foreground hover:text-red-500")}
                    >
                        <span className="text-lg leading-none">❤️</span>
                        <span className="text-xs font-bold">{reactions.relatable}</span>
                    </Button>

                    <Button variant="ghost" size="sm" onClick={() => handleReaction('hug')} disabled={isUpdating}
                        className={cn("h-8 flex gap-1.5 rounded-full px-3", userReaction === 'hug' ? "bg-pink-500/10 text-pink-500" : "text-muted-foreground hover:text-pink-500")}
                    >
                        <span className="text-lg leading-none">🫂</span>
                        <span className="text-xs font-bold">{reactions.hug}</span>
                    </Button>

                    <Button variant="ghost" size="sm" onClick={() => handleReaction('shock')} disabled={isUpdating}
                        className={cn("h-8 flex gap-1.5 rounded-full px-3", userReaction === 'shock' ? "bg-yellow-500/10 text-yellow-500" : "text-muted-foreground hover:text-yellow-500")}
                    >
                        <span className="text-lg leading-none">🤯</span>
                        <span className="text-xs font-bold">{reactions.shock}</span>
                    </Button>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className={cn("h-8 w-8 p-0 rounded-full transition-colors", justShared ? "text-green-500 bg-green-500/10" : "text-muted-foreground hover:bg-white/10")}
                >
                    <Share2 className="w-4 h-4" />
                </Button>
            </div>
        </motion.div>
    );
}
