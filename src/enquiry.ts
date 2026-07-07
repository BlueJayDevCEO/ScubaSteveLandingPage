// One-click / form communication: opens the visitor's own mail app with a
// ready-to-send email to the enquiry inbox. The message is sent FROM the
// visitor's mailbox — no backend, API key, or third-party service required, and
// replies land straight back to them.

export const ENQUIRY_EMAIL = "steve@scubasteve.rocks";

export type EnquiryKind = "general" | "dive-centre";

/** Builds a mailto: link to the enquiry inbox with subject + body prefilled. */
export function buildMailto(subject: string, bodyLines: string[]): string {
  const body = bodyLines.join("\n");
  return `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const TEMPLATES: Record<EnquiryKind, { subject: string; body: string[] }> = {
  general: {
    subject: "Scuba Steve enquiry",
    body: [
      "Hi Steve,",
      "",
      "[Tell Steve what you'd like help with — a dive trip, a question about the app, feedback, or anything else.]",
      "",
      "—",
      "Sent from scubasteve.rocks"
    ]
  },
  "dive-centre": {
    subject: "Dive Centre Pilot enquiry",
    body: [
      "Hi Steve,",
      "",
      "I'd like to know more about the Dive Centre Pilot for my shop.",
      "",
      "Dive centre name:",
      "Location:",
      "Website:",
      "What my team gets asked most:",
      "",
      "—",
      "Sent from scubasteve.rocks/dive-centres"
    ]
  }
};

/** Open-ended enquiry (buttons/links) — opens the visitor's mail app. */
export function enquiryMailto(kind: EnquiryKind = "general"): string {
  const t = TEMPLATES[kind];
  return buildMailto(t.subject, t.body);
}

/** Diver updates signup, composed as an email from the visitor's mailbox. */
export function diverUpdatesMailto(fields: { name: string; email: string; country: string }): string {
  return buildMailto("Dive updates signup — Scuba Steve", [
    "Hi Steve,",
    "",
    "I'd like to receive dive updates.",
    "",
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    `Country: ${fields.country}`,
    "",
    "—",
    "Sent from scubasteve.rocks"
  ]);
}

/** Dive Centre Pilot application, composed as an email from the visitor's mailbox. */
export function pilotMailto(fields: {
  name: string;
  email: string;
  businessName: string;
  businessType: string;
  country: string;
  website: string;
  message: string;
}): string {
  const subject = `Dive Centre Pilot application — ${fields.businessName || fields.name}`;
  return buildMailto(subject, [
    "Hi Steve,",
    "",
    "I'd like to apply for the Dive Centre Pilot.",
    "",
    `Name: ${fields.name}`,
    `Work email: ${fields.email}`,
    `Business name: ${fields.businessName}`,
    `Business type: ${fields.businessType}`,
    `Country: ${fields.country}`,
    `Website: ${fields.website || "—"}`,
    "",
    "About the shop:",
    fields.message || "—",
    "",
    "—",
    "Sent from scubasteve.rocks/dive-centres"
  ]);
}
