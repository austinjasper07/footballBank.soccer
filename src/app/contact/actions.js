'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitContactForm(formData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const subject = formData.get('subject')
  const message = formData.get('message')

  if (!name || !email || !message || !subject) {
    return { success: false, error: 'Missing required fields' }
  }

  try {
    const {data, error} = await resend.emails.send({
      from: 'Soccer Bank Contact <noreply@footballbank.soccer>',
      to: ['info@footballbank.soccer'],
      subject: `[Contact Form] ${subject}`,
      replyTo: email,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br />${message.replace(/\n/g, '<br />')}</p>
      `
    })

    if (error) {
      console.error('Resend Email Error:', error);
      throw error;
      
    }
    return { success: true, data }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Resend Email Error:', error.message)
      return { success: false, error: error.message }
    }
    return { success: false, error }
  }
}
