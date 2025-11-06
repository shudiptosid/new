// Simple Email Service using Resend API
// No Edge Functions or CLI required!

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;

interface EmailParams {
  to: string;
  subject: string;
  message: string;
  recipientName?: string;
}

/**
 * Send email notification using Resend API
 * Works directly from frontend - perfect for MVP!
 */
export const sendEmailNotification = async ({
  to,
  subject,
  message,
  recipientName = "there",
}: EmailParams) => {
  // Check if API key is configured
  if (!RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY not configured in .env file");
    console.warn("Add: VITE_RESEND_API_KEY=your_key_here");
    return {
      success: false,
      error: "Resend API key not configured",
    };
  }

  try {
    console.log(`📧 Sending email to: ${to}`);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Circuit Crafters <onboarding@resend.dev>", // Free test domain
        to: [to],
        subject: subject,
        text: message,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ Email send failed:", result);
      throw new Error(result.message || "Failed to send email");
    }

    console.log("✅ Email sent successfully:", result.id);
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("❌ Email error:", error);
    return {
      success: false,
      error: error.message || "Unknown error",
    };
  }
};

/**
 * Send admin reply notification email
 */
export const sendAdminReplyEmail = async ({
  userEmail,
  userName,
  replyMessage,
  newStatus,
}: {
  userEmail: string;
  userName: string;
  replyMessage: string;
  newStatus: string;
}) => {
  const subject = `Update on Your Service Request - Circuit Crafters`;

  const message = `Hi ${userName},

Your service request has been updated to "${newStatus}".

Admin Reply:
${replyMessage}

You can view full details in your dashboard at: ${window.location.origin}/dashboard

If you have any questions, feel free to reply to this email or contact us through the website.

Best regards,
The Circuit Crafters Team

---
This is an automated notification from Circuit Crafters IoT Solutions.`;

  return sendEmailNotification({
    to: userEmail,
    subject,
    message,
    recipientName: userName,
  });
};

/**
 * Send estimate notification email
 */
export const sendEstimateEmail = async ({
  userEmail,
  userName,
  estimateTotal,
  estimateDetails,
}: {
  userEmail: string;
  userName: string;
  estimateTotal: number;
  estimateDetails: string;
}) => {
  const subject = `Your Project Estimate - Circuit Crafters`;

  const message = `Hi ${userName},

Thank you for your interest in Circuit Crafters!

We've prepared a detailed cost estimate for your IoT project:

${estimateDetails}

Total Estimated Cost: ₹${estimateTotal.toFixed(2)}

This estimate is valid for 30 days from today.

You can view and download your full estimate from your dashboard at: ${
    window.location.origin
  }/dashboard

If you have any questions or would like to discuss the project further, please don't hesitate to reach out!

Best regards,
The Circuit Crafters Team

---
Circuit Crafters - Your IoT Solutions Partner`;

  return sendEmailNotification({
    to: userEmail,
    subject,
    message,
    recipientName: userName,
  });
};
