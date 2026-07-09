import { FormEvent, useRef, useState } from "react";
import { trackLandingEvent, trackLandingEventOncePerSession } from "../analytics";
import { ENQUIRY_EMAIL, sendToInbox } from "../inbox";
import { media } from "../media";
import { DIVE_CENTRES_PATH, Link } from "../router";

type SubmitState = "idle" | "loading" | "success" | "error";

/**
 * Footer contact — one reliable form that both asks a question and opts into
 * updates. Delivered server-side via our own /api/business-interest endpoint
 * (Resend email + optional Firestore) so it works on any device, no mail app.
 */
export function Footer() {
  const [state, setState] = useState<SubmitState>("idle");
  const hasStarted = useRef(false);

  function handleFormStarted() {
    if (hasStarted.current) return;
    hasStarted.current = true;
    trackLandingEventOncePerSession("diver_updates_started", { source_section: "footer" });
    trackLandingEventOncePerSession("business_form_started", {
      source_section: "footer",
      visitor_type_signal: "diver"
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "loading") return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    if (form.get("websiteUrl")) return; // honeypot

    const payload = {
      visitorType: "diver",
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      country: String(form.get("country") || ""),
      message: String(form.get("message") || "Diver would like to receive updates."),
      websiteUrl: ""
    };

    setState("loading");
    trackLandingEvent("diver_updates_submitted", { source_section: "footer", cta_label: "Send to Steve" });
    trackLandingEvent("business_form_submitted", {
      source_section: "footer",
      cta_label: "Send to Steve",
      visitor_type_signal: "diver"
    });

    const ok = await sendToInbox(payload);
    if (ok) {
      formElement.reset();
      setState("success");
      trackLandingEvent("diver_updates_success", { source_section: "footer" });
      trackLandingEvent("business_form_success", { source_section: "footer", visitor_type_signal: "diver" });
    } else {
      setState("error");
      trackLandingEvent("business_form_error", { source_section: "footer", error_type: "delivery_failed" });
    }
  }

  const loading = state === "loading";

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

        <form className="footer-form" onFocusCapture={handleFormStarted} onSubmit={handleSubmit} aria-label="Contact Scuba Steve">
          <h3>Ask Steve, or get dive updates</h3>
          <p>Send a question or say hello. We reply by email — and can keep you posted on new features.</p>
          <div className="footer-form-row">
            <label>
              Name
              <input name="name" type="text" autoComplete="name" required disabled={loading} />
            </label>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" required disabled={loading} />
            </label>
            <label>
              Country
              <input name="country" type="text" autoComplete="country-name" required disabled={loading} />
            </label>
          </div>
          <label>
            Message <span className="label-optional">(optional)</span>
            <textarea name="message" placeholder="Anything you'd like to ask Steve?" disabled={loading} />
          </label>
          <label className="honeypot-field" aria-hidden="true">
            Website URL
            <input name="websiteUrl" type="text" tabIndex={-1} autoComplete="off" />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Sending…" : "Send to Steve"}
          </button>
          {state === "success" && (
            <p className="success" role="status">
              Thanks — your message is on its way to Steve. We'll reply by email.
            </p>
          )}
          {state === "error" && (
            <p className="error" role="alert">
              Something went wrong sending that. Please email <a href={`mailto:${ENQUIRY_EMAIL}`}>{ENQUIRY_EMAIL}</a> directly.
            </p>
          )}
        </form>
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
      </div>
    </footer>
  );
}
