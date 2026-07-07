import { FormEvent, useRef, useState } from "react";
import { trackLandingEvent, trackLandingEventOncePerSession } from "../analytics";
import { media } from "../media";
import { DIVE_CENTRES_PATH, Link } from "../router";

type SubmitState = "idle" | "loading" | "success" | "error";

/**
 * Compact diver-updates signup. Reuses /api/business-interest with
 * visitorType=diver (name, email, country are the API's required fields).
 */
export function Footer() {
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "loading") return;
    const formElement = event.currentTarget;
    setState("loading");
    setErrorMessage("");

    const form = new FormData(formElement);
    const payload = {
      visitorType: "diver",
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      country: String(form.get("country") || ""),
      websiteUrl: String(form.get("websiteUrl") || "")
    };

    trackLandingEvent("diver_updates_submitted", {
      source_section: "footer",
      cta_label: "Get dive updates"
    });
    trackLandingEvent("business_form_submitted", {
      source_section: "footer",
      cta_label: "Get dive updates",
      visitor_type_signal: "diver"
    });

    try {
      const response = await fetch("/api/business-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("diver_signup_failed");
      formElement.reset();
      setState("success");
      trackLandingEvent("diver_updates_success", { source_section: "footer" });
      trackLandingEvent("business_form_success", {
        source_section: "footer",
        visitor_type_signal: "diver"
      });
    } catch {
      setState("error");
      setErrorMessage("We could not sign you up right now. Please try again in a moment.");
    }
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
              <input name="name" type="text" autoComplete="name" required disabled={state === "loading"} />
            </label>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" required disabled={state === "loading"} />
            </label>
            <label>
              Country
              <input name="country" type="text" autoComplete="country-name" required disabled={state === "loading"} />
            </label>
          </div>
          <label className="honeypot-field" aria-hidden="true">
            Website URL
            <input name="websiteUrl" type="text" tabIndex={-1} autoComplete="off" disabled={state === "loading"} />
          </label>
          <button type="submit" disabled={state === "loading"}>
            {state === "loading" ? "Signing up..." : "Get dive updates"}
          </button>
          {state === "success" && (
            <p className="success" role="status">
              Thanks — you're on the list.
            </p>
          )}
          {state === "error" && (
            <p className="error" role="alert">
              {errorMessage}
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
          <a href="mailto:steve@scubasteve.rocks">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
