import { useEffect, useState } from 'react';

export function HeartRain() {
    const [hearts, setHearts] = useState<{ id: number; left: number; duration: number; delay: number }[]>([]);

    useEffect(() => {
        // Generate hearts
        const newHearts = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100, // Random horizontal position 0-100%
            duration: 3 + Math.random() * 4, // Random fall duration 3-7s
            delay: Math.random() * 5 // Random start delay
        }));
        setHearts(newHearts);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {hearts.map((heart) => (
                <div
                    key={heart.id}
                    className="absolute text-2xl animate-fall"
                    style={{
                        left: `${heart.left}%`,
                        top: '-50px',
                        animationName: 'fall',
                        animationDuration: `${heart.duration}s`,
                        animationDelay: `${heart.delay}s`,
                        animationIterationCount: 'infinite',
                        opacity: 0.8
                    }}
                >
                    ❤️
                </div>
            ))}
            <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
        </div>
    );
}
