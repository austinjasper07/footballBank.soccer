const logoUrl =
  "https://firebasestorage.googleapis.com/v0/b/crystal-estate-2a0ac.appspot.com/o/Logo%2Flogo3.png?alt=media&token=bd47fb29-32f7-4e71-b799-e698202daf66";

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
    ? `<div class="email-details" style="margin:24px 0;border:1px solid #e5e7eb;background:#f9fafb;padding:18px 20px">${details.map(({ label, value }) => `<p style="margin:0 0 10px;color:#6b7280;font-size:13px"><strong style="color:#0b1220">${escapeEmailHtml(label)}:</strong> ${escapeEmailHtml(value)}</p>`).join("")}</div>`
    : "";
  const ctaMarkup =
    ctaLabel && ctaUrl
      ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" class="email-button" style="margin:28px 0 26px"><tr><td align="center" bgcolor="#2563eb" style="border-radius:4px"><a href="${escapeEmailHtml(ctaUrl)}" style="display:inline-block;background:#2563eb;border:1px solid #2563eb;border-radius:4px;color:#ffffff;font-size:14px;font-weight:700;line-height:20px;padding:13px 22px;text-align:center;text-decoration:none">${escapeEmailHtml(ctaLabel)}</a></td></tr></table>`
      : "";
  const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><style>@media only screen and (max-width:620px){.email-page{padding:16px 8px!important}.email-header{padding:22px 20px 18px!important}.email-content{padding:28px 20px 24px!important}.email-footer{padding:14px 20px!important}.email-title{font-size:24px!important;line-height:1.2!important}.email-copy{font-size:15px!important;line-height:1.65!important}.email-details{padding:15px!important}.email-button{width:100%!important}.email-button a{display:block!important;padding:13px 16px!important}.email-logo{width:160px!important;max-width:70%!important}}</style></head><body style="margin:0;background:#eef2f7;color:#0b1220;font-family:Arial,Helvetica,sans-serif"><div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeEmailHtml(preheader || title)}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="email-page" style="background:#eef2f7;padding:28px 12px"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;background:#ffffff"><tr><td class="email-header" style="padding:28px 32px 22px;border-bottom:4px solid #2563eb"><img class="email-logo" src="${logoUrl}" alt="FootballBank International" width="100" style="display:block;max-width:100px;height:auto"></td></tr><tr><td class="email-content" style="padding:34px"><p style="margin:0 0 10px;color:#2563eb;font-size:11px;font-weight:700;letter-spacing:2px;line-height:1.4;text-transform:uppercase">${escapeEmailHtml(eyebrow)}</p><h1 class="email-title" style="margin:0 0 22px;color:#0b1220;font-size:28px;line-height:1.15">${escapeEmailHtml(title)}</h1>${greeting ? `<p class="email-copy" style="margin:0 0 14px;font-size:15px;line-height:1.65">${escapeEmailHtml(greeting)}</p>` : ""}<div class="email-copy" style="font-size:15px;line-height:1.7;color:#374151">${body}</div>${detailMarkup}${ctaMarkup}${footerNote ? `<p style="margin:26px 0 0;padding-top:18px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;line-height:1.6">${escapeEmailHtml(footerNote)}</p>` : ""}</td></tr><tr><td class="email-footer" style="padding:16px 32px;background:#eef2f7;color:#6b7280;font-size:11px;line-height:1.6;text-align:center">FootballBank International &nbsp;|&nbsp; contact@footballbank.soccer<br>© FootballBank International</td></tr></table></td></tr></table></body></html>`;
  const text = `${title}\n\n${greeting || ""}\n\n${body.replace(/<[^>]*>/g, " ")}\n\n${ctaUrl || ""}`;
  return { html, text };
}
