// Prefilled mailto: links for the secondary "or email us directly" fallbacks.
// Reliable form delivery lives in src/inbox.ts (server-side, device-independent);
// these mailto links are only a courtesy for visitors who prefer their own mail app.
import { ENQUIRY_EMAIL } from "./inbox";

export type EnquiryKind = "general" | "dive-centre";

function buildMailto(subject: string, bodyLines: string[]): string {
  return `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    bodyLines.join("\n")
  )}`;
}

const TEMPLATES: Record<EnquiryKind, { subject: string; body: string[] }> = {
  general: {
    subject: "Scuba Steve enquiry",
    body: ["Hi Steve,", "", "[What would you like help with?]", "", "—", "Sent from scubasteve.rocks"]
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
      "",
      "—",
      "Sent from scubasteve.rocks/dive-centres"
    ]
  }
};

export function enquiryMailto(kind: EnquiryKind = "general"): string {
  const t = TEMPLATES[kind];
  return buildMailto(t.subject, t.body);
}
