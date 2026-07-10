import { useEffect, useReducer, useRef, useState } from "react";
import { trackLandingEvent } from "../analytics";
import { media } from "../media";

/**
 * Hero "Ask-Steve" panel (strategy §9). A question types in, a short thinking
 * beat plays, then a scripted answer streams with one structured artifact.
 *
 * Honesty + accessibility:
 * - Content is illustrative and labelled as such; Marine ID stays a "starting
 *   point". Replace with founder-approved real transcripts in Phase C
 *   (// TODO(phase-c)).
 * - The FULL answer text is always present in the DOM (screen readers read it
 *   immediately); the typing effect only masks it visually. Under
 *   prefers-reduced-motion / no-JS the first Q&A renders complete and static.
 */

type HeroArtifact = { head: string; lines: string[] };
type HeroScript = {
  id: string;
  chip: string;
  question: string;
  answer: string[];
  artifact: HeroArtifact;
};

// TODO(phase-c): replace with founder-approved transcripts exported from the app.
const SCRIPTS: HeroScript[] = [
  {
    id: "trip-planner",
    chip: "Plan my Mozambique trip",
    question: "Plan my 7-day Mozambique dive trip for two divers and one non-diver.",
    answer: [
      "Tofo works well for that mix — big-animal diving plus easy surface options.",
      "Rough shape below. Want operator questions and a packing list next?"
    ],
    artifact: {
      head: "Draft itinerary · 7 days",
      lines: [
        "D1–2 · Arrive + check dives",
        "D3–5 · Two-tank mornings (Manta Reef)",
        "D6 · Ocean safari (non-diver joins)",
        "D7 · No-fly buffer before flying"
      ]
    }
  },
  {
    id: "marine-id",
    chip: "What's this eel? 📷",
    question: "What species is this, and where is it normally found?",
    answer: [
      "Looks like a honeycomb moray — the dark lattice pattern is distinctive.",
      "The open mouth is breathing, not aggression. A starting point — confirm with your local guide."
    ],
    artifact: {
      head: "Likely match",
      lines: [
        "Honeycomb moray",
        "Gymnothorax favagineus",
        "Indo-Pacific reefs · crevice-dweller"
      ]
    }
  },
  {
    id: "refresh",
    chip: "I haven't dived in 8 months",
    question: "I haven't dived in eight months. What should I refresh?",
    answer: [
      "Eight months out is worth a proper refresh before you giant-stride in.",
      "A pool refresher with an instructor is the gold standard — I can build the study side."
    ],
    artifact: {
      head: "Refresh checklist",
      lines: [
        "Buoyancy & weighting",
        "Mask & regulator skills",
        "Gas planning basics",
        "Hand signals + gear setup"
      ]
    }
  }
];

type Phase = "typing-q" | "thinking" | "answering" | "done";
type State = { scriptIndex: number; phase: Phase; qChars: number; aParas: number; runId: number };

type Action =
  | { type: "select"; index: number }
  | { type: "tick-q" }
  | { type: "to-thinking" }
  | { type: "to-answer" }
  | { type: "tick-a" }
  | { type: "done" }
  | { type: "reveal-all" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "select":
      return { scriptIndex: action.index, phase: "typing-q", qChars: 0, aParas: 0, runId: state.runId + 1 };
    case "tick-q":
      return { ...state, qChars: state.qChars + 1 };
    case "to-thinking":
      return { ...state, phase: "thinking" };
    case "to-answer":
      return { ...state, phase: "answering", aParas: 1 };
    case "tick-a":
      return { ...state, aParas: state.aParas + 1 };
    case "done":
      return { ...state, phase: "done" };
    case "reveal-all":
      return { ...state, phase: "done", qChars: 9999, aParas: 99 };
    default:
      return state;
  }
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function HeroDemo() {
  const [state, dispatch] = useReducer(reducer, {
    scriptIndex: 0,
    phase: "done",
    qChars: 9999,
    aParas: 99,
    runId: 0
  });
  const [started, setStarted] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const script = SCRIPTS[state.scriptIndex];

  // Kick off the first animation once, when the hero enters view (motion only).
  useEffect(() => {
    if (started) return;
    if (prefersReducedMotion()) return;
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          dispatch({ type: "select", index: 0 });
          trackLandingEvent("product_demo_started", { demo_id: SCRIPTS[0].id, source_section: "hero" });
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  // Animation driver.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let timer: number;
    if (state.phase === "typing-q") {
      if (state.qChars < script.question.length) {
        timer = window.setTimeout(() => dispatch({ type: "tick-q" }), 24);
      } else {
        timer = window.setTimeout(() => dispatch({ type: "to-thinking" }), 260);
      }
    } else if (state.phase === "thinking") {
      timer = window.setTimeout(() => dispatch({ type: "to-answer" }), 620);
    } else if (state.phase === "answering") {
      if (state.aParas < script.answer.length) {
        timer = window.setTimeout(() => dispatch({ type: "tick-a" }), 520);
      } else {
        timer = window.setTimeout(() => {
          dispatch({ type: "done" });
          trackLandingEvent("product_demo_completed", { demo_id: script.id, source_section: "hero" });
        }, 320);
      }
    }
    return () => window.clearTimeout(timer);
  }, [state.phase, state.qChars, state.aParas, state.runId, script]);

  function selectChip(index: number) {
    if (index === state.scriptIndex && state.phase !== "done") return;
    if (prefersReducedMotion()) {
      dispatch({ type: "select", index });
      dispatch({ type: "reveal-all" });
    } else {
      dispatch({ type: "select", index });
    }
    trackLandingEvent("product_demo_started", { demo_id: SCRIPTS[index].id, source_section: "hero" });
  }

  const qText =
    state.phase === "typing-q" ? script.question.slice(0, state.qChars) : script.question;
  const showThinking = state.phase === "thinking";
  const visibleParas =
    state.phase === "typing-q" || state.phase === "thinking"
      ? 0
      : state.phase === "answering"
        ? state.aParas
        : script.answer.length;
  const answerDone = state.phase === "done";

  return (
    <div className="hero-demo" ref={rootRef}>
      <div className="hero-demo-head">
        <img className="steve-avatar" src={media.product.stevePortrait.src} alt="" aria-hidden="true" width="38" height="38" />
        <div>
          <b>Scuba Steve</b>
          <small>Dive buddy</small>
        </div>
      </div>

      <div className="hero-demo-chips" role="group" aria-label="Example questions">
        {SCRIPTS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`hero-chip ${i === state.scriptIndex ? "is-active" : ""}`}
            aria-pressed={i === state.scriptIndex}
            onClick={() => selectChip(i)}
          >
            {s.chip}
          </button>
        ))}
      </div>

      <div className="hero-demo-thread" aria-live="polite">
        <div className="hero-msg hero-msg-user">
          {qText}
          {state.phase === "typing-q" && <span className="typing-caret" aria-hidden="true" />}
        </div>

        {showThinking ? (
          <div className="hero-msg hero-msg-steve" aria-label="Steve is thinking">
            <span className="thinking" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </div>
        ) : visibleParas > 0 ? (
          <div className="hero-msg hero-msg-steve">
            {script.answer.slice(0, visibleParas).map((line) => (
              <p key={line}>{line}</p>
            ))}
            {answerDone && (
              <div className="hero-artifact">
                <strong>{script.artifact.head}</strong>
                {script.artifact.lines.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>

      <p className="demo-disclaimer">Illustrative example — real answers adapt to you.</p>
    </div>
  );
}
