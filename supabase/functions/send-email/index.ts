// Supabase Edge Function to send emails via Resend
// Deployed at: /functions/v1/send-email

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("📧 Received request:", body);

    const { to, subject, message, isAdminNotification } = body;

    if (!to || !subject || !message) {
      console.error("❌ Missing required fields");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields: to, subject, message",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    if (!RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({
          success: false,
          error: "RESEND_API_KEY not configured",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("📤 Sending email to:", to);

    // Build HTML email template
    let htmlContent;

    if (isAdminNotification) {
      // Admin notification - Clean format with all request details
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                        <img src="https://circuitcrafters.cc/2nd%20logo.png" alt="Circuit Crafters" style="max-width: 120px; height: auto;">
                        <h1 style="color: #ffffff; margin: 15px 0 0 0; font-size: 24px;">🔔 New Service Request</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <div style="font-size: 16px; line-height: 1.8; color: #333333;">
                          ${message}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                        <p style="margin: 0; font-size: 12px; color: #666666;">
                          Circuit Crafters Admin Notification<br>
                          <a href="https://circuitcrafters.cc/admin-panel" style="color: #667eea; text-decoration: none; font-weight: 600;">View Admin Panel →</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;
    } else {
      // Customer email - Full branded template
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                        <img src="https://circuitcrafters.cc/2nd%20logo.png" alt="Circuit Crafters" style="max-width: 150px; height: auto;">
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="color: #333333; margin-top: 0; font-size: 24px;">Service Request Update</h2>
                        <div style="font-size: 16px; line-height: 1.6; color: #555555;">
                          ${message}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">Best regards,<br><strong>Circuit Crafters Team</strong></p>
                        <p style="margin: 0; font-size: 12px; color: #999999;">
                          🌐 <a href="https://circuitcrafters.cc" style="color: #667eea; text-decoration: none;">circuitcrafters.cc</a><br>
                          📧 <a href="mailto:noreply@circuitcrafters.cc" style="color: #667eea; text-decoration: none;">noreply@circuitcrafters.cc</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;
    }

    // Send email via Resend API with HTML
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Circuit Crafters <noreply@circuitcrafters.cc>",
        to: [to],
        subject: subject,
        html: htmlContent,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log("✅ Email sent successfully:", data.id);
      return new Response(JSON.stringify({ success: true, id: data.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      console.error("❌ Resend API error:", res.status, data);
      return new Response(
        JSON.stringify({
          success: false,
          error: data.message || "Resend API error",
          details: data,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: res.status,
        }
      );
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
