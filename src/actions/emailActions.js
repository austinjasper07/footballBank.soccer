'use server';

import { sendContactEmail, sendWelcomeEmail } from '@/utils/resendEmail';

export async function handleContactSubmit(formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');
  const subject = formData.get('subject');

  try {
    const result = await sendContactEmail({ name, email, message, subject });
    console.log(result);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return { success: true };
  } catch (err) {
    console.error('Email error:', err);
    return { success: false };
  }
}

export async function handleWelcomeSubmit(formData) {
  const email = formData.get('email');
  const username = formData.get('username');

  try {
    await sendWelcomeEmail({ email, username });
    return { success: true };
  } catch (error) {
    console.error('Welcome email error:', error);
    return { success: false };
  }
}

