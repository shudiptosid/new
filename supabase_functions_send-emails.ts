import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (req) => {
  try {
    // Create Supabase admin client
    const supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!);

    // Get pending emails
    const { data: pendingEmails, error: fetchError } = await supabaseAdmin
      .from("email_notifications")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(10);

    if (fetchError) throw fetchError;

    const results = [];

    // Process each email
    for (const email of pendingEmails || []) {
      try {
        // Send email via Resend
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Circuit Crafters <noreply@yourdomain.com>", // Change to your verified domain
            to: [email.recipient_email],
            subject: email.subject,
            text: email.message,
          }),
        });

        const emailResult = await res.json();

        if (res.ok) {
          // Mark as sent
          await supabaseAdmin
            .from("email_notifications")
            .update({
              status: "sent",
              sent_at: new Date().toISOString(),
            })
            .eq("id", email.id);

          results.push({ email: email.recipient_email, status: "sent" });
        } else {
          // Mark as failed
          await supabaseAdmin
            .from("email_notifications")
            .update({
              status: "failed",
              error_message: JSON.stringify(emailResult),
            })
            .eq("id", email.id);

          results.push({
            email: email.recipient_email,
            status: "failed",
            error: emailResult,
          });
        }
      } catch (error) {
        console.error("Error sending email:", error);
        results.push({
          email: email.recipient_email,
          status: "error",
          error: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        results,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
