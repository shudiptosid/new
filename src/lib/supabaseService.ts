import { supabase } from "@/lib/supabaseClient";

export interface AdminAllowedEmail {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface AdminActivityLog {
  id: string;
  created_at: string;
  table_name: string;
  action: "INSERT" | "UPDATE" | "DELETE";
  record_id: string | null;
  actor_id: string | null;
  actor_email: string | null;
  details: any;
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const isValidGmail = (email: string) =>
  /^[a-zA-Z0-9._%+-]+@(gmail\.com|googlemail\.com)$/.test(
    normalizeEmail(email),
  );

// Email validation function
const isValidEmail = (email: string): boolean => {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

// Contact form submission
export const submitContactForm = async (formData: {
  firstName: string;
  lastName?: string;
  email: string;
  company?: string;
  projectType?: string;
  message: string;
}) => {
  // Validate email before database insertion
  if (!isValidEmail(formData.email)) {
    throw new Error("Invalid email address format");
  }

  const { data, error } = await supabase
    .from("contacts")
    .insert([
      {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        company: formData.company,
        project_type: formData.projectType,
        message: formData.message,
      },
    ])
    .select();

  if (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }

  // Send admin notification email with full request details
  try {
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const fullName = `${formData.firstName} ${formData.lastName || ""}`.trim();

    // Build detailed request info with all Q&A
    const requestDetails = `
      <strong>Customer Name:</strong> ${fullName}<br>
      <strong>Email:</strong> ${formData.email}<br>
      ${
        formData.company
          ? `<strong>Company:</strong> ${formData.company}<br>`
          : ""
      }
      ${
        formData.projectType
          ? `<strong>Project Type:</strong> ${formData.projectType}<br>`
          : ""
      }
      <br>
      <strong>Message:</strong><br>
      ${formData.message.replace(/\n/g, "<br>")}
    `;

    const adminEmailData = {
      to: "circuitcraftersiot@gmail.com",
      subject: `🔔 New Service Request from ${fullName}`,
      message: requestDetails,
      isAdminNotification: true, // Flag for admin emails
    };

    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(adminEmailData),
    });

    const result = await response.json();

    console.log("📧 Admin Email Response:", response.status, result);

    if (response.ok) {
      console.log("✅ Admin notification sent successfully!", result);
    } else {
      console.error(
        "⚠️ Failed to send admin notification:",
        response.status,
        result,
      );
      // Don't throw error - request is saved, email is optional
    }
  } catch (emailError) {
    console.error("⚠️ Error sending admin notification:", emailError);
    // Don't throw - request is saved in database, that's what matters
  }

  return data;
};

// ========================================
// ADMIN FUNCTIONS
// ========================================

// Get all requests for admin dashboard with timeout
export const getAllRequests = async (status?: string) => {
  try {
    let query = supabase
      .from("admin_all_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100); // Limit to recent 100 requests for faster loading

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching requests:", error);
      return []; // Return empty array instead of throwing
    }

    return data || [];
  } catch (error) {
    console.error("Exception fetching requests:", error);
    return []; // Return empty array on exception
  }
};

// Get specific request details by type and ID
export const getRequestDetails = async (
  requestType: string,
  requestId: string,
) => {
  const tableMap: { [key: string]: string } = {
    consulting: "consulting_requests",
    prototyping: "prototyping_requests",
    firmware: "firmware_requests",
    ondemand: "ondemand_requests",
  };

  const tableName = tableMap[requestType];
  if (!tableName) {
    throw new Error("Invalid request type");
  }

  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("id", requestId)
    .single();

  if (error) {
    console.error("Error fetching request details:", error);
    throw error;
  }

  return data;
};

// Submit admin reply and update status
export const submitAdminReply = async (replyData: {
  requestType: string;
  requestId: string;
  userId: string;
  userEmail: string;
  replyMessage: string;
  newStatus: string;
  previousStatus: string;
}) => {
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id, full_name, role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id)
    .single();

  if (!profile || profile.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }

  // Insert reply
  const { data: replyResult, error: replyError } = await supabase
    .from("admin_replies")
    .insert({
      request_type: replyData.requestType,
      request_id: replyData.requestId,
      user_id: replyData.userId,
      user_email: replyData.userEmail,
      admin_id: profile.id,
      admin_name: profile.full_name,
      reply_message: replyData.replyMessage,
      previous_status: replyData.previousStatus,
      new_status: replyData.newStatus,
      is_read_by_user: false,
    })
    .select()
    .single();

  if (replyError) {
    console.error("Error submitting reply:", replyError);
    throw replyError;
  }

  // Send email via Supabase Edge Function + Resend (instant, no CORS!)
  try {
    const emailData = {
      to: replyData.userEmail,
      subject: "Update on Your Service Request - Circuit Crafters",
      message: `Hi there,

Your service request has been updated to "${replyData.newStatus}".

Admin Reply:
${replyData.replyMessage}

You can view full details in your dashboard at: https://circuitcrafters.cc/dashboard

If you have any questions, feel free to reply to this email.

Best regards,
Circuit Crafters Team

---
This is an automated notification from Circuit Crafters.`,
    };

    // Call Supabase Edge Function directly with fetch
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(emailData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("✅ Email sent successfully via Resend!", result);
    } else {
      console.error("⚠️ Error sending email:", response.status, result);
    }
  } catch (emailError) {
    console.error("⚠️ Error sending email:", emailError);
    // Don't throw error - reply was successful even if email failed
  }

  // Update request status
  const tableMap: { [key: string]: string } = {
    consulting: "consulting_requests",
    prototyping: "prototyping_requests",
    firmware: "firmware_requests",
    ondemand: "ondemand_requests",
  };

  const tableName = tableMap[replyData.requestType];
  const { error: updateError } = await supabase
    .from(tableName)
    .update({ status: replyData.newStatus })
    .eq("id", replyData.requestId);

  if (updateError) {
    console.error("Error updating request status:", updateError);
    throw updateError;
  }

  return replyResult;
};

// Get user's messages/replies with faster timeout
export const getUserMessages = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("admin_replies")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50); // Limit to recent 50 messages for faster loading

    if (error) {
      console.error("Error fetching user messages:", error);
      return []; // Return empty array instead of throwing
    }

    return data || [];
  } catch (error) {
    console.error("Exception fetching user messages:", error);
    return []; // Return empty array on exception
  }
};

// Mark message as read
export const markMessageAsRead = async (messageId: string) => {
  const { error } = await supabase
    .from("admin_replies")
    .update({
      is_read_by_user: true,
      read_at: new Date().toISOString(),
    })
    .eq("id", messageId);

  if (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
};

// Get unread message count
export const getUnreadMessageCount = async (userId: string) => {
  const { data, error } = await supabase.rpc("get_unread_message_count", {
    user_uuid: userId,
  });

  if (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }

  return data || 0;
};

export const getAdminAllowedEmails = async (): Promise<AdminAllowedEmail[]> => {
  const { data, error } = await supabase
    .from("admin_allowed_emails")
    .select("*")
    .order("email", { ascending: true });

  if (error) {
    console.error("Error fetching admin allowed emails:", error);
    throw error;
  }

  return (data || []) as AdminAllowedEmail[];
};

export const addAdminAllowedEmail = async (email: string) => {
  const normalizedEmail = normalizeEmail(email);

  if (!isValidGmail(normalizedEmail)) {
    throw new Error("Only Gmail addresses are allowed for admin access");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    throw new Error("You must be signed in to manage admin allowlist");
  }

  const { data, error } = await supabase
    .from("admin_allowed_emails")
    .upsert(
      {
        email: normalizedEmail,
        is_active: true,
        created_by: user.id,
      },
      { onConflict: "email" },
    )
    .select("*")
    .single();

  if (error) {
    console.error("Error adding admin allowed email:", error);
    throw error;
  }

  return data as AdminAllowedEmail;
};

export const setAdminAllowedEmailStatus = async (
  email: string,
  isActive: boolean,
) => {
  const { data, error } = await supabase
    .from("admin_allowed_emails")
    .update({ is_active: isActive })
    .eq("email", normalizeEmail(email))
    .select("*")
    .single();

  if (error) {
    console.error("Error updating admin allowed email status:", error);
    throw error;
  }

  return data as AdminAllowedEmail;
};

export const deleteAdminAllowedEmail = async (email: string) => {
  const { error } = await supabase
    .from("admin_allowed_emails")
    .delete()
    .eq("email", normalizeEmail(email));

  if (error) {
    console.error("Error deleting admin allowed email:", error);
    throw error;
  }
};

export const isCurrentUserInAdminAllowlist = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.email) {
    return false;
  }

  const email = normalizeEmail(user.email);

  if (!isValidGmail(email)) {
    return false;
  }

  const { data, error } = await supabase
    .from("admin_allowed_emails")
    .select("email")
    .eq("email", email)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Error checking admin allowlist:", error);
    return false;
  }

  return Boolean(data);
};

export const verifyAdminPanelPassword = async (password: string) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("You must be signed in to verify admin password");
  }

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/verify-admin-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ password }),
    },
  );

  let result: any = null;
  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    const statusPrefix = `Admin verification failed (${response.status})`;
    throw new Error(
      result?.error ? `${statusPrefix}: ${result.error}` : statusPrefix,
    );
  }

  return result as { success: boolean; expiresInMinutes: number };
};

export const getAdminActivityLogs = async (
  limit = 120,
): Promise<AdminActivityLog[]> => {
  const { data, error } = await supabase
    .from("admin_activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching admin activity logs:", error);
    throw error;
  }

  return (data || []) as AdminActivityLog[];
};
