import { FormEvent, useState } from "react";
import { track } from "@vercel/analytics";
import { media } from "./media";

const APP_URL = "https://www.scubasteve.rocks";

const trustItems = [
  "Built from real scuba instruction experience",
  "Diver-first design for real questions",
  "Safety-aware learning and planning",
  "Mobile-first dive tools"
];

const features = [
  {
    title: "Marine Life ID",
    text: "Upload a photo and identify marine species with useful context for divers."
  },
  {
    title: "AI Dive Questions",
    text: "Ask scuba questions in plain language and get clear learning support before your next dive."
  },
  {
    title: "Dive Trip Planner",
    text: "Get destination ideas, trip checks, and planning prompts before you go."
  },
  {
    title: "Underwater Photo Enhancement",
    text: "Use Scuba Steve's ocean photo tools to make underwater images clearer and easier to review."
  },
  {
    title: "Ocean Articles / Learning",
    text: "Explore practical ocean knowledge, marine life explainers, and scuba learning articles."
  }
];

const paths = [
  {
    title: "For Divers",
    points: ["Identify marine life", "Plan dive trips", "Ask scuba questions"],
    cta: "Try Scuba Steve Free",
    action: "launch"
  },
  {
    title: "For Dive Centres / Resorts",
    points: ["Future AI assistant for customers", "Trip planning support", "Lead generation potential"],
    cta: "Register Business Interest",
    action: "business"
  },
  {
    title: "For Ocean Learners",
    points: ["Learn about marine life", "Read ocean articles", "Explore dive knowledge"],
    cta: "Read Articles",
    action: "articles"
  }
] as const;

const articles = [
  {
    category: "Marine Life ID",
    title: "How AI Can Help Divers Identify Marine Life",
    description:
      "A practical look at how image prompts, habitat clues, and careful verification can help divers learn what they saw underwater."
  },
  {
    category: "Dive Planning",
    title: "What To Check Before Planning A Dive Trip",
    description:
      "From local conditions to operator fit, these are the planning questions that make a dive trip clearer before you book."
  },
  {
    category: "Dive Learning",
    title: "Why Scuba Knowledge Should Be Easier To Access",
    description:
      "Scuba confidence grows when learning is available before and after formal training, not only during a course."
  }
];

const demoActions = [
  {
    title: "Identify a fish from a dive photo",
    text: "Upload a marine life image and get a useful identification starting point with diver-friendly context.",
    image: media.product.marineId
  },
  {
    title: "Ask a scuba question",
    text: "Use Steve for learning support around scuba concepts, trip prep, and practical dive questions.",
    image: media.product.aiChat
  },
  {
    title: "Plan a dive trip",
    text: "Explore destinations, conditions, operator questions, and planning checks before you book.",
    image: media.product.tripPlanner
  },
  {
    title: "Improve an underwater photo",
    text: "Open photo tools that help make underwater images clearer for sharing, review, and learning.",
    image: media.product.photoEnhancement
  }
];

const showcaseItems = [
  {
    title: "Marine Life ID",
    text: "Turn a dive photo into a useful identification starting point.",
    image: media.product.marineId
  },
  {
    title: "Trip Planner",
    text: "Explore destination ideas, site context, and practical next steps.",
    image: media.product.tripPlanner
  },
  {
    title: "AI Chat",
    text: "Ask scuba questions when curiosity shows up between dives.",
    image: media.product.aiChat
  },
  {
    title: "Photo Enhancement",
    text: "Use real underwater samples to preview clearer ocean photo tools.",
    image: media.product.photoEnhancement
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
      "No. Scuba Steve is an educational and planning assistant. It does not replace certified scuba training, professional dive briefings, local operators, emergency services, or personal dive judgement."
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
    question: "Can dive centres use Scuba Steve?",
    answer:
      "Business features are being explored. Dive centres, resorts, liveaboards, instructors, and travel companies can register interest."
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

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function App() {
  const [earlyAccessState, setEarlyAccessState] = useState<SubmitState>("idle");
  const [earlyAccessError, setEarlyAccessError] = useState("");
  const [businessState, setBusinessState] = useState<SubmitState>("idle");
  const [businessError, setBusinessError] = useState("");

  async function submitEarlyAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (earlyAccessState === "loading") return;
    setEarlyAccessState("loading");
    setEarlyAccessError("");

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
      setEarlyAccessState("success");
      trackLandingEvent("early_access_submit_success", {
        source: "landing-page",
        diverLevel: payload.diverLevel || "unspecified"
      });
    } catch {
      setEarlyAccessState("error");
      setEarlyAccessError("We could not add you right now. Please try again in a moment.");
    }
  }

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
        source: "landing-page",
        businessType: payload.businessType || "unspecified"
      });
    } catch {
      setBusinessState("error");
      setBusinessError("We could not register your interest right now. Please try again in a moment.");
    }
  }

  function openEarlyAccess(source: string) {
    trackLandingEvent("early_access_open", { source });
    scrollToId("early-access");
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
        <div className="nav-links" aria-label="Primary navigation">
          <a href="#paths">Paths</a>
          <a href="#articles">Articles</a>
          <a href="#business-interest">Business</a>
          <a href="#faq">FAQ</a>
        </div>
        <button className="nav-button" onClick={() => launchApp("nav")}>
          Try Free
        </button>
      </nav>

      <header id="top" className="hero">
        <div className="hero-media" aria-hidden="true">
          <img src={media.hero.background.src} alt="" fetchPriority="high" />
        </div>
        <div className="hero-content">
          <p className="eyebrow">AI dive buddy for divers and dive businesses</p>
          <h1>Dive Smarter With Scuba Steve AI</h1>
          <p className="subheadline">Identify marine life. Plan dive trips. Ask scuba questions. Improve underwater photos.</p>
          <p className="supporting">
            Launch the free Scuba Steve app for marine life ID, dive trip planning, scuba answers, and underwater photo tools built for divers.
          </p>
          <div className="cta-row hero-actions">
            <button className="primary-cta primary-cta-strong" onClick={() => launchApp("hero")}>
              Try Scuba Steve Free
            </button>
            <button className="secondary-cta" onClick={() => openEarlyAccess("hero")}>
              Join Early Access
            </button>
          </div>
        </div>
        <div className="device" aria-label="Scuba Steve product preview">
          <div className="device-top" />
          <img src={media.product.tripPlanner.src} alt={media.product.tripPlanner.alt} />
          <div className="device-caption">
            <strong>Try the live app</strong>
            <span>Marine ID, dive planning, scuba answers, and underwater photo tools in one pocket-sized assistant.</span>
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

      <section id="paths" className="section light">
        <div className="section-heading">
          <p className="eyebrow dark-eyebrow">Choose Your Dive Path</p>
          <h2>One ocean-tech assistant, three clear routes.</h2>
          <p>Visitors can quickly decide whether to launch the app, register business interest, or explore learning content.</p>
        </div>
        <div className="path-grid">
          {paths.map((path) => (
            <article key={path.title} className="path-card">
              <h3>{path.title}</h3>
              <ul>
                {path.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              {path.action === "launch" && <button onClick={() => launchApp("path-divers")}>Try Scuba Steve Free</button>}
              {path.action === "business" && <button onClick={() => openBusinessInterest("path-business")}>{path.cta}</button>}
              {path.action === "articles" && (
                <button
                  onClick={() => {
                    trackLandingEvent("article_card_click", { source: "path-learners" });
                    scrollToId("articles");
                  }}
                >
                  {path.cta}
                </button>
              )}
            </article>
          ))}
        </div>
      </section>

      <section id="features" className="section white">
        <div className="section-heading">
          <p className="eyebrow dark-eyebrow">Built for action</p>
          <h2>The highest-value tools first.</h2>
          <p>Scuba Steve focuses on the jobs divers reach for most: identifying marine life, asking dive questions, planning trips, improving photos, and learning between dives.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article key={feature.title} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
              <button
                onClick={() => {
                  trackLandingEvent("feature_card_click", { feature: feature.title });
                  if (feature.title === "Ocean Articles / Learning") {
                    scrollToId("articles");
                    return;
                  }
                  launchApp(`feature-${feature.title}`);
                }}
              >
                {feature.title === "Ocean Articles / Learning" ? "Read Articles →" : "Try This Feature →"}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="section light demos">
        <div className="section-heading">
          <p className="eyebrow dark-eyebrow">What you can do with Steve</p>
          <h2>Simple dive tasks, handled in one place.</h2>
          <p>Use Scuba Steve when you want a fast starting point, a clearer plan, or a better way to learn from what you saw underwater.</p>
        </div>
        <div className="demo-grid">
          {demoActions.map((action) => (
            <article key={action.title} className="demo-card">
              <img src={action.image.src} alt={action.image.alt} loading="lazy" decoding="async" />
              <h3>{action.title}</h3>
              <p>{action.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="showcase">
        {showcaseItems.map((item) => (
          <article key={item.title}>
            <img src={item.image.src} alt={item.image.alt} loading="lazy" decoding="async" />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
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

      <section id="articles" className="section light articles">
        <div className="section-heading">
          <p className="eyebrow dark-eyebrow">Ocean Articles & Dive Knowledge</p>
          <h2>Practical scuba and ocean knowledge for curious divers.</h2>
          <p>Short learning previews help divers understand marine life, plan trips more carefully, and keep building scuba confidence between dives.</p>
        </div>
        <div className="article-grid">
          {articles.map((article) => (
            <article key={article.title} className="article-card">
              <p className="article-category">{article.category}</p>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <a
                href="#articles"
                onClick={() => trackLandingEvent("article_card_click", { category: article.category })}
              >
                Read More
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="section founder">
        <img src={media.brand.oseaLogo.src} alt="OSEA Diver founder Jay Van der Colff" />
        <div>
          <p className="eyebrow dark-eyebrow">Founder</p>
          <h2>Created by Jay Van der Colff</h2>
          <p>
            Scuba Steve is created by Jay Van der Colff, founder of OSEA Diver, based on real scuba instruction experience and a practical goal: make useful scuba knowledge easier to access.
          </p>
          <ul className="cred-list">
            <li>Built from real scuba instruction experience</li>
            <li>Designed for divers, not generic travel users</li>
            <li>Focused on practical underwater knowledge</li>
          </ul>
        </div>
      </section>

      <section id="early-access" className="early-access">
        <div>
          <p className="eyebrow dark-eyebrow">Diver updates</p>
          <h2>Join Early Access</h2>
          <p>Get updates, new features, and ocean discoveries.</p>
        </div>
        <form onSubmit={submitEarlyAccess}>
          <label>
            Email
            <input name="email" type="email" placeholder="you@example.com" required disabled={earlyAccessState === "loading"} />
          </label>
          <label>
            Name
            <input name="name" type="text" placeholder="Optional" disabled={earlyAccessState === "loading"} />
          </label>
          <label>
            Diver Level
            <select name="diverLevel" disabled={earlyAccessState === "loading"}>
              <option value="">Optional</option>
              <option>Beginner</option>
              <option>Certified Diver</option>
              <option>Advanced Diver</option>
              <option>Divemaster / Instructor</option>
              <option>Dive Centre / Resort</option>
            </select>
          </label>
          <button type="submit" disabled={earlyAccessState === "loading"}>
            {earlyAccessState === "loading" ? "Joining..." : "Join Early Access"}
          </button>
          {earlyAccessState === "success" && (
            <p className="success">You're on the list. Steve will see you underwater soon.</p>
          )}
          {earlyAccessState === "error" && <p className="error">{earlyAccessError}</p>}
        </form>
      </section>

      <section id="business-interest" className="business-section">
        <div>
          <p className="eyebrow">Dive business interest</p>
          <h2>Partner With Steve</h2>
          <p>
            Register interest in Scuba Steve for dive centres, resorts, liveaboards, instructors, and travel companies.
          </p>
        </div>
        <form onSubmit={submitBusinessInterest}>
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
            {businessState === "loading" ? "Registering..." : "Register Business Interest"}
          </button>
          {businessState === "success" && (
            <p className="success">Thanks. We'll contact you about Scuba Steve for dive businesses.</p>
          )}
          {businessState === "error" && <p className="error">{businessError}</p>}
        </form>
      </section>

      <section className="safety-note">
        <p>
          Scuba Steve is an educational and planning assistant. It does not replace certified scuba training, professional dive briefings, local dive operators, emergency services, or personal dive judgement.
        </p>
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
        <p>Divers can launch now. Businesses can register interest. Learners can start with ocean knowledge.</p>
        <div className="cta-row center">
          <button className="primary-cta primary-cta-strong" onClick={() => launchApp("final")}>
            Try Scuba Steve Free
          </button>
          <button className="secondary-cta" onClick={() => openEarlyAccess("final")}>
            Join Early Access
          </button>
          <button className="business-cta" onClick={() => openBusinessInterest("final")}>
            Partner With Steve
          </button>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand">
          <img src={media.brand.oseaLogo.src} alt={media.brand.oseaLogo.alt} />
          <div>
            <strong>OSEA Diver</strong>
            <span>Scuba Steve AI is created by OSEA Diver for practical scuba learning, dive planning, and ocean discovery.</span>
          </div>
        </div>
        <div className="footer-details" aria-label="OSEA business details">
          <p>
            <strong>Founder:</strong> Jay Van der Colff
          </p>
          <p>
            <strong>Business:</strong> OSEA Diver
          </p>
          <p>
            <strong>Enquiries:</strong> Use the dive business interest form above.
          </p>
          <p>
            <strong>Safety:</strong> Scuba Steve does not replace certified training, professional briefings, local operators, emergency services, or personal dive judgement.
          </p>
        </div>
      </footer>
    </div>
  );
}
