import { FormEvent, useState } from "react";
import { track } from "@vercel/analytics";
import { media } from "./media";

const APP_URL = "https://www.scubasteve.rocks";

const problems = [
  "Forgot what fish you saw?",
  "Need dive trip ideas?",
  "Want scuba answers between dives?",
  "Underwater photos look disappointing?"
];

const solutions = [
  {
    title: "Marine Life ID",
    text: "Upload a dive photo and get a practical species identification starting point.",
    image: media.product.marineId
  },
  {
    title: "AI Dive Questions",
    text: "Ask scuba questions in plain language when you need a quick learning refresh.",
    image: media.product.aiChat
  },
  {
    title: "Dive Trip Planner",
    text: "Plan destinations, operator questions, conditions, and next steps before you book.",
    image: media.product.tripPlanner
  },
  {
    title: "Underwater Photo Enhancement",
    text: "Improve underwater images so sightings and memories are easier to review.",
    image: media.product.photoEnhancement
  }
];

const trustItems = [
  "Built from real scuba instruction experience",
  "Safety-aware learning",
  "Diver-first design",
  "Mobile-first tools"
];

type SubmitState = "idle" | "loading" | "success" | "error";

function trackLandingEvent(name: string, properties?: Record<string, string>) {
  track(name, properties);
}

function launchApp(source: string) {
  trackLandingEvent("launch_app_click", { source });
  window.location.href = APP_URL;
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function App() {
  const [businessState, setBusinessState] = useState<SubmitState>("idle");
  const [businessError, setBusinessError] = useState("");

  async function submitBusinessInterest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (businessState === "loading") return;
    setBusinessState("loading");
    setBusinessError("");

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      businessName: String(form.get("businessName") || ""),
      businessType: String(form.get("businessType") || ""),
      country: String(form.get("country") || ""),
      website: String(form.get("website") || ""),
      message: String(form.get("message") || "")
    };

    try {
      const response = await fetch("/api/business-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("business_signup_failed");
      }

      event.currentTarget.reset();
      setBusinessState("success");
      trackLandingEvent("business_interest_submit_success", {
        source: "landing-footer",
        businessType: payload.businessType || "unspecified"
      });
    } catch {
      setBusinessState("error");
      setBusinessError("We could not register your interest right now. Please try again in a moment.");
    }
  }

  function openBusinessInterest(source: string) {
    trackLandingEvent("business_interest_open", { source });
    scrollToId("business-interest");
  }

  return (
    <div className="site-shell">
      <nav className="nav">
        <a className="brand" href="#top" aria-label="Scuba Steve AI home">
          <img src={media.brand.oseaLogo.src} alt="" />
          <span>Scuba Steve AI</span>
        </a>
        <button className="nav-button" onClick={() => launchApp("nav")}>
          Try Scuba Steve Free
        </button>
      </nav>

      <header id="top" className="hero">
        <div className="hero-media" aria-hidden="true">
          <img src={media.hero.background.src} alt="" fetchPriority="high" />
        </div>
        <div className="hero-content">
          <p className="eyebrow">AI dive companion</p>
          <h1>Dive Smarter With Scuba Steve AI</h1>
          <p className="subheadline">
            The AI dive companion for marine life identification, dive planning, scuba learning, and underwater photography.
          </p>
          <div className="cta-row hero-actions">
            <button className="primary-cta primary-cta-strong" onClick={() => launchApp("hero")}>
              Try Scuba Steve Free
            </button>
            <button className="secondary-cta" onClick={() => openBusinessInterest("hero")}>
              Business Interest
            </button>
          </div>
        </div>
        <div className="device" aria-label="Scuba Steve trip planner preview">
          <div className="device-top" />
          <img src={media.product.tripPlanner.src} alt={media.product.tripPlanner.alt} />
        </div>
      </header>

      <section className="problem-section">
        <div className="section-heading">
          <p className="eyebrow dark-eyebrow">Why divers open Steve</p>
          <h2>Four common dive questions. One focused app.</h2>
        </div>
        <div className="problem-grid">
          {problems.map((problem) => (
            <span key={problem}>{problem}</span>
          ))}
        </div>
      </section>

      <section className="solution-section">
        <div className="section-heading">
          <p className="eyebrow dark-eyebrow">What Steve does</p>
          <h2>Identify, ask, plan, and improve.</h2>
        </div>
        <div className="solution-grid">
          {solutions.map((solution) => (
            <article key={solution.title} className="solution-card">
              <img src={solution.image.src} alt={solution.image.alt} loading="lazy" decoding="async" />
              <div>
                <h3>{solution.title}</h3>
                <p>{solution.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="trust-section">
        {trustItems.map((item) => (
          <div key={item} className="trust-item">
            <span>✓</span>
            {item}
          </div>
        ))}
      </section>

      <section id="about" className="founder-section">
        <img src={media.brand.oseaLogo.src} alt="OSEA Diver founder Jay Van der Colff" />
        <div>
          <p className="eyebrow dark-eyebrow">Founder</p>
          <h2>Created by Jay Van der Colff</h2>
          <p>
            Scuba Steve is created by Jay Van der Colff, founder of OSEA Diver, from real scuba instruction experience and a practical goal: make useful dive knowledge easier to access.
          </p>
          <p className="safety-copy">
            Scuba Steve supports learning and planning. It does not replace certified training, professional briefings, local operators, emergency services, or personal dive judgement.
          </p>
        </div>
      </section>

      <section className="final-cta">
        <h2>Ready To Dive Smarter?</h2>
        <p>Launch Scuba Steve and start with the tool divers reach for most.</p>
        <button className="primary-cta primary-cta-strong" onClick={() => launchApp("final")}>
          Try Scuba Steve Free
        </button>
      </section>

      <footer id="business-interest" className="site-footer">
        <div className="footer-brand">
          <img src={media.brand.oseaLogo.src} alt={media.brand.oseaLogo.alt} />
          <div>
            <strong>OSEA Diver</strong>
            <span>Scuba Steve AI is created by OSEA Diver for practical scuba learning, dive planning, and ocean discovery.</span>
          </div>
        </div>
        <form className="footer-form" onSubmit={submitBusinessInterest} aria-label="Business interest form">
          <h3>Business Interest</h3>
          <div className="form-grid">
            <label>
              Name
              <input name="name" type="text" required disabled={businessState === "loading"} />
            </label>
            <label>
              Email
              <input name="email" type="email" required disabled={businessState === "loading"} />
            </label>
            <label>
              Business Name
              <input name="businessName" type="text" required disabled={businessState === "loading"} />
            </label>
            <label>
              Business Type
              <select name="businessType" required disabled={businessState === "loading"}>
                <option value="">Select one</option>
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
              <input name="country" type="text" required disabled={businessState === "loading"} />
            </label>
            <label>
              Website
              <input name="website" type="url" placeholder="Optional" disabled={businessState === "loading"} />
            </label>
          </div>
          <label>
            Message
            <textarea name="message" placeholder="Optional" disabled={businessState === "loading"} />
          </label>
          <button type="submit" disabled={businessState === "loading"}>
            {businessState === "loading" ? "Sending..." : "Send Business Interest"}
          </button>
          {businessState === "success" && <p className="success">Thanks. We'll contact you about Scuba Steve for dive businesses.</p>}
          {businessState === "error" && <p className="error">{businessError}</p>}
        </form>
      </footer>
    </div>
  );
}
