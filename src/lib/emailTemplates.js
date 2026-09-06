const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://footballbank.soccer";
const logoUrl = `${siteUrl}/logo/logo3.svg`;

export const escapeEmailHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export function brandedEmail({
  preheader,
  eyebrow = "FootballBank International",
  title,
  greeting,
  body,
  details = [],
  ctaLabel,
  ctaUrl,
  footerNote,
}) {
  const detailMarkup = details.length
    ? `<div style="margin:24px 0;border:1px solid #e5e7eb;background:#f9fafb;padding:18px 20px">${details.map(({ label, value }) => `<p style="margin:0 0 10px;color:#6b7280;font-size:13px"><strong style="color:#0b1220">${escapeEmailHtml(label)}:</strong> ${escapeEmailHtml(value)}</p>`).join("")}</div>`
    : "";
  const ctaMarkup =
    ctaLabel && ctaUrl
      ? `<p style="margin:28px 0"><a href="${ctaUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:13px 18px;font-weight:700;font-size:14px">${escapeEmailHtml(ctaLabel)}</a></p>`
      : "";
  const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head><body style="margin:0;background:#eef2f7;color:#0b1220;font-family:Arial,Helvetica,sans-serif"><div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeEmailHtml(preheader || title)}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef2f7;padding:28px 12px"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff"><tr><td style="padding:28px 32px 22px;border-bottom:4px solid #2563eb"><img src="${logoUrl}" alt="FootballBank International" width="190" style="display:block;max-width:190px;height:auto"></td></tr><tr><td style="padding:34px 32px 28px"><p style="margin:0 0 10px;color:#2563eb;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase">${escapeEmailHtml(eyebrow)}</p><h1 style="margin:0 0 22px;color:#0b1220;font-size:28px;line-height:1.15">${escapeEmailHtml(title)}</h1>${greeting ? `<p style="margin:0 0 14px;font-size:15px;line-height:1.65">${escapeEmailHtml(greeting)}</p>` : ""}<div style="font-size:15px;line-height:1.7;color:#374151">${body}</div>${detailMarkup}${ctaMarkup}${footerNote ? `<p style="margin:26px 0 0;padding-top:18px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;line-height:1.6">${escapeEmailHtml(footerNote)}</p>` : ""}</td></tr><tr><td style="padding:16px 32px;background:#eef2f7;color:#6b7280;font-size:11px;line-height:1.6;text-align:center">FootballBank International &nbsp;|&nbsp; contact@footballbank.soccer<br>© FootballBank International</td></tr></table></td></tr></table></body></html>`;
  const text = `${title}\n\n${greeting || ""}\n\n${body.replace(/<[^>]*>/g, " ")}\n\n${ctaUrl || ""}`;
  return { html, text };
}
