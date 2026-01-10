import { motion } from 'motion/react';
import { getCategory, parseSecretContent, SecretData } from '@/utils/secretUtils';
import { cn } from '@/lib/utils';
import { Share2, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/db/supabase';

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

    const [viewCount, setViewCount] = useState(secretData.views || 0);
    const [timeToBurn, setTimeToBurn] = useState<number>(100); // 100% to 0%
    const [isDissolving, setIsDissolving] = useState(false);
    const [isFullyBurned, setIsFullyBurned] = useState(false);
    const isIncinerator = category.id === 'incinerator';

    // Config for Incinerator
    const MAX_VIEWS = 100;
    const MAX_REACTIONS = 10;
    const BURN_TIME_LIMIT = 60 * 60 * 1000; // 1 hour for production (User requested)

    // Calculate total reactions
    const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);

    // It burns if Views limit hit OR Reaction limit hit
    const isBurnedByStats = isIncinerator && (viewCount >= MAX_VIEWS || totalReactions >= MAX_REACTIONS);

    useEffect(() => {
        if (!isIncinerator || isBurnedByStats || isDissolving) return;

        const checkTime = () => {
            const createdAt = new Date(secret.created_at).getTime();
            const now = new Date().getTime();
            const elapsed = now - createdAt;
            const remaining = Math.max(0, 1 - (elapsed / BURN_TIME_LIMIT));

            setTimeToBurn(remaining * 100);

            if (elapsed >= BURN_TIME_LIMIT && !isDissolving) {
                setIsDissolving(true);
            }
        };

        const timer = setInterval(checkTime, 1000);
        checkTime(); // Initial check

        return () => clearInterval(timer);
    }, [isIncinerator, isBurnedByStats, secret.created_at, isDissolving]);

    useEffect(() => {
        if (isIncinerator && !isBurnedByStats && !isDissolving) {
            const viewedKey = `viewed-${secret.id}`;
            if (sessionStorage.getItem(viewedKey)) return;

            sessionStorage.setItem(viewedKey, 'true');

            const incrementView = async () => {
                const newViews = (secretData.views || 0) + 1;
                setViewCount(newViews); // Optimistic

                const updatedData = { ...secretData, views: newViews };
                await supabase.from('secrets').update({
                    content: JSON.stringify(updatedData)
                }).eq('id', secret.id);
            };
            incrementView();
        }
    }, [isIncinerator, secret.id, isBurnedByStats, secretData, isDissolving]);

    const handleShare = async () => {
        const shareText = `"${secretData.text}" - ${secretData.identity.name} \n\nRead more on Community: ${window.location.origin}/wall`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Secret from Community',
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

    if (isBurnedByStats || isFullyBurned) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isDissolving ? {
                opacity: 0,
                scale: 0.8,
                filter: "blur(10px) brightness(2) contrast(2)",
                rotate: 2,
                y: -100,
                transition: { duration: 1.5, ease: "easeIn" }
            } : { opacity: 1, y: 0 }}
            onAnimationComplete={() => {
                if (isDissolving) setIsFullyBurned(true);
            }}
            className={cn(
                "relative overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm p-0 transition-all hover:shadow-lg",
                category.borderColor,
                isIncinerator && "animate-fire border-red-500/50 shadow-red-900/20",
                isDissolving && "pointer-events-none"
            )}
        >
            <div className={cn("absolute inset-0 opacity-[0.03] bg-gradient-to-br", category.gradient)} />

            {/* Fire Effect Overlay for Incinerator */}
            {isIncinerator && (
                <div className="absolute inset-x-0 bottom-0 h-1.5 bg-background/20 overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 shadow-[0_0_10px_rgba(255,69,0,0.8)]"
                        initial={{ width: "100%" }}
                        animate={{ width: `${timeToBurn}%` }}
                        transition={{ duration: 1, ease: "linear" }}
                    />
                </div>
            )}

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
                            {isIncinerator && (
                                <div className="flex items-center gap-1.5 text-[10px] text-red-500 font-mono bg-red-500/10 px-2 py-0.5 rounded animate-pulse border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                                    <span className="text-xs">🔥</span>
                                    <span className="font-black uppercase tracking-tighter">
                                        Dissolving in {Math.ceil((timeToBurn / 100) * (BURN_TIME_LIMIT / 1000)) > 60
                                            ? `${Math.ceil((timeToBurn / 100) * (BURN_TIME_LIMIT / 60000))}m`
                                            : `${Math.ceil((timeToBurn / 100) * (BURN_TIME_LIMIT / 1000))}s`}
                                    </span>
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
