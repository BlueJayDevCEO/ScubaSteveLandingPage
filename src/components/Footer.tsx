import { ENQUIRY_EMAIL } from "../inbox";
import { media } from "../media";
import { DIVE_CENTRES_PATH, Link } from "../router";

import { PilotForm } from "./PilotForm";

/**
 * Footer contact — one reliable form that both asks a question and opts into
 * updates. Delivered server-side via our own /api/business-interest endpoint
 * (Resend email + optional Firestore) so it works on any device, no mail app.
 */
export function Footer({ showEnquiryForm = true }: { showEnquiryForm?: boolean }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src={media.brand.oseaLogo.src} alt="OSEA Diver logo" width="58" height="58" />
          <div>
            <strong>Scuba Steve AI</strong>
            <span>
              An OSEA Diver product. Built to help divers plan, identify, research and refresh, and to help
              dive centres answer customers faster.
            </span>
          </div>
        </div>

        {showEnquiryForm && <div className="footer-form">
          <h3>Contact Scuba Steve</h3>
          <p>Choose what you’re enquiring about. We reply by email.</p>
          <PilotForm initialTopic="general" />
        </div>}
      </div>

      <div className="footer-meta">
        <p className="footer-safety">
          Scuba Steve supports planning, education and information. It does not replace certified training,
          professional instruction, medical advice, local dive briefings, emergency services, or your own judgement.
        </p>
        <nav className="footer-links" aria-label="Footer">
          <Link to={DIVE_CENTRES_PATH}>Dive Centre Pilot</Link>
          <a href={`mailto:${ENQUIRY_EMAIL}`}>{ENQUIRY_EMAIL}</a>
        </nav>
        <div className="footer-legal">
          <img src={media.brand.oseaLogo.src} alt="" width="28" height="28" aria-hidden="true" />
          <div>
            <p>OSEA diver ltd © {new Date().getFullYear()}</p>
            <p className="footer-legal-ico">ICO registration: ZC167586</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
