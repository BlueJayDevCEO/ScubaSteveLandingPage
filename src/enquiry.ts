// One-click enquiry: opens the visitor's mail app (or Gmail) with the enquiry
// address, subject and a message template already filled in. Pure client-side —
// works without any backend or API key, and covers Gmail-as-default too.

export const ENQUIRY_EMAIL = "steve@scubasteve.rocks";

export type EnquiryKind = "general" | "dive-centre";

const TEMPLATES: Record<EnquiryKind, { subject: string; body: string }> = {
  general: {
    subject: "Scuba Steve enquiry",
    body: [
      "Hi Steve,",
      "",
      "[Tell Steve what you'd like help with — a dive trip, a question about the app, feedback, or anything else.]",
      "",
      "—",
      "Sent from scubasteve.rocks"
    ].join("\n")
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
    ].join("\n")
  }
};

/** mailto: link — opens the visitor's default mail app (incl. Gmail if default). */
export function enquiryMailto(kind: EnquiryKind = "general"): string {
  const t = TEMPLATES[kind];
  return `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(t.body)}`;
}

/** Gmail web compose — opens a prefilled Gmail draft in a new tab. */
export function enquiryGmail(kind: EnquiryKind = "general"): string {
  const t = TEMPLATES[kind];
  return (
    "https://mail.google.com/mail/?view=cm&fs=1" +
    `&to=${encodeURIComponent(ENQUIRY_EMAIL)}` +
    `&su=${encodeURIComponent(t.subject)}` +
    `&body=${encodeURIComponent(t.body)}`
  );
}
