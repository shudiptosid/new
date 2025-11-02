import { supabase } from "@/lib/supabaseClient";

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
  requestId: string
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
