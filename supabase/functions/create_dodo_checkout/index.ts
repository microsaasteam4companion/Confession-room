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
        const { product_id, room_id, name, price, quantity, type, customer } = await req.json();

        if (!product_id || !room_id) {
            throw new Error("Missing product_id or room_id");
        }

        const dodoApiKey = Deno.env.get("DODO_PAYMENTS_API_KEY");
        if (!dodoApiKey) {
            throw new Error("DODO_PAYMENTS_API_KEY not configured");
        }

        // 1. Create a pending order in Supabase
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                room_id: room_id,
                items: [{ product_id, name, price, quantity }],
                total_amount: price * quantity,
                currency: "usd",
                status: "pending",
                metadata: { type, ...customer }
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 2. Call Dodo Payments API to create checkout session
        const dodoUrl = dodoApiKey.startsWith("v0_")
            ? "https://test.dodopayments.com/checkouts"
            : "https://dodopayments.com/checkouts";

        const response = await fetch(dodoUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${dodoApiKey}`,
            },
            body: JSON.stringify({
                product_cart: [{ product_id: product_id, quantity: quantity || 1 }],
                customer: {
                    email: customer?.email || "customer@example.com",
                    name: customer?.name || "Guest User"
                },
                return_url: `${req.headers.get("origin")}/payment-success?order_id=${order.id}`,
                metadata: {
                    order_id: order.id,
                    room_id: room_id,
                    type: type
                }
            }),
        });

        const session = await response.json();

        if (!response.ok) {
            throw new Error(session.message || "Failed to create Dodo checkout session");
        }

        // 3. Update order with Dodo session ID
        await supabase
            .from("orders")
            .update({
                stripe_session_id: session.checkout_id || session.id, // Re-using field for now
            })
            .eq("id", order.id);

        return new Response(
            JSON.stringify({ url: session.checkout_url, orderId: order.id }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
