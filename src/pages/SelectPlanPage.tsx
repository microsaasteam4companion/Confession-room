import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomApi } from '@/db/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, CheckCircle, ArrowRight, Shield, Zap, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function SelectPlanPage() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [roomParams, setRoomParams] = useState<any>(null);

    useEffect(() => {
        // Check if we have pending room params
        const pendingParams = sessionStorage.getItem('pending_room_params');
        if (!pendingParams) {
            navigate('/admin/create-room');
            return;
        }
        setRoomParams(JSON.parse(pendingParams));
    }, []);

    const handleSelectPlan = async (plan: any) => {
        try {
            setLoading(true);

            // Create checkout session
            const { data, error } = await roomApi.createPaymentSession({
                name: `New Room: ${plan.name}`,
                price: plan.priceValue,
                quantity: 1,
                type: 'create_room',
                metadata: {
                    plan_id: plan.id,
                    duration_bonus: plan.durationBonus
                }
            });

            if (error || !data?.url) throw new Error('Failed to start payment');

            window.location.href = data.url;
        } catch (err) {
            console.error('Payment Error:', err);
            toast({
                title: 'Payment Failed',
                description: 'Could not initiate payment gateway.',
                variant: 'destructive'
            });
            setLoading(false);
        }
    };

    const plans = [
        {
            id: 'executive',
            name: 'EXECUTIVE',
            price: '$1.99',
            priceValue: 169, // Approx value in INR or keep as is if using USD
            duration: '25m Node Lifespan',
            features: [
                'Priority Link',
                'Custom Identity',
                'Priority Support'
            ],
            popular: true,
            hot: true
        },
        {
            id: 'pro',
            name: 'PRO NODE',
            price: '$4.99',
            priceValue: 420,
            duration: '50m Node Lifespan',
            features: [
                'Double Duration',
                'Room Styling',
                'Dedicated Help'
            ],
            popular: false
        }
    ];

    if (!roomParams) return null;

    return (
        <div className="min-h-screen p-4 flex flex-col items-center justify-center relative overflow-hidden grid-bg">
            <div className="relative z-10 w-full max-w-5xl space-y-12">
                <div className="text-center space-y-6">
                    <h1 className="text-5xl md:text-7xl wide-headline text-foreground dark:text-white neon-glow">UPGRADE THE VOID</h1>
                    <p className="text-primary font-black tracking-[0.2em] uppercase text-sm max-w-2xl mx-auto px-4">
                        You've used your "First One Free". To create "{roomParams.name}", please choose a plan to continue.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
                    {plans.map((plan: any, index) => (
                        <Card
                            key={index}
                            className={cn(
                                "relative flex flex-col items-start p-10 backdrop-blur-2xl transition-all duration-700 rounded-[2.5rem] border-black/5 dark:border-white/5 overflow-hidden",
                                "bg-white/80 dark:bg-black/60",
                                plan.popular ? 'border-primary shadow-[0_0_50px_rgba(255,0,128,0.15)] ring-1 ring-primary/50' : 'hover:border-white/20'
                            )}
                        >
                            {plan.hot && (
                                <div className="absolute top-4 right-4 z-20">
                                    <span className="hot-tag">HOT</span>
                                </div>
                            )}

                            {/* Glowing background for popular */}
                            {plan.popular && (
                                <div className="absolute inset-0 bg-primary/5 opacity-50 blur-3xl -z-10" />
                            )}

                            <CardHeader className="p-0 mb-6 space-y-1">
                                <span className="text-slate-500 dark:text-muted-foreground text-[10px] font-black tracking-widest uppercase">{plan.name}</span>
                                <CardTitle className="text-5xl font-black text-slate-900 dark:text-white">{plan.price}</CardTitle>
                                <p className="text-primary font-bold text-xs">{plan.duration}</p>
                            </CardHeader>

                            <CardContent className="p-0 mb-10 w-full">
                                <ul className="space-y-4">
                                    {plan.features.map((feature: string, idx: number) => (
                                        <li key={idx} className="flex items-center gap-3 text-slate-600 dark:text-white/70 font-bold text-xs uppercase tracking-tight">
                                            <Sparkles className="w-3.5 h-3.5 text-primary fill-primary" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter className="p-0 w-full mt-auto">
                                <Button
                                    className={cn(
                                        "w-full h-14 rounded-2xl font-black text-xs tracking-widest uppercase transition-all duration-300",
                                        plan.popular
                                            ? "bg-primary text-white hover:bg-primary/90 shadow-[0_10px_20px_rgba(255,0,128,0.3)] hover:translate-y-[-2px]"
                                            : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                                    )}
                                    onClick={() => handleSelectPlan(plan)}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        'INITIALIZE BILLING'
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="text-center">
                    <Button variant="ghost" onClick={() => navigate('/')}>Cancel & Return Home</Button>
                </div>
            </div>
        </div>
    );
}
