import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function MidnightBlackout({ children }: { children: React.ReactNode }) {
    const [timeLeft, setTimeLeft] = useState<{ hours: number, minutes: number, seconds: number } | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const utcHours = now.getUTCHours();
            const utcMinutes = now.getUTCMinutes();

            // 8:30 AM IST / 10:00 PM EST = 03:00 UTC
            const START_UTC_HOUR = 3;
            const START_UTC_MINUTE = 0;
            const END_UTC_HOUR = 7;
            const END_UTC_MINUTE = 0; // 4 hour window

            const currentTotalMinutes = utcHours * 60 + utcMinutes;
            const startTotalMinutes = START_UTC_HOUR * 60 + START_UTC_MINUTE;
            const endTotalMinutes = END_UTC_HOUR * 60 + END_UTC_MINUTE;

            const open = currentTotalMinutes >= startTotalMinutes && currentTotalMinutes < endTotalMinutes;
            setIsOpen(open);

            if (!open) {
                const target = new Date(now);
                target.setUTCHours(START_UTC_HOUR, START_UTC_MINUTE, 0, 0);

                if (currentTotalMinutes >= startTotalMinutes) {
                    target.setUTCDate(target.getUTCDate() + 1);
                }

                const diff = target.getTime() - now.getTime();
                const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const m = Math.floor((diff / (1000 * 60)) % 60);
                const s = Math.floor((diff / 1000) % 60);

                setTimeLeft({ hours: h, minutes: m, seconds: s });
            }
            setLoading(false);
        };

        checkTime();
        const interval = setInterval(checkTime, 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
        </div>
    );

    if (!isOpen && timeLeft) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 relative overflow-hidden">
                {/* Background Noise/Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                <div className="relative z-10 text-center space-y-8 max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
                        The Midnight Blackout
                    </h1>

                    <p className="text-xl text-center text-muted-foreground font-mono">
                        The Vibe Check is currently <span className="text-red-500 font-bold">OFFLINE</span>.
                    </p>

                    <div className="grid grid-cols-3 gap-6 font-mono text-center">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                            <div className="text-5xl md:text-7xl font-bold text-purple-400 tabular-nums">
                                {String(timeLeft.hours).padStart(2, '0')}
                            </div>
                            <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2">Hours</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                            <div className="text-5xl md:text-7xl font-bold text-purple-400 tabular-nums">
                                {String(timeLeft.minutes).padStart(2, '0')}
                            </div>
                            <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2">Minutes</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                            <div className="text-5xl md:text-7xl font-bold text-purple-400 tabular-nums">
                                {String(timeLeft.seconds).padStart(2, '0')}
                            </div>
                            <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2">Seconds</div>
                        </div>
                    </div>

                    <p className="text-sm text-center text-muted-foreground uppercase tracking-widest animate-pulse">
                        Club opens at 8:30 AM IST / 10:00 PM EST.
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
