import { FormEvent, useRef, useState } from "react";
import { trackLandingEvent, trackLandingEventOncePerSession } from "../analytics";
import { diverUpdatesMailto, enquiryMailto } from "../enquiry";
import { media } from "../media";
import { EnquiryActions } from "./EnquiryActions";
import { DIVE_CENTRES_PATH, Link } from "../router";

type SubmitState = "idle" | "sent";

/**
 * Diver-updates signup. On submit it composes the signup as an email from the
 * visitor's own mailbox (mailto) to the enquiry inbox — no backend needed. A
 * silent best-effort POST also stores the lead in Firestore when the backend is
 * configured, but the email always works regardless.
 */
export function Footer() {
  const [state, setState] = useState<SubmitState>("idle");
  const hasStarted = useRef(false);

  function handleFormStarted() {
    if (hasStarted.current) return;
    hasStarted.current = true;
    trackLandingEventOncePerSession("diver_updates_started", {
      source_section: "footer"
    });
    // Legacy name kept dual-fired so historical dashboards keep working.
    trackLandingEventOncePerSession("business_form_started", {
      source_section: "footer",
      visitor_type_signal: "diver"
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (form.get("websiteUrl")) return; // honeypot

    const fields = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      country: String(form.get("country") || "")
    };

    trackLandingEvent("diver_updates_submitted", {
      source_section: "footer",
      cta_label: "Email dive updates"
    });
    trackLandingEvent("business_form_submitted", {
      source_section: "footer",
      cta_label: "Email dive updates",
      visitor_type_signal: "diver"
    });

    // Silent best-effort capture (only if backend configured); never blocks the email.
    fetch("/api/business-interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorType: "diver", ...fields, websiteUrl: "" })
    }).catch(() => {});

    // Primary: open the visitor's mailbox with the signup email ready to send.
    window.location.href = diverUpdatesMailto(fields);
    setState("sent");
  }

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src={media.brand.oseaLogo.src} alt="OSEA Diver logo" width="58" height="58" />
          <div>
            <strong>Scuba Steve AI</strong>
            <span>
              An OSEA Diver product. Built to help divers plan, identify, research and refresh — and to help
              dive centres answer customers faster.
            </span>
          </div>
        </div>

        <form className="footer-form" onFocusCapture={handleFormStarted} onSubmit={handleSubmit} aria-label="Diver updates signup">
          <h3>Get dive updates from Steve</h3>
          <p>Occasional product news for divers. No spam, unsubscribe anytime.</p>
          <div className="footer-form-row">
            <label>
              Name
              <input name="name" type="text" autoComplete="name" required />
            </label>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              Country
              <input name="country" type="text" autoComplete="country-name" required />
            </label>
          </div>
          <label className="honeypot-field" aria-hidden="true">
            Website URL
            <input name="websiteUrl" type="text" tabIndex={-1} autoComplete="off" />
          </label>
          <button type="submit">Get dive updates</button>
          <p className="form-hint">Opens your email app to send from your mailbox — just hit send.</p>
          {state === "sent" && (
            <p className="success" role="status">
              Your email app should open — hit send and you're on the list.
            </p>
          )}
        </form>
      </div>

      <div className="footer-enquiry">
        <h3>Rather just ask?</h3>
        <p>Send Steve an enquiry and we'll reply by email — no form to fill in.</p>
        <EnquiryActions kind="general" section="footer" />
      </div>

      <div className="footer-meta">
        <p className="footer-safety">
          Scuba Steve supports planning, education and information. It does not replace certified training,
          professional instruction, medical advice, local dive briefings, emergency services, or your own judgement.
        </p>
        <nav className="footer-links" aria-label="Footer">
          <Link to={DIVE_CENTRES_PATH}>Dive Centre Pilot</Link>
          <a href={enquiryMailto("general")}>Contact</a>
        </nav>
      </div>
    </footer>
  );
}
