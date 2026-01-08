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
        const body = await req.json();
        console.log("[VerifyDodo] Payload received:", JSON.stringify(body));

        let order_id: string | undefined;
        let payment_id: string | undefined;

        if (body.event_type && body.data?.payload) {
            const payload = body.data.payload;
            order_id = payload.metadata?.order_id;
            payment_id = payload.id;
            console.log(`[VerifyDodo] Webhook: ${body.event_type}, Order: ${order_id}`);
            if (body.event_type !== "payment.succeeded") return new Response(JSON.stringify({ ok: true }));
        } else {
            order_id = body.order_id;
            payment_id = body.payment_id;
        }

        if (!order_id) throw new Error("Missing order_id");

        const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
        const { data: order, error: orderError } = await supabase.from("orders").select("*").eq("id", order_id).single();

        if (orderError || !order) throw new Error(`Order not found: ${order_id}`);
        if (order.status === "completed") return new Response(JSON.stringify({ verified: true, order }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

        const dodoApiKey = Deno.env.get("DODO_PAYMENTS_API_KEY");
        if (!dodoApiKey) throw new Error("DODO_PAYMENTS_API_KEY is not set in secrets");

        let verified = false;
        if (payment_id) {
            console.log(`[VerifyDodo] Checking payment ${payment_id}...`);
            const dodoUrl = dodoApiKey.startsWith("v0_")
                ? `https://test.dodopayments.com/payments/${payment_id}`
                : `https://dodopayments.com/payments/${payment_id}`;

            const response = await fetch(dodoUrl, {
                headers: { "Authorization": `Bearer ${dodoApiKey}` },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[VerifyDodo] Dodo API Error: ${response.status} - ${errorText}`);
                throw new Error(`Dodo API check failed: ${response.status}`);
            }

            const payment = await response.json();
            console.log(`[VerifyDodo] Payment Status: ${payment.status}`);

            if (payment.status === "succeeded") {
                verified = true;
                if (order.metadata?.type === "create_room") {
                    const params = order.metadata.room_params;
                    const totalDurationMs = ((params.initial_duration || 600) * 1000) + ((order.metadata.duration_bonus || 0) * 60 * 1000);
                    const { data: newRoom } = await supabase.from('rooms').insert({
                        name: params.name || 'Anonymous Room',
                        max_participants: params.max_participants || 10,
                        initial_duration: params.initial_duration || 600,
                        expires_at: new Date(Date.now() + totalDurationMs).toISOString(),
                        status: 'active'
                    }).select().single();
                    await supabase.from('orders').update({ room_id: newRoom.id, status: "completed", stripe_payment_intent_id: payment_id }).eq('id', order_id);
                    order.new_room_id = newRoom.id;
                    console.log(`[VerifyDodo] Room Created: ${newRoom.id}`);
                } else if (order.metadata?.type === "extend_time") {
                    console.log(`[VerifyDodo] Extending Room: ${order.room_id} by ${order.metadata.minutes}m`);
                    await supabase.rpc('extend_room_time', { p_room_id: order.room_id, p_minutes: order.metadata.minutes || 0 });
                    await supabase.from("orders").update({ status: "completed", stripe_payment_intent_id: payment_id }).eq("id", order_id);
                }
            }
        }

        return new Response(JSON.stringify({ verified, order }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    } catch (error) {
        console.error(`[VerifyDodo] Error:`, error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders });
    }
});
