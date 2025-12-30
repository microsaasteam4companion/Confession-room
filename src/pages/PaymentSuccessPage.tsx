import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { orderApi, roomApi } from '@/db/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, Copy, ArrowLeft } from 'lucide-react';
import QRCodeDataUrl from '@/components/ui/qrcodedataurl';
import type { Order } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  // New State for Room Creation
  const [createdRoom, setCreatedRoom] = useState<{ code: string; id: string } | null>(null);
  const [creatingRoom, setCreatingRoom] = useState(false);

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

      if (invokeError) throw new Error(invokeError.message);

      if (data?.data?.verified) {
        setVerified(true);

        // Check if there is a pending room creation
        const pendingRoomJson = sessionStorage.getItem('pending_room_params');
        if (pendingRoomJson) {
          await handlePostPaymentRoomCreation(JSON.parse(pendingRoomJson));
        } else {
          // Normal Order Flow (e.g. extension)
          const orderData = await orderApi.getOrderBySessionId(sessionId);
          setOrder(orderData);
        }

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

  const handlePostPaymentRoomCreation = async (params: any) => {
    try {
      setCreatingRoom(true);
      const newRoom = await roomApi.createRoom({
        name: params.name,
        max_participants: params.max_participants,
        initial_duration: params.initial_duration
      });

      setCreatedRoom({ code: newRoom.code, id: newRoom.id });

      // Update LocalStorage
      const myRooms = JSON.parse(localStorage.getItem('my_rooms') || '[]');
      if (!myRooms.includes(newRoom.id)) {
        myRooms.push(newRoom.id);
        localStorage.setItem('my_rooms', JSON.stringify(myRooms));
      }

      // Clear Session
      sessionStorage.removeItem('pending_room_params');
      toast({ title: 'Success', description: 'Paid Room Created Successfully!' });

    } catch (err) {
      console.error('Failed to create room after payment:', err);
      setError('Payment successful, but failed to create room. Please contact support.');
    } finally {
      setCreatingRoom(false);
    }
  };

  const copyRoomLink = () => {
    if (createdRoom) {
      const url = `${window.location.origin}/join/${createdRoom.code}`;
      navigator.clipboard.writeText(url);
      toast({ title: 'Copied!', description: 'Link copied to clipboard' });
    }
  };

  if (verifying || creatingRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md glass-card">
          <CardContent className="py-12 text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-lg">{creatingRoom ? 'Creating your premium room...' : 'Verifying payment...'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !verified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card border-destructive/50">
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
            {createdRoom ? 'Room Ready!' : 'Payment Successful!'}
          </CardTitle>
          <CardDescription>
            {createdRoom ? 'Your premium room is created' : 'Your transaction was completed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {createdRoom ? (
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-xl">
                <QRCodeDataUrl text={`${window.location.origin}/join/${createdRoom.code}`} width={180} />
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs text-muted-foreground">Room Code</p>
                <p className="text-3xl font-mono font-bold text-primary">{createdRoom.code}</p>
              </div>
              <div className="flex gap-2 w-full">
                <Button variant="outline" className="flex-1" onClick={copyRoomLink}>
                  <Copy className="w-4 h-4 mr-2" /> Copy Link
                </Button>
                <Button className="flex-1" onClick={() => navigate(`/room/${createdRoom.id}`)}>
                  Enter Room <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              {order && (
                <div className="space-y-3 p-4 bg-muted rounded-lg">
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
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => navigate('/')}>Home</Button>
                {order && (
                  <Button className="flex-1" onClick={() => navigate(`/room/${order.room_id}`)}>
                    Back to Chat
                  </Button>
                )}
              </div>
            </>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
