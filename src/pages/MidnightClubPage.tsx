import { useState } from 'react';
import MidnightBlackout from '@/components/wall/MidnightBlackout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DUMMY_SECRETS } from '@/data/dummySecrets';
import { parseSecretContent } from '@/utils/secretUtils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, MessageCircle } from 'lucide-react';

export default function MidnightClubPage() {
    const navigate = useNavigate();

    // In real app, fetch secrets with category 'club'
    // For now, use DUMMY_SECRETS but allow posting
    const [secrets, setSecrets] = useState(DUMMY_SECRETS);
    const { toast } = useToast();

    // Reply & Thread State
    const [replyOpen, setReplyOpen] = useState(false);
    const [selectedSecret, setSelectedSecret] = useState<any>(null);
    const [replyText, setReplyText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());

    const toggleThread = (secretId: string) => {
        const newExpanded = new Set(expandedThreads);
        if (newExpanded.has(secretId)) {
            newExpanded.delete(secretId);
        } else {
            newExpanded.add(secretId);
        }
        setExpandedThreads(newExpanded);
    }

    const handleReplyClick = (secret: any) => {
        setSelectedSecret(secret);
        setReplyOpen(true);
    };

    const handleSendReply = async () => {
        if (!replyText.trim() || !selectedSecret) return;

        setIsSending(true);
        await new Promise(resolve => setTimeout(resolve, 600));

        // Create new reply object
        const newReply = {
            text: replyText,
            timestamp: new Date().toISOString(),
            identity: { name: 'Anonymous Ghost', avatar: '👻' }
        };

        // Update local state (find secret and append reply)
        const updatedSecrets = secrets.map(s => {
            if (s.id === selectedSecret.id) {
                const content = parseSecretContent(s.content);
                const updatedContent = {
                    ...content,
                    replies: [newReply, ...(content.replies || [])]
                };
                return { ...s, content: JSON.stringify(updatedContent) };
            }
            return s;
        });

        setSecrets(updatedSecrets); // Update feed

        // Auto-expand the thread to show the new reply
        const newExpanded = new Set(expandedThreads);
        newExpanded.add(selectedSecret.id);
        setExpandedThreads(newExpanded);

        toast({
            title: "Reply Sent",
            description: "Your whisper has been added to the thread.",
            duration: 2000,
        });

        setIsSending(false);
        setReplyOpen(false);
        setReplyText("");
    };

    // ... handlePost logic stays same ... 



    // Messaging State
    const [newPostText, setNewPostText] = useState("");

    const handlePost = async () => {
        if (!newPostText.trim()) return;

        setIsSending(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const newSecret = {
            id: Date.now().toString(),
            content: JSON.stringify({
                text: newPostText,
                categoryId: 'midnight',
                identity: { name: 'Anonymous Ghost', avatar: '👻' },
                reactions: {}
            }),
            created_at: new Date().toISOString(),
            votes: 0,
            isDummy: true
        };

        setSecrets([newSecret, ...secrets]);
        setNewPostText("");
        setIsSending(false);

        toast({
            title: "Secret Dropped",
            description: "Your voice echoes in the void.",
            duration: 3000,
        });
    };

    return (
        <MidnightBlackout>
            <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans pb-24">
                {/* Background Effects */}
                <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black pointer-events-none" />
                <div className="fixed inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

                <header className="fixed top-0 inset-x-0 p-4 flex items-center justify-between z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/wall')} className="rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-lg font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 animate-gradient-x">
                                The Midnight Club
                            </h1>
                            <p className="text-[10px] text-purple-400 font-mono tracking-widest flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                LIVE & UNCENSORED
                            </p>
                        </div>
                    </div>
                </header>

                <main className="pt-24 container mx-auto max-w-xl px-4 space-y-8 relative z-10">
                    <div className="space-y-4">
                        {/* Feed */}
                        {secrets.map((secret, i) => {
                            const content = parseSecretContent(secret.content);
                            const replies = content.replies || [];
                            const isExpanded = expandedThreads.has(secret.id);
                            return (
                                <div key={i} className="group relative bg-zinc-900/50 hover:bg-zinc-900/80 border border-white/5 hover:border-purple-500/30 rounded-2xl p-6 transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/5">
                                                {content.identity?.avatar || ['👻', '🧛', '🧟', '🧙‍♀️', '🧚'][i % 5]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                                                    {content.identity?.name || `Anonymous ${['Owl', 'Wolf', 'Bat', 'Moon', 'Star'][i % 5]}`}
                                                    <span className="px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[9px] uppercase tracking-wider font-bold">VIP</span>
                                                </div>
                                                <div className="text-[10px] text-zinc-600 font-mono">Just now</div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-zinc-300 font-medium leading-relaxed group-hover:text-white transition-colors">
                                        "{content.text}"
                                    </p>
                                    <div className="mt-6 flex items-center gap-4 border-t border-white/5 pt-4">
                                        <button className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-pink-500 transition-colors">
                                            ❤️ <span>{content.reactions?.relatable || 0}</span>
                                        </button>
                                        <button
                                            onClick={() => handleReplyClick(secret)}
                                            className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-purple-500 transition-colors"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            <span>{replies.length}</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>

                {/* Fixed Bottom Chat Bar */}
                <div className="fixed bottom-0 inset-x-0 p-4 bg-black/80 backdrop-blur-xl border-t border-white/10 z-50">
                    <div className="max-w-xl mx-auto flex items-end gap-3">
                        <div className="flex-1 bg-zinc-900/50 rounded-3xl border border-white/10 focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/50 transition-all flex items-center">
                            <Textarea
                                value={newPostText}
                                onChange={(e) => setNewPostText(e.target.value)}
                                placeholder="Type a secret..."
                                className="min-h-[44px] max-h-[120px] py-3 px-4 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-zinc-500 resize-none"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handlePost();
                                    }
                                }}
                            />
                        </div>
                        <Button
                            onClick={handlePost}
                            disabled={!newPostText.trim() || isSending}
                            size="icon"
                            className="h-11 w-11 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-900/20 shrink-0"
                        >
                            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
                        </Button>
                    </div>
                </div>

                <Sheet open={replyOpen} onOpenChange={setReplyOpen}>
                    <SheetContent side="bottom" className="h-[80vh] bg-black border-t border-white/10 text-white rounded-t-[2rem] p-0 flex flex-col">
                        <SheetHeader className="p-4 border-b border-white/10 shrink-0">
                            <SheetTitle className="text-center font-bold text-white">Comments</SheetTitle>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {/* Original Post */}
                            {selectedSecret && (
                                <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg bg-white/5 w-8 h-8 rounded-full flex items-center justify-center">
                                            {parseSecretContent(selectedSecret.content).identity?.avatar}
                                        </span>
                                        <span className="font-bold text-zinc-300 text-sm">
                                            {parseSecretContent(selectedSecret.content).identity?.name}
                                        </span>
                                    </div>
                                    <p className="text-white/90 leading-relaxed font-medium">
                                        "{parseSecretContent(selectedSecret.content).text}"
                                    </p>
                                </div>
                            )}

                            {/* Replies List */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">
                                    Replies ({selectedSecret && (parseSecretContent(selectedSecret.content).replies?.length || 0)})
                                </h3>

                                {selectedSecret && parseSecretContent(selectedSecret.content).replies?.map((reply: any, idx: number) => (
                                    <div key={idx} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
                                            {reply.identity?.avatar || '👻'}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-zinc-400">{reply.identity?.name || 'Ghost'}</span>
                                                <span className="text-[10px] text-zinc-600">{new Date(reply.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <p className="text-sm text-zinc-300 bg-white/5 px-3 py-2 rounded-lg rounded-tl-none inline-block">
                                                {reply.text}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-black shrink-0 pb-8">
                            <div className="flex items-end gap-3">
                                <Textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="min-h-[44px] max-h-[100px] py-3 px-4 bg-zinc-900 border-white/10 focus:border-purple-500 text-white placeholder:text-zinc-600 resize-none rounded-xl"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendReply();
                                        }
                                    }}
                                />
                                <Button
                                    onClick={handleSendReply}
                                    disabled={isSending || !replyText.trim()}
                                    size="icon"
                                    className="h-11 w-11 rounded-full bg-purple-600 hover:bg-purple-500 text-white shrink-0"
                                >
                                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </MidnightBlackout>
    );
}
