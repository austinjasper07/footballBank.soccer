import { User } from "@/lib/schemas";
import { sendEmail } from "@/lib/email";
import { brandedEmail, escapeEmailHtml } from "@/lib/emailTemplates";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://footballbank.soccer";

export async function notifyAdmins({ subject, title, message, link = "/en/admin" }) {
  const admins = await User.find({ role: "admin" }).select("email firstName lastName").lean();
  if (!admins.length) return;

  const adminUrl = `${siteUrl}${link}`;
  const email = brandedEmail({
    preheader: message,
    title,
    greeting: "Hello admin,",
    body: `<p>${escapeEmailHtml(message)}</p>`,
    ctaLabel: "Open admin dashboard",
    ctaUrl: adminUrl,
    footerNote: "This is an automated activity notification from the FootballBank platform.",
  });

  await Promise.allSettled(admins.map((admin) => sendEmail({
    to: admin.email,
    subject,
    html: email.html,
    text: email.text,
  })));
}
