import { createClient } from "jsr:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(supabaseUrl!, supabaseKey!);

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { order_id, payment_id } = await req.json();

        if (!order_id) throw new Error("Missing order_id");

        const dodoApiKey = Deno.env.get("DODO_PAYMENTS_API_KEY");

        // 1. Fetch order from Supabase
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .select("*")
            .eq("id", order_id)
            .single();

        if (orderError || !order) throw new Error("Order not found");

        if (order.status === "completed") {
            return new Response(JSON.stringify({ verified: true, order }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // 2. Verify with Dodo API if payment_id is provided
        let verified = false;
        if (payment_id) {
            const dodoUrl = dodoApiKey?.startsWith("v0_")
                ? `https://test.dodopayments.com/payments/${payment_id}`
                : `https://dodopayments.com/payments/${payment_id}`;

            const response = await fetch(dodoUrl, {
                method: "GET",
                headers: { "Authorization": `Bearer ${dodoApiKey}` },
            });

            const payment = await response.json();
            if (payment.status === "succeeded") {
                verified = true;

                // 3. Fulfill the order (Extend time or Mark as Paid)
                if (order.metadata?.type === "create_room") {
                    // Create new room
                    const params = order.metadata.room_params;
                    const initialDurationSec = (params.initial_duration || 600);
                    const bonusMin = (order.metadata.duration_bonus || 0);
                    const totalDurationMs = (initialDurationSec * 1000) + (bonusMin * 60 * 1000);

                    const { data: newRoom, error: roomError } = await supabase
                        .from('rooms')
                        .insert({
                            name: params.name || 'Anonymous Room',
                            max_participants: params.max_participants || 10,
                            initial_duration: initialDurationSec,
                            expires_at: new Date(Date.now() + totalDurationMs).toISOString(),
                            status: 'active'
                        })
                        .select()
                        .single();

                    if (roomError) {
                        console.error("Failed to create room:", roomError);
                        throw roomError;
                    }

                    // Update order with new room_id
                    await supabase.from('orders').update({ room_id: newRoom.id }).eq('id', order_id);

                    // Return new room id so frontend can redirect
                    order.new_room_id = newRoom.id;
                }
                else if (order.metadata?.type === "extend_time") {
                    const minutes = order.metadata.minutes || 0;
                    await supabase.rpc('extend_room_time', {
                        p_room_id: order.room_id,
                        p_minutes: minutes
                    });
                }

                // Update order status
                await supabase
                    .from("orders")
                    .update({ status: "completed", stripe_payment_intent_id: payment_id })
                    .eq("id", order_id);
            }
        }

        return new Response(JSON.stringify({ verified, order }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
