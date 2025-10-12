// /utils/email.ts
import { Resend } from 'resend';
import WelcomeEmail from '@/components/emails/WelcomeEmail';
import ContactEmail from '@/components/emails/ContactUs';
import OrderConfirmationEmail from '@/components/emails/OrderConfirmationEmail';
import SubscriptionConfirmationEmail from '@/components/emails/SubscriptionConfirmationEmail';
import AdminOrderNotificationEmail from '@/components/emails/AdminOrderNotification';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to, firstName) {
  return await resend.emails.send({
    from: 'Footballbank <contact@footballbank.soccer>',
    to: to,
    subject: `Welcome to Footballbank, ${firstName}!`,
    react: WelcomeEmail({ firstName }), // JSX rendered as HTML by Resend
  });
}

export async function sendContactEmail({ name, email, message, subject }) {
  return await resend.emails.send({
    from: 'Footballbank <contact@footballbank.soccer>',
    to: 'contact@footballbank.soccer',
    subject: subject,
    react: ContactEmail({ name, email, message, subject }),
  });
}

export async function sendOrderConfirmationEmail({ 
  customerEmail, 
  customerName, 
  orderId, 
  items, 
  totalAmount, 
  orderDate,
  shippingAddress 
}) {
  return await resend.emails.send({
    from: 'Footballbank <orders@footballbank.soccer>',
    to: customerEmail,
    subject: `Order Confirmation - ${orderId}`,
    react: OrderConfirmationEmail({ 
      customerName, 
      orderId, 
      items, 
      totalAmount, 
      orderDate,
      shippingAddress 
    }),
  });
}

export async function sendSubscriptionConfirmationEmail({ 
  customerEmail, 
  customerName, 
  planName, 
  subscriptionId,
  amount,
  billingCycle,
  nextBillingDate,
  features 
}) {
  return await resend.emails.send({
    from: 'Footballbank <subscriptions@footballbank.soccer>',
    to: customerEmail,
    subject: `Subscription Confirmed - ${planName} Plan`,
    react: SubscriptionConfirmationEmail({ 
      customerName, 
      planName, 
      subscriptionId,
      amount,
      billingCycle,
      nextBillingDate,
      features 
    }),
  });
}

export async function sendAdminOrderNotificationEmail({ 
  orderId, 
  customerName, 
  customerEmail,
  customerAddress,
  shippingAddress,
  items, 
  totalAmount, 
  orderDate,
  paymentStatus,
  stripeSessionId 
}) {
  return await resend.emails.send({
    from: 'Footballbank <orders@footballbank.soccer>',
    to: 'ayodeji@footballbank.soccer',
    subject: `New Order Notification - ${orderId}`,
    react: AdminOrderNotificationEmail({ 
      orderId, 
      customerName, 
      customerEmail,
      customerAddress,
      shippingAddress,
      items, 
      totalAmount, 
      orderDate,
      paymentStatus,
      stripeSessionId 
    }),
  });
}
