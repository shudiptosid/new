import { supabase } from '@/lib/supabaseClient'

// Contact form submission
export const submitContactForm = async (formData: {
  firstName: string
  lastName?: string
  email: string
  company?: string
  projectType?: string
  message: string
}) => {
  const { data, error } = await supabase
    .from('contacts')
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
    .select()

  if (error) {
    console.error('Error submitting contact form:', error)
    throw error
  }

  return data
}

// Quote form submission
export const submitQuoteForm = async (formData: {
  firstName: string
  lastName?: string
  email: string
  company?: string
  projectType?: string
  projectDetails: string
}) => {
  const { data, error } = await supabase
    .from('quotes')
    .insert([
      {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        company: formData.company,
        project_type: formData.projectType,
        project_details: formData.projectDetails,
      },
    ])
    .select()

  if (error) {
    console.error('Error submitting quote form:', error)
    throw error
  }

  return data
}