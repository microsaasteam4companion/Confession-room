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
            id: 'basic',
            name: 'Basic Room',
            price: '₹49',
            priceValue: 49,
            durationBonus: 0,
            description: 'Perfect for quick chats',
            features: ['10 Minutes Duration', 'Up to 10 Participants', 'Standard Support'],
            popular: false
        },
        {
            id: 'pro',
            name: 'Pro Room',
            price: '₹99',
            priceValue: 99,
            durationBonus: 20 * 60, // +20 mins
            description: 'Extended conversations',
            features: ['30 Minutes Duration', 'Up to 50 Participants', 'Priority Support', '+20 Mins Bonus Time'],
            popular: true
        },
        {
            id: 'vip',
            name: 'VIP Lounge',
            price: '₹199',
            priceValue: 199,
            durationBonus: 60 * 60, // +60 mins
            description: 'Maximum privacy & time',
            features: ['1 Hour Duration', 'Unlimited Participants', 'VIP Badge', '+60 Mins Bonus Time'],
            popular: false
        }
    ];

    if (!roomParams) return null;

    return (
        <div className="min-h-screen p-4 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

            <div className="relative z-10 w-full max-w-5xl space-y-8">
                <div className="text-center space-y-4">
                    <Badge variant="outline" className="px-4 py-1">Upgrade Required</Badge>
                    <h1 className="text-4xl font-bold gradient-text">Select Your Room Plan</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        You've used your "First One Free". To create "{roomParams.name}", please choose a plan.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <Card
                            key={plan.id}
                            className={`glass-card relative transition-all duration-300 hover:scale-105 ${plan.popular ? 'border-primary shadow-lg shadow-primary/20 scale-105' : ''}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                                </div>
                            )}
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                                <div className="py-4">
                                    <div className="text-4xl font-bold text-primary">{plan.price}</div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full btn-shimmer group"
                                    variant={plan.popular ? 'default' : 'outline'}
                                    onClick={() => handleSelectPlan(plan)}
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Select Plan'}
                                    {!loading && <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />}
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
