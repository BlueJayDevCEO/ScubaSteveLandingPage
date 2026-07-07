import { trackLandingEvent } from "../analytics";
import { ENQUIRY_EMAIL, EnquiryKind, enquiryGmail, enquiryMailto } from "../enquiry";

/**
 * "Send an enquiry" actions: a primary mail-app button (prefilled template) and
 * a secondary Gmail-compose link, for visitors who prefer to email rather than
 * fill a form. Both land at steve@scubasteve.rocks with a template ready to go.
 */
export function EnquiryActions({ kind = "general", section }: { kind?: EnquiryKind; section: string }) {
  function track(channel: string) {
    trackLandingEvent("enquiry_email_clicked", { source_section: section, channel, enquiry_kind: kind });
  }

  return (
    <div className="enquiry-actions">
      <a className="primary-cta enquiry-cta" href={enquiryMailto(kind)} onClick={() => track("mailto")}>
        Send an enquiry
      </a>
      <a
        className="enquiry-gmail"
        href={enquiryGmail(kind)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("gmail")}
      >
        or open in Gmail
      </a>
      <p className="enquiry-note">
        Opens your email with a message ready to send to <span>{ENQUIRY_EMAIL}</span>.
      </p>
    </div>
  );
}
