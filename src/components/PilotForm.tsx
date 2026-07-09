import { FormEvent, useRef, useState } from "react";
import { trackLandingEvent, trackLandingEventOncePerSession } from "../analytics";
import { ENQUIRY_EMAIL, sendToInbox } from "../inbox";

type SubmitState = "idle" | "loading" | "success" | "error";

/**
 * Dive-centre pilot application. Delivered server-side via our own
 * /api/business-interest endpoint (Resend email + optional Firestore) so it
 * reaches steve@scubasteve.rocks on any device. Reply-to is the applicant's email.
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "loading") return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    if (form.get("websiteUrl")) return; // honeypot

    const fields = {
      visitorType: "business",
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      businessName: String(form.get("businessName") || ""),
      businessType: String(form.get("businessType") || ""),
      country: String(form.get("country") || ""),
      website: String(form.get("website") || ""),
      message: String(form.get("message") || ""),
      websiteUrl: ""
    };

    setState("loading");
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

    const ok = await sendToInbox(fields);
    if (ok) {
      formElement.reset();
      setState("success");
      trackLandingEvent("business_form_success", {
        source_section: "pilot_form",
        visitor_type_signal: "business",
        business_type: fields.businessType || "unspecified"
      });
    } else {
      setState("error");
      trackLandingEvent("business_form_error", {
        source_section: "pilot_form",
        visitor_type_signal: "business",
        error_type: "delivery_failed"
      });
    }
  }

  const loading = state === "loading";

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
          <input name="name" type="text" autoComplete="name" required disabled={loading} />
        </label>
        <label>
          Work email
          <input name="email" type="email" autoComplete="email" required disabled={loading} />
        </label>
        <label>
          Business name
          <input name="businessName" type="text" autoComplete="organization" required disabled={loading} />
        </label>
        <label>
          Business type
          <select name="businessType" required defaultValue="" disabled={loading}>
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
          <input name="country" type="text" autoComplete="country-name" required disabled={loading} />
        </label>
        <label>
          Website
          <input name="website" type="url" placeholder="Optional" disabled={loading} />
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
          disabled={loading}
        />
      </label>
      <button type="submit" className="primary-cta pilot-submit" disabled={loading}>
        {loading ? "Sending…" : "Apply for the pilot"}
      </button>
      {state === "success" && (
        <p className="success" role="status">
          Thanks — your application is on its way to Steve. We review pilot applications personally and reply by email.
        </p>
      )}
      {state === "error" && (
        <p className="error" role="alert">
          Something went wrong sending that. Please email <a href={`mailto:${ENQUIRY_EMAIL}`}>{ENQUIRY_EMAIL}</a> directly.
        </p>
      )}
    </form>
  );
}
