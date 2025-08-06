// /utils/email.ts
import { Resend } from 'resend';
import WelcomeEmail from '@/components/emails/WelcomeEmail';
import ContactEmail from '@/components/emails/ContactUs';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to, firstName) {
  return await resend.emails.send({
    from: 'Footballbank <noreply@footballbank.soccer>',
    to: to,
    subject: `Welcome to Footballbank, ${firstName}!`,
    react: WelcomeEmail({ firstName }), // JSX rendered as HTML by Resend
  });
}

export async function sendContactEmail({ name, email, message, subject }) {
  return await resend.emails.send({
    from: 'Footballbank <noreply@footballbank.soccer>',
    to: 'contact@footballbank.soccer',
    subject: subject,
    react: ContactEmail({ name, email, message, subject }),
  });
}
