import { useState } from 'react';
import MidnightBlackout from '@/components/wall/MidnightBlackout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DUMMY_SECRETS } from '@/data/dummySecrets';
import { parseSecretContent } from '@/utils/secretUtils';

export default function MidnightClubPage() {
    const navigate = useNavigate();

    // In real app, fetch secrets with category 'club'
    // For now, use DUMMY_SECRETS but allow posting
    const [secrets, setSecrets] = useState(DUMMY_SECRETS);

    return (
        <MidnightBlackout>
            <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
                {/* Background Effects */}
                <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-blackPointer-events-none" />
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

                    <Button className="rounded-full bg-white text-black hover:bg-zinc-200 font-bold px-6 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        <Plus className="w-4 h-4 mr-2" />
                        Drop Secret
                    </Button>
                </header>

                <main className="pt-28 pb-20 container mx-auto max-w-xl px-4 space-y-8 relative z-10">
                    <div className="text-center space-y-2 mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 group cursor-pointer hover:bg-purple-500/20 transition-all">
                            <span className="text-3xl group-hover:scale-110 transition-transform">🥃</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Welcome to the VIP Lounge.</h2>
                        <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
                            What happens between 12 AM and 4 AM, <span className="text-zinc-300 italic">stays</span> between 12 AM and 4 AM.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Feed */}
                        {secrets.map((secret, i) => {
                            const content = parseSecretContent(secret.content);
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
                                        <button className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-purple-500 transition-colors">
                                            💭 Reply
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>
        </MidnightBlackout>
    );
}
