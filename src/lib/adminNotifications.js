import { User } from "@/lib/schemas";
import { sendEmail } from "@/lib/email";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://footballbank.soccer";

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

export async function notifyAdmins({ subject, title, message, link = "/en/admin" }) {
  const admins = await User.find({ role: "admin" }).select("email firstName lastName").lean();
  if (!admins.length) return;

  const adminUrl = `${siteUrl}${link}`;
  const html = `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#0b1220;max-width:600px;margin:auto"><h2>FootballBank International</h2><h3>${escapeHtml(title)}</h3><p>${escapeHtml(message)}</p><p><a href="${adminUrl}">Open admin dashboard</a></p></div>`;
  const text = `${title}\n\n${message}\n\n${adminUrl}`;

  await Promise.allSettled(admins.map((admin) => sendEmail({
    to: admin.email,
    subject,
    html,
    text,
  })));
}
