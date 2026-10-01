import { FormEvent, useState } from "react";
import { trackLandingEvent, trackLandingEventOncePerSession } from "../analytics";
import { ENQUIRY_EMAIL, sendToInbox } from "../inbox";

type Topic = "pilot" | "updates" | "general";
type SubmitState = "idle" | "loading" | "success" | "error";
const TOPICS = { pilot: "Dive Centre Pilot", updates: "Diver updates", general: "General enquiry" };

export function PilotForm({ initialTopic = "pilot" }: { initialTopic?: Topic }) {
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [state, setState] = useState<SubmitState>("idle");
  const loading = state === "loading";
  const isPilot = topic === "pilot";
  const source = initialTopic === "pilot" ? "pilot_form" : "footer";

  function trackPhase(phase: "started" | "submitted" | "success" | "error") {
    const properties = { source_section: source, enquiry_topic: topic, visitor_type_signal: isPilot ? "business" : "diver" };
    const track = phase === "started" ? trackLandingEventOncePerSession : trackLandingEvent;
    track(`business_form_${phase}`, properties);
    if (isPilot) track(`dive_centre_form_${phase}`, properties);
    if (topic === "updates") track(`diver_updates_${phase}`, properties);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    const element = event.currentTarget;
    const form = new FormData(element);
    if (form.get("websiteUrl")) return;
    const fields = {
      visitorType: isPilot ? "business" : "diver",
      enquiryTopic: TOPICS[topic],
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      country: String(form.get("country") || ""),
      businessName: String(form.get("businessName") || ""),
      businessType: String(form.get("businessType") || ""),
      website: String(form.get("website") || ""),
      message: String(form.get("message") || ""),
      websiteUrl: ""
    };
    setState("loading");
    trackPhase("submitted");
    const ok = await sendToInbox(fields);
    setState(ok ? "success" : "error");
    trackPhase(ok ? "success" : "error");
    if (ok) element.reset();
  }

  return (
    <form className="pilot-form" onFocusCapture={() => trackPhase("started")} onSubmit={handleSubmit} aria-label="Contact Scuba Steve">
      <label>
        What are you enquiring about?
        <select name="enquiryTopic" value={topic} disabled={loading} onChange={(event) => { setTopic(event.target.value as Topic); setState("idle"); }}>
          <option value="pilot">Dive Centre Pilot</option>
          <option value="updates">Diver updates</option>
          <option value="general">General enquiry</option>
        </select>
      </label>
      <div className="form-grid">
        <label>Your name<input name="name" type="text" autoComplete="name" required disabled={loading} /></label>
        <label>Email<input name="email" type="email" autoComplete="email" required disabled={loading} /></label>
        <label>Country<input name="country" type="text" autoComplete="country-name" required disabled={loading} /></label>
        {isPilot && <>
          <label>Business name<input name="businessName" type="text" autoComplete="organization" required disabled={loading} /></label>
          <label>Business type<select name="businessType" required defaultValue="" disabled={loading}>
            <option value="" disabled>Select one</option>
            <option>Dive Centre</option><option>Dive Resort</option><option>Liveaboard</option><option>Instructor</option><option>Travel Company</option><option>Other</option>
          </select></label>
          <label>Website<input name="website" type="url" placeholder="Optional" disabled={loading} /></label>
        </>}
      </div>
      <label className="honeypot-field" aria-hidden="true">Website URL<input name="websiteUrl" type="text" tabIndex={-1} autoComplete="off" /></label>
      <label>Message <span className="label-optional">(optional)</span><textarea name="message" placeholder={isPilot ? "Tell us about your shop and the questions your team answers most often." : "What would you like to ask Steve?"} disabled={loading} /></label>
      <button type="submit" className="primary-cta pilot-submit" disabled={loading}>{loading ? "Sending…" : isPilot ? "Apply for the pilot" : "Send to Steve"}</button>
      {state === "success" && <p className="success" role="status">Thanks, your enquiry has been received. We’ll reply by email.</p>}
      {state === "error" && <p className="error" role="alert">Something went wrong sending that. Please email <a href={`mailto:${ENQUIRY_EMAIL}`}>{ENQUIRY_EMAIL}</a> directly.</p>}
    </form>
  );
}
