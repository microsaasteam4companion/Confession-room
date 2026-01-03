import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
    // Log for debugging
    console.log(`[DodoCheckout] Request received: ${req.method}`);

    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
        const dodoApiKey = Deno.env.get("DODO_PAYMENTS_API_KEY");

        console.log(`[DodoCheckout] Env Check: URL=${!!supabaseUrl}, Key=${!!supabaseKey}, Dodo=${!!dodoApiKey}`);

        if (!supabaseUrl || !supabaseKey) {
            throw new Error("Missing Supabase Configuration");
        }
        if (!dodoApiKey) {
            throw new Error("DODO_PAYMENTS_API_KEY not configured");
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const body = await req.json();
        console.log(`[DodoCheckout] Payload:`, JSON.stringify(body));

        const { product_id, room_id, name, price, quantity, type, customer } = body;

        if (!product_id) {
            throw new Error("Missing product_id");
        }
        if (type !== 'create_room' && !room_id) {
            throw new Error("Missing room_id for extension");
        }

        // 1. Create a pending order in Supabase
        console.log("[DodoCheckout] Creating pending order...");
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                room_id: room_id || null,
                items: [{ product_id, name, price, quantity }],
                total_amount: price * quantity,
                currency: "usd",
                status: "pending",
                metadata: { type, ...customer }
            })
            .select()
            .single();

        if (orderError) {
            console.error("[DodoCheckout] DB Error:", orderError);
            throw orderError;
        }
        console.log(`[DodoCheckout] Order created: ${order.id}`);

        // 2. Call Dodo Payments API
        const dodoUrl = dodoApiKey.startsWith("v0_")
            ? "https://test.dodopayments.com/checkouts"
            : "https://live.dodopayments.com/checkouts";

        console.log(`[DodoCheckout] Calling Dodo API: ${dodoUrl}`);

        const returnUrl = `${req.headers.get("origin")}/payment-success?order_id=${order.id}`;

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
                return_url: returnUrl,
                metadata: {
                    order_id: order.id,
                    room_id: room_id || "", // Dodo metadata values MUST be strings
                    type: type
                }
            }),
        });

        // Try to get response as text first to handle "Method Not Allowed" or HTML errors
        const responseText = await response.text();
        console.log(`[DodoCheckout] Dodo Raw Response (${response.status}):`, responseText);

        let session;
        try {
            session = JSON.parse(responseText);
        } catch (e) {
            console.error("[DodoCheckout] Failed to parse Dodo response as JSON");
            throw new Error(`Dodo API Error (${response.status}): ${responseText.substring(0, 100)}`);
        }

        if (!response.ok) {
            throw new Error(session.message || `Dodo API Error: ${response.status}`);
        }

        // 3. Update order with Dodo session ID
        await supabase
            .from("orders")
            .update({
                stripe_session_id: session.checkout_id || session.id,
            })
            .eq("id", order.id);

        return new Response(
            JSON.stringify({ url: session.checkout_url, orderId: order.id }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("[DodoCheckout] Critical Error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
