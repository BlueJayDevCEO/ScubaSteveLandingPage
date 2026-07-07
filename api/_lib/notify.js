// Enquiry email notifications. Every lead captured on any channel is emailed to
// the enquiry inbox (steve@scubasteve.rocks) in addition to being stored in
// Firestore. Uses the Resend HTTP API via plain fetch — no npm dependency.
//
// Configure in Vercel Project Settings:
//   RESEND_API_KEY   (required to actually send; if unset, sending is skipped)
//   ENQUIRY_EMAIL    (optional, default steve@scubasteve.rocks)
//   ENQUIRY_FROM     (optional, default "Scuba Steve <steve@scubasteve.rocks>")
//                    — must be an address on a domain verified in Resend.
//
// Sending is best-effort: a failure here must never fail the visitor's submission
// (the lead is already safe in Firestore).

const ENQUIRY_TO = process.env.ENQUIRY_EMAIL || "steve@scubasteve.rocks";
const ENQUIRY_FROM = process.env.ENQUIRY_FROM || "Scuba Steve <steve@scubasteve.rocks>";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

export function isEnquiryNotifyConfigured() {
  return Boolean(RESEND_API_KEY);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildRows(lead) {
  const fields = [
    ["Type", lead.visitorType === "business" ? "Dive centre / business" : "Diver"],
    ["Name", lead.name],
    ["Email", lead.email],
    ["Business", lead.businessName],
    ["Business type", lead.businessType],
    ["Country", lead.country],
    ["Website", lead.website],
    ["Message", lead.message],
    ["Source", lead.source || "landing-page"]
  ];
  return fields.filter(([, v]) => v);
}

/**
 * Emails a captured lead to the enquiry inbox. Resolves { skipped: true } when
 * no provider is configured; throws on a provider error so the caller can log it.
 */
export async function sendEnquiryNotification(lead) {
  if (!RESEND_API_KEY) return { skipped: true };

  const rows = buildRows(lead);
  const subject =
    lead.visitorType === "business"
      ? `New dive-centre pilot application: ${lead.businessName || lead.name || "unknown"}`
      : `New diver signup: ${lead.name || lead.email || "unknown"}`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#0b2b34;line-height:1.5">
      <h2 style="margin:0 0 12px">${escapeHtml(subject)}</h2>
      <table style="border-collapse:collapse">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:4px 12px 4px 0;color:#3f5a62;vertical-align:top"><strong>${escapeHtml(
                label
              )}</strong></td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`
          )
          .join("")}
      </table>
    </div>`;

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");

  const payload = {
    from: ENQUIRY_FROM,
    to: [ENQUIRY_TO],
    subject,
    html,
    text
  };
  // Replies go straight back to the enquirer.
  if (lead.email) payload.reply_to = lead.email;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`resend_failed_${response.status}:${detail.slice(0, 200)}`);
  }

  return { ok: true };
}
