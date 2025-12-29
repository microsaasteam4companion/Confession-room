import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { orderApi } from '@/db/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import type { Order } from '@/types';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setError('No payment session found');
      setVerifying(false);
      return;
    }

    verifyPayment(sessionId);
  }, [searchParams]);

  const verifyPayment = async (sessionId: string) => {
    try {
      setVerifying(true);

      const { data, error: invokeError } = await supabase.functions.invoke('verify_stripe_payment', {
        body: JSON.stringify({ sessionId })
      });

      if (invokeError) {
        const errorMsg = await invokeError?.context?.text();
        console.error('Edge function error in verify_stripe_payment:', errorMsg || invokeError?.message);
        throw new Error(errorMsg || invokeError.message);
      }

      if (data?.data?.verified) {
        setVerified(true);
        
        // Load order details
        const orderData = await orderApi.getOrderBySessionId(sessionId);
        setOrder(orderData);
      } else {
        setError('Payment not verified. Please try again.');
      }
    } catch (err) {
      console.error('Payment verification failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to verify payment');
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md glass-card">
          <CardContent className="py-12 text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-lg">Verifying payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !verified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="w-6 h-6" />
              Payment Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error || 'Payment verification failed'}</p>
            <Button onClick={() => navigate('/')} className="w-full">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <CheckCircle className="w-8 h-8" />
            Payment Successful!
          </CardTitle>
          <CardDescription>
            Your time extension has been applied
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {order && (
            <div className="space-y-3 p-4 bg-muted rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-mono">{order.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-bold">₹{order.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-primary font-semibold">Completed</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              ✅ Time has been extended successfully
            </p>
            <p className="text-sm text-muted-foreground text-center">
              You can now return to your chat room
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/')}
            >
              Home
            </Button>
            {order && (
              <Button
                className="flex-1"
                onClick={() => navigate(`/room/${order.room_id}`)}
              >
                Back to Chat
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
