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
