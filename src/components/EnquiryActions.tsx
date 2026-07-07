import { trackLandingEvent } from "../analytics";
import { ENQUIRY_EMAIL, EnquiryKind, enquiryMailto } from "../enquiry";

/**
 * "Send an enquiry" action: opens the visitor's own mail app with a message
 * template ready to send to steve@scubasteve.rocks. Sent from their mailbox.
 */
export function EnquiryActions({ kind = "general", section }: { kind?: EnquiryKind; section: string }) {
  return (
    <div className="enquiry-actions">
      <a
        className="primary-cta enquiry-cta"
        href={enquiryMailto(kind)}
        onClick={() =>
          trackLandingEvent("enquiry_email_clicked", { source_section: section, channel: "mailto", enquiry_kind: kind })
        }
      >
        Send an enquiry
      </a>
      <p className="enquiry-note">
        Opens your email app with a message ready to send to <span>{ENQUIRY_EMAIL}</span>.
      </p>
    </div>
  );
}
