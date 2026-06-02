import { FormEvent, useState } from "react";
import { track } from "@vercel/analytics";

const APP_URL = "https://www.scubasteve.rocks";

const trustItems = [
  "Built by a professional scuba instructor",
  "Designed for divers worldwide",
  "Mobile-first experience",
  "AI-powered dive companion"
];

const features = [
  {
    title: "Marine Life ID",
    text: "Upload a photo and identify marine species."
  },
  {
    title: "Dive Trip Planner",
    text: "Get dive destination guidance and travel inspiration."
  },
  {
    title: "AI Dive Instructor",
    text: "Ask scuba questions and learn before your next dive."
  }
];

const problems = [
  "Forgot the name of a fish",
  "Need dive trip ideas",
  "Want quick scuba answers",
  "No instructor nearby"
];

const faqs = [
  {
    question: "Is Scuba Steve a replacement for dive training?",
    answer:
      "No. Scuba Steve is a planning and learning companion. It does not replace certified training, local professionals, or safe in-water judgment."
  },
  {
    question: "Can Scuba Steve identify marine life?",
    answer:
      "Yes. You can upload a photo and Steve will help compare likely species, lookalikes, and useful context for divers."
  },
  {
    question: "Can beginners use it?",
    answer:
      "Yes. Beginners can ask plain-language scuba questions, explore trip ideas, and learn concepts before speaking with an instructor."
  },
  {
    question: "Will there be a premium version?",
    answer:
      "Yes. Scuba Steve is being built with a premium path for deeper planning, saved work, and expanded dive tools."
  }
];

type SubmitState = "idle" | "loading" | "success" | "error";

function trackLandingEvent(name: string, properties?: Record<string, string>) {
  track(name, properties);
}

function launchApp(source: string) {
  trackLandingEvent("launch_app_click", { source });
  window.location.href = APP_URL;
}

export default function App() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function submitEarlyAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("loading");
    setErrorMessage("");

    const form = new FormData(event.currentTarget);
    const payload = {
      email: String(form.get("email") || ""),
      name: String(form.get("name") || ""),
      diverLevel: String(form.get("diverLevel") || "")
    };

    try {
      const response = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("signup_failed");
      }

      event.currentTarget.reset();
      setSubmitState("success");
      trackLandingEvent("early_access_signup_success", {
        source: "landing-page",
        diverLevel: payload.diverLevel || "unspecified"
      });
    } catch {
      setSubmitState("error");
      setErrorMessage("We could not add you right now. Please try again in a moment.");
    }
  }

  return (
    <div className="site-shell">
      <nav className="nav">
        <a className="brand" href="#top" aria-label="Scuba Steve AI home">
          <img src="/images/osea-logo.png" alt="" />
          <span>Scuba Steve AI</span>
        </a>
        <div className="nav-links" aria-label="Primary navigation">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#faq">FAQ</a>
        </div>
        <button className="nav-button" onClick={() => launchApp("nav")}>
          Launch App
        </button>
      </nav>

      <header id="top" className="hero">
        <div className="hero-media" aria-hidden="true">
          <img src="/images/marine-id-preview.png" alt="" />
        </div>
        <div className="hero-content">
          <p className="eyebrow">AI-powered dive companion</p>
          <h1>Your AI Dive Buddy</h1>
          <p className="subheadline">Plan dives. Identify marine life. Learn faster. Dive smarter.</p>
          <p className="supporting">
            Scuba Steve AI helps divers identify marine life, plan dive trips, and get scuba guidance anytime.
          </p>
          <div className="cta-row">
            <button className="primary-cta" onClick={() => launchApp("hero")}>
              Launch Scuba Steve
            </button>
            <a
              className="secondary-cta"
              href="#early-access"
              onClick={() => trackLandingEvent("join_early_access_click", { source: "hero" })}
            >
              Join Early Access
            </a>
          </div>
        </div>
        <div className="device" aria-label="Scuba Steve product preview">
          <div className="device-top" />
          <img src="/images/dive-plan-preview.png" alt="Scuba Steve dive trip planner preview" />
          <div className="device-caption">
            <strong>Live app preview</strong>
            <span>Marine ID, trip planning, and scuba answers in one pocket-sized assistant.</span>
          </div>
        </div>
      </header>

      <section className="trust">
        {trustItems.map((item) => (
          <div key={item} className="trust-item">
            <span>✓</span>
            {item}
          </div>
        ))}
      </section>

      <section id="features" className="section light">
        <div className="section-heading">
          <h2>Three fast ways to dive smarter.</h2>
          <p>Clear paths into the app for the things divers actually need between dives, before trips, and after sightings.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article key={feature.title} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
              <button
                onClick={() => {
                  trackLandingEvent("feature_card_click", { feature: feature.title });
                  launchApp(`feature-${feature.title}`);
                }}
              >
                Try This Feature →
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="showcase">
        <article>
          <img src="/images/marine-id-preview.png" alt="Marine Life ID app preview" />
          <h3>Marine Life ID</h3>
          <p>Turn a dive photo into a useful identification starting point.</p>
        </article>
        <article>
          <img src="/images/dive-plan-preview.png" alt="Dive Trip Planner app preview" />
          <h3>Trip Planner</h3>
          <p>Explore destination ideas, site context, and practical next steps.</p>
        </article>
        <article>
          <img src="/images/ocean-trips-preview.png" alt="AI Chat app preview" />
          <h3>AI Chat</h3>
          <p>Ask scuba questions when curiosity shows up between dives.</p>
        </article>
      </section>

      <section className="solution">
        <div>
          <h2>Scuba questions do not wait for perfect timing.</h2>
          <div className="problem-grid">
            {problems.map((problem) => (
              <span key={problem}>{problem}</span>
            ))}
          </div>
        </div>
        <div className="solution-box">
          <h2>Scuba Steve brings dive knowledge into your pocket.</h2>
          <p>Open it before a trip, between dives, or after seeing something unforgettable underwater.</p>
        </div>
      </section>

      <section id="about" className="section founder">
        <img src="/images/osea-logo.png" alt="Jay Van der Colff founder placeholder" />
        <div>
          <p className="eyebrow">Founder</p>
          <h2>Created by Jay Van der Colff</h2>
          <p>
            Created by Jay Van der Colff, founder of OSEA Diver, with the goal of making scuba knowledge more accessible to divers worldwide.
          </p>
        </div>
      </section>

      <section id="early-access" className="early-access">
        <div>
          <h2>Join Early Access</h2>
          <p>Get updates, new features, and ocean discoveries.</p>
        </div>
        <form onSubmit={submitEarlyAccess}>
          <label>
            Email
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>
          <label>
            Name
            <input name="name" type="text" placeholder="Optional" />
          </label>
          <label>
            Diver Level
            <select name="diverLevel">
              <option value="">Optional</option>
              <option>Beginner</option>
              <option>Certified Diver</option>
              <option>Advanced Diver</option>
              <option>Divemaster / Instructor</option>
              <option>Dive Centre / Resort</option>
            </select>
          </label>
          <button type="submit" disabled={submitState === "loading"}>
            {submitState === "loading" ? "Joining..." : "Join Early Access"}
          </button>
          {submitState === "success" && (
            <p className="success">You're on the list. Steve will see you underwater soon.</p>
          )}
          {submitState === "error" && <p className="error">{errorMessage}</p>}
        </form>
      </section>

      <section id="faq" className="section light faq">
        <h2>FAQ</h2>
        {faqs.map((faq) => (
          <details key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </section>

      <section className="final-cta">
        <h2>Ready To Dive Smarter?</h2>
        <div className="cta-row center">
          <button className="primary-cta" onClick={() => launchApp("final")}>
            Launch Scuba Steve
          </button>
          <a
            className="secondary-cta"
            href="#early-access"
            onClick={() => trackLandingEvent("join_early_access_click", { source: "final" })}
          >
            Join Early Access
          </a>
        </div>
      </section>
    </div>
  );
}
