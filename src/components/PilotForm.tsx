import { FormEvent, useRef, useState } from "react";
import { trackLandingEvent, trackLandingEventOncePerSession } from "../analytics";

type SubmitState = "idle" | "loading" | "success" | "error";

/**
 * Dive-centre pilot application. Posts to the existing /api/business-interest
 * endpoint with visitorType=business — same validation, honeypot, and
 * Firestore lead storage as before. Legacy business_form_* events are kept
 * alongside the new dive_centre_form_* events so historical dashboards keep
 * working.
 */
export function PilotForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
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
    setState("loading");
    setErrorMessage("");

    const form = new FormData(formElement);
    const payload = {
      visitorType: "business",
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      businessName: String(form.get("businessName") || ""),
      businessType: String(form.get("businessType") || ""),
      country: String(form.get("country") || ""),
      website: String(form.get("website") || ""),
      message: String(form.get("message") || ""),
      websiteUrl: String(form.get("websiteUrl") || "")
    };

    trackLandingEvent("dive_centre_form_submitted", {
      source_section: "pilot_form",
      business_type: payload.businessType || "unspecified",
      has_website: payload.website ? "true" : "false",
      has_message: payload.message ? "true" : "false"
    });
    trackLandingEvent("business_form_submitted", {
      source_section: "pilot_form",
      cta_label: "Apply for the pilot",
      visitor_type_signal: "business",
      business_type: payload.businessType || "unspecified",
      has_website: payload.website ? "true" : "false",
      has_message: payload.message ? "true" : "false"
    });

    try {
      const response = await fetch("/api/business-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        trackLandingEvent("business_form_error", {
          source_section: "pilot_form",
          visitor_type_signal: "business",
          error_type: "api_error",
          status_code: String(response.status)
        });
        throw new Error("pilot_application_failed");
      }

      formElement.reset();
      setState("success");
      trackLandingEvent("business_form_success", {
        source_section: "pilot_form",
        visitor_type_signal: "business",
        business_type: payload.businessType || "unspecified"
      });
    } catch {
      setState("error");
      setErrorMessage("We could not send your application right now. Please try again in a moment.");
    }
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
          <input name="name" type="text" autoComplete="name" required disabled={state === "loading"} />
        </label>
        <label>
          Work email
          <input name="email" type="email" autoComplete="email" required disabled={state === "loading"} />
        </label>
        <label>
          Business name
          <input name="businessName" type="text" autoComplete="organization" required disabled={state === "loading"} />
        </label>
        <label>
          Business type
          <select name="businessType" required disabled={state === "loading"} defaultValue="">
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
          <input name="country" type="text" autoComplete="country-name" required disabled={state === "loading"} />
        </label>
        <label>
          Website
          <input name="website" type="url" placeholder="Optional" disabled={state === "loading"} />
        </label>
      </div>
      <label className="honeypot-field" aria-hidden="true">
        Website URL
        <input name="websiteUrl" type="text" tabIndex={-1} autoComplete="off" disabled={state === "loading"} />
      </label>
      <label>
        Tell us about your shop
        <textarea
          name="message"
          placeholder="Optional: location, typical customers, and the questions your team answers most often."
          disabled={state === "loading"}
        />
      </label>
      <button type="submit" className="primary-cta pilot-submit" disabled={state === "loading"}>
        {state === "loading" ? "Sending application..." : "Apply for the pilot"}
      </button>
      {state === "success" && (
        <p className="success" role="status">
          Thanks — your application is in. We review pilot applications personally and will reply by email.
        </p>
      )}
      {state === "error" && (
        <p className="error" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
