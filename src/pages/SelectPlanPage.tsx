import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomApi } from '@/db/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, ArrowRight, Shield, Zap, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
            name: 'Standard',
            price: '₹29',
            priceValue: 29,
            duration: '+15 minutes',
            features: [
                'All free features',
                'Extended chat time',
                'Better value',
                'Multiple extensions',
                'Priority support'
            ],
            popular: true
        },
        {
            name: 'Premium',
            price: '₹99',
            priceValue: 99,
            duration: '+1 hour',
            features: [
                'All free features',
                'Maximum chat time',
                'Best value per minute',
                'Deep conversations',
                'VIP experience'
            ],
            popular: false
        }
    ];

    if (!roomParams) return null;

    return (
        <div className="min-h-screen p-4 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 gradient-bg" />

            <div className="relative z-10 w-full max-w-5xl space-y-8">
                <div className="text-center space-y-3 md:space-y-4">
                    <Badge variant="outline" className="px-3 py-0.5 md:px-4 md:py-1 text-xs md:text-sm">Upgrade Required</Badge>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text neon-glow">Select Your Room Plan</h1>
                    <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-4">
                        You've used your "First One Free". To create "{roomParams.name}", please choose a plan to continue.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto w-full">
                    {plans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`glass-card relative transition-all duration-500 hover:scale-105 hover:border-primary/50 ${plan.popular ? 'border-primary shadow-lg shadow-primary/20 scale-100 md:scale-105 glow-border' : ''}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <Badge className="bg-primary text-primary-foreground text-[10px] md:text-xs">Most Popular</Badge>
                                </div>
                            )}
                            <CardHeader className="text-center p-4 md:p-6">
                                <CardTitle className="text-xl md:text-2xl">{plan.name}</CardTitle>
                                <div className="py-2 md:py-4">
                                    <div className="text-3xl md:text-4xl font-bold text-primary">{plan.price}</div>
                                    <div className="text-xs md:text-sm text-muted-foreground mt-1">{plan.duration}</div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 md:p-6 pt-0">
                                <ul className="space-y-2 md:space-y-3">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-xs md:text-sm">
                                            <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary mt-0.5 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter className="p-4 md:p-6 pt-0">
                                <Button
                                    className="w-full h-10 md:h-12 btn-shimmer group"
                                    variant={plan.popular ? 'default' : 'outline'}
                                    onClick={() => handleSelectPlan(plan)}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        <>
                                            Choose Plan
                                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                                        </>
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
