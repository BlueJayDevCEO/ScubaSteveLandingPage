import { FormEvent, useRef, useState } from "react";
import { trackLandingEvent, trackLandingEventOncePerSession } from "../analytics";
import { pilotMailto } from "../enquiry";

type SubmitState = "idle" | "sent";

/**
 * Dive-centre pilot application. On submit it composes the application as an
 * email from the applicant's own mailbox (mailto) to the enquiry inbox — sent
 * from their mailbox, no backend needed. A silent best-effort POST also stores
 * the lead in Firestore when the backend is configured.
 */
export function PilotForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const hasStarted = useRef(false);

  function handleFormStarted() {
    if (hasStarted.current) return;
    hasStarted.current = true;
    trackLandingEventOncePerSession("dive_centre_form_started", {
      source_section: "pilot_form"
    });
    trackLandingEventOncePerSession("business_form_started", {
      source_section: "pilot_form",
      visitor_type_signal: "business"
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (form.get("websiteUrl")) return; // honeypot

    const fields = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      businessName: String(form.get("businessName") || ""),
      businessType: String(form.get("businessType") || ""),
      country: String(form.get("country") || ""),
      website: String(form.get("website") || ""),
      message: String(form.get("message") || "")
    };

    trackLandingEvent("dive_centre_form_submitted", {
      source_section: "pilot_form",
      business_type: fields.businessType || "unspecified",
      has_website: fields.website ? "true" : "false",
      has_message: fields.message ? "true" : "false"
    });
    trackLandingEvent("business_form_submitted", {
      source_section: "pilot_form",
      cta_label: "Apply for the pilot",
      visitor_type_signal: "business",
      business_type: fields.businessType || "unspecified",
      has_website: fields.website ? "true" : "false",
      has_message: fields.message ? "true" : "false"
    });

    // Silent best-effort capture (only if backend configured); never blocks the email.
    fetch("/api/business-interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorType: "business", ...fields, websiteUrl: "" })
    }).catch(() => {});

    // Primary: open the applicant's mailbox with the application ready to send.
    window.location.href = pilotMailto(fields);
    setState("sent");
  }

  return (
    <form
      className="pilot-form"
      onFocusCapture={handleFormStarted}
      onSubmit={handleSubmit}
      aria-label="Dive centre pilot application"
    >
      <div className="form-grid">
        <label>
          Your name
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label>
          Work email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Business name
          <input name="businessName" type="text" autoComplete="organization" required />
        </label>
        <label>
          Business type
          <select name="businessType" required defaultValue="">
            <option value="" disabled>
              Select one
            </option>
            <option>Dive Centre</option>
            <option>Dive Resort</option>
            <option>Liveaboard</option>
            <option>Instructor</option>
            <option>Travel Company</option>
            <option>Other</option>
          </select>
        </label>
        <label>
          Country
          <input name="country" type="text" autoComplete="country-name" required />
        </label>
        <label>
          Website
          <input name="website" type="url" placeholder="Optional" />
        </label>
      </div>
      <label className="honeypot-field" aria-hidden="true">
        Website URL
        <input name="websiteUrl" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <label>
        Tell us about your shop
        <textarea
          name="message"
          placeholder="Optional: location, typical customers, and the questions your team answers most often."
        />
      </label>
      <button type="submit" className="primary-cta pilot-submit">
        Apply for the pilot
      </button>
      <p className="form-hint">Opens your email app with your application ready to send from your mailbox.</p>
      {state === "sent" && (
        <p className="success" role="status">
          Your email app should open with your application — just hit send. We reply personally by email.
        </p>
      )}
    </form>
  );
}
