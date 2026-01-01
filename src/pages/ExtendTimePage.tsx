import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomApi } from '@/db/api';
import { supabase } from '@/db/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Clock, ArrowLeft, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Room, TimeExtensionOption } from '@/types';

const TIME_EXTENSION_OPTIONS: TimeExtensionOption[] = [
  { minutes: 5, price: 10, label: '5 Minutes' },
  { minutes: 15, price: 29, label: '15 Minutes' },
  { minutes: 60, price: 99, label: '1 Hour' }
];

export default function ExtendTimePage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!roomId) {
      navigate('/');
      return;
    }

    loadRoom();
  }, [roomId]);

  const loadRoom = async () => {
    try {
      setLoading(true);
      const roomData = await roomApi.getRoomById(roomId!);

      if (!roomData || roomData.status !== 'active') {
        toast({
          title: 'Room Not Found',
          description: 'This room has expired or been deleted',
          variant: 'destructive'
        });
        navigate('/');
        return;
      }

      setRoom(roomData);
    } catch (err) {
      console.error('Failed to load room:', err);
      toast({
        title: 'Error',
        description: 'Failed to load room',
        variant: 'destructive'
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleExtendTime = async (option: TimeExtensionOption) => {
    if (!roomId) return;

    try {
      setProcessing(true);

      const { data, error } = await supabase.functions.invoke('create_stripe_checkout', {
        body: JSON.stringify({
          room_id: roomId,
          items: [
            {
              name: `Extend time: ${option.label}`,
              price: option.price,
              quantity: 1
            }
          ],
          currency: 'inr',
          payment_method_types: ['card']
        })
      });

      if (error) {
        const errorMsg = await error?.context?.text();
        console.error('Edge function error in create_stripe_checkout:', errorMsg || error?.message);
        throw new Error(errorMsg || error.message);
      }

      if (data?.data?.url) {
        window.open(data.data.url, '_blank');
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Failed to create checkout:', err);
      toast({
        title: 'Payment Error',
        description: err instanceof Error ? err.message : 'Failed to initiate payment. Please ensure STRIPE_SECRET_KEY is configured.',
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!room) return null;

  const timeRemaining = Math.max(0, new Date(room.expires_at).getTime() - Date.now());
  const minutesRemaining = Math.floor(timeRemaining / 60000);

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(`/room/${roomId}`)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Chat
        </Button>

        <Card className="glass-card dark:bg-black dark:border-white/10 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-3xl gradient-text flex items-center gap-2">
              <Clock className="w-8 h-8" />
              Extend Time
            </CardTitle>
            <CardDescription>
              Room: {room.name} • Code: {room.code}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-4 bg-muted dark:bg-black/50 rounded-lg border border-white/5">
              <p className="text-sm text-muted-foreground mb-1">Time Remaining</p>
              <p className="text-3xl font-bold text-primary">{minutesRemaining} minutes</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Choose Extension</h3>
              {TIME_EXTENSION_OPTIONS.map((option) => (
                <Card key={option.minutes} className="glass-card dark:bg-black/80 dark:border-white/10 hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-lg">{option.label}</p>
                        <p className="text-sm text-muted-foreground">
                          Extend your chat session
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">₹{option.price}</p>
                        <Button
                          onClick={() => handleExtendTime(option)}
                          disabled={processing}
                          className="mt-2"
                        >
                          {processing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <CreditCard className="w-4 h-4 mr-2" />
                              Buy Now
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p>• Secure payment powered by Stripe</p>
              <p>• Time will be added immediately after payment</p>
              <p>• All transactions are encrypted and secure</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
