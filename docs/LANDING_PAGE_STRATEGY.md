# Scuba Steve AI — Landing Page Strategy & Implementation Plan

**Prepared:** 2026-07-06
**Role:** Senior product designer / conversion strategist / research lead
**Consumed by:** Opus or Sonnet coding model (see §28 for the handoff prompt structure)
**Scope:** Research, audit, UX strategy, implementation planning. No code was written or changed.

---

## 1. Executive assessment

**The single most important finding of this engagement is not a design finding — it is a repository-state finding.**

There are effectively **three versions** of the Scuba Steve landing page:

| Version | Where | State |
|---|---|---|
| **V1 "SEO page"** | Committed at `3b2e419`, deployed to Vercel | Live today. Single-page, keyword-driven, functional but generic. |
| **V2 "Redesign"** | Uncommitted working tree (`src/pages/`, `src/components/`, `src/router.tsx` are untracked; `src/App.tsx` modified) | Structurally excellent — consumer-first home + `/dive-centres` B2B page — **but its stylesheet was never written.** |
| **V3 "This plan"** | This document | Builds on V2's skeleton, adds the missing design system, upgrades the hero and demos. |

The uncommitted V2 redesign already implements roughly 70% of this brief's information architecture: consumer-first homepage, story-arc sections, a tabbed demo, honest "Steve is / Steve is not" trust columns, a dedicated `/dive-centres` pilot page with application form, and a mature analytics event layer. However, `src/styles.css` in the working tree is still V1's stylesheet (only a 14-line diff from the committed version). The V2 pages reference **~60 CSS classes that do not exist** (`moments-section`, `demo-shell`, `demo-tabs`, `capabilities-*`, `why-*`, `trust-columns`, `b2b-*`, `pilot-*`, `journey-*`, `final-split`, `hero-visual`, `hero-steve-frame`, `hero-chat-chip`, `reveal`, …). If V2 were built and deployed today, it would render as unstyled stacked content. The `Reveal` component's comment even references a `prefers-reduced-motion` block in styles.css **that does not exist**.

**Strategic conclusion:** do not start over, and do not merely "make the current page prettier." Adopt V2's architecture as the skeleton, apply the design system and hero/demo upgrades in this report, write the complete stylesheet, then commit and deploy as one coherent release. This is dramatically cheaper than a rebuild and dramatically better than polishing V1.

**Product positioning conclusion (detail in §5):** Scuba Steve wins as **"your AI dive buddy — before, between and after dives."** Its defensible ground versus general AI is (a) purpose-built dive workflows (trip planner, marine ID, site research, refresh, color fix) rather than one chat box, (b) diving vocabulary and safety-aware framing by default, and (c) a personality divers can bond with. The homepage should be consumer-first with a clearly signposted gateway to the Dive Centre Pilot — the user's hypothesis is **confirmed** by both the research (§3–4) and the existing analytics event design.

---

## 2. Current-site audit

### 2.1 What is actually live (V1, commit `3b2e419`)

Verified by inspecting `git show HEAD:src/App.tsx` and the strings inside `dist/assets/index-CyukZHKX.js` (which match the deployed bundle: `problem-section`, `solution-section`, `founder-section` — none of V2's class names).

Live page structure: Nav → Hero (photo bg + phone-frame screenshot) → Problem grid (4 chips) → Solution cards (4, with photos) → Trust strip (4 checkmarks) → **~5 paragraphs of SEO copy** → FAQ (6 `<details>`) → Founder section → Final CTA → Footer with combined diver/business interest form.

### 2.2 Section-by-section verdicts

| Area | Finding | Verdict |
|---|---|---|
| **First impression** | Dark teal, photo hero, competent but template-adjacent. Nothing signals "this is different." | IMPROVE |
| **5-second comprehension** | Live H1 "Identify marine life, plan better dives, and fix underwater photos" is a feature list, not an identity. It says *what it does* but not *what it is* (an AI dive buddy). Passes a 10-second test, fails the 5-second emotional test. | REPLACE (V2's "Your AI dive buddy" is stronger) |
| **Hero CTA hierarchy** | Live hero has "Open Scuba Steve Free" + "Dive Shop? Request Info" side by side — splits a diver's attention with a B2B decision in the first viewport. | REPLACE (V2 already fixed: consumer CTA + "See what Steve can do") |
| **Supporting copy** | Live subheadline is 30 words, dense. V2's is better but still long. | IMPROVE |
| **Navigation** | Live: brand + one button. V2: brand + "Dive Centres" + "Try Scuba Steve". Right shape. On <420px the nav CTA is `display:none` — the primary conversion action disappears on small phones. | KEEP (V2) / FIX mobile CTA |
| **Visual hierarchy** | Alternating dark/light bands with near-identical card grids; every section looks the same weight. | IMPROVE |
| **Typography** | Inter everywhere, `font-weight: 900` used for headings, body, labels, buttons. No contrast of voice; reads shouty and template-like. | REPLACE (see §12) |
| **Spacing** | Uniform 58px section padding; no rhythm, no breathing room around the hero. | IMPROVE |
| **Imagery** | Real assets exist (Firebase Storage: hero bg, wreck, coral, before/after color fix, Steve portrait) but are served as unoptimized JPG/PNG from Firebase with double extensions (`bg_hero.jpg.jpg`). Hero image is preloaded (good) but heavy. | KEEP assets / IMPROVE delivery |
| **Steve character use** | The "Steve" portrait (`Steve.png`) is used once, ambiguously — `media.ts` labels it "founder portrait" while V2's hero uses it as the character. Character vs founder must be disambiguated (see §14, Risk R6). | IMPROVE |
| **Product screenshots** | Live uses login-preview PNGs in a phone frame; V2 dropped them. Real UI is the strongest honest proof available. | REINSTATE selectively |
| **Feature communication** | Live: 4 solution cards + SEO wall. V2: 4 moments + tabbed demo + 6 capabilities. V2 is right; demo needs to feel like the product, not gray chat bubbles. | IMPROVE (V2 demo → §11) |
| **Trust signals** | Live trust strip ("Created from real scuba instruction experience") is thin. V2's "Steve is / Steve is not" columns are excellent and honest. | KEEP (V2) + extend (§14) |
| **Safety communication** | Strong and consistent in both versions (microcopy, footer disclaimer, FAQ). A genuine differentiator. | KEEP |
| **SEO copy block** | 5 paragraphs of keyword prose mid-page. Serves crawlers, punishes readers. | REMOVE from mid-page; fold intent into section copy + FAQ |
| **FAQ** | Live has 6 FAQs matching the `FAQPage` JSON-LD in `index.html`. **V2 deleted the FAQ section but the JSON-LD remains** → schema describes content that won't exist on the page. | KEEP (restore compact FAQ) — required for schema integrity |
| **Founder section** | Live has it; V2 dropped it. For an early-stage product with no social proof, founder credibility is the trust anchor. | REINSTATE (merged into trust section, §14) |
| **Mobile layout** | Single-column stacking works; issues: nav CTA hidden <420px, `width: calc(100vw - 36px)` patterns fight the grid, hero `min-height: calc(100vh - 65px)` wastes space on tall phones. | IMPROVE |
| **Tablet layout** | 720px breakpoint gives 2-col grids; hero stays single-column until 1024px — acceptable. | KEEP |
| **Desktop layout** | Max-widths inconsistent (820/860/920px); no container system. | IMPROVE |
| **Page speed** | SPA with tiny JS (React + analytics only, no router lib — good). Biggest costs: Firebase-hosted hero JPG, render-blocking font-less design is actually fine. No `font-display` concerns (system/Inter fallback). | IMPROVE images |
| **Animation** | Live: none beyond hover. V2: `Reveal` scroll-fade wrapper — but no CSS exists for it, and no `prefers-reduced-motion` block exists despite the code comment claiming it does. | FIX + extend (§13) |
| **Accessibility** | Good bones: skip link, ARIA tabs in `DemoShowcase`, labeled forms, `role="status"/"alert"`, honeypot properly hidden. Gaps: missing reduced-motion CSS, focus styles rely on browser default for buttons, color-contrast of `#4d6870` body text on `#f0f8fa` is ~4.6:1 (passes AA, barely). | IMPROVE |
| **SEO/metadata** | `index.html` title/meta/OG solid. **Canonical points to `https://www.scubasteve.rocks/`** — the *product* domain, not the landing domain. OG image URLs also point at scubasteve.rocks paths. This is only correct if the landing page is destined to live at that domain root. Must be resolved (§21, Risk R2). | FIX |
| **Analytics** | Mature: `trackLandingEvent` wrapper adds `page_path` + `device_type`; once-per-session section-view events via IntersectionObserver; legacy event names kept alongside new ones. README's event list is stale. | KEEP + extend (§20) |
| **Forms/API** | `/api/business-interest` with honeypot, validation, SHA-256 email dedupe, CORS allowlist, 8KB guard, Firestore `businessInterestLeads`. `/api/early-access` is retained legacy. | KEEP |
| **Routes** | V2 adds `/dive-centres` with a history-API micro-router + correct `vercel.json` SPA rewrite. `src/routes.ts` declares four future SEO routes (unused). | KEEP router; leave future routes dormant |
| **B2B content** | V2's `/dive-centres` covers problem → concept → journey → pilot steps → scope/not-yet → form. Missing vs brief: example customer conversation, shop-owner FAQ, and outreach-email landing ergonomics. | IMPROVE (§17) |
| **Conversion paths** | All "Try Steve" CTAs hard-navigate to `APP_URL` (`VITE_APP_URL`, fallback `scubasteverocks-1b9a9.web.app`). Same-tab navigation loses the landing session mid-scroll — acceptable for a launch CTA; keep same-tab (app *is* the goal). | KEEP |

### 2.3 Audit summary

- **KEEP:** V2 IA, analytics layer, forms/API, safety language, router, `vercel.json`, real media assets, "Steve is / is not" columns.
- **IMPROVE:** hero demonstration, demo richness, typography/spacing system, mobile nav CTA, image delivery, B2B page depth.
- **REMOVE:** mid-page SEO wall (V1), duplicate/ambiguous CTA split in hero (V1), unused `futureSeoRoutes` from nav consideration.
- **REPLACE:** the entire stylesheet (write V3 design system), the V1 hero.
- **MOVE:** FAQ from "SEO appendix" to a compact pre-footer block; founder credibility from standalone section into the trust section.

---

## 3. Competitive research table

Twelve examples studied across the nine required categories (fetched live 2026-07-06):

| # | Site (category) | What it does well | Hero structure | CTA strategy | Product demo method | Steve should learn | Steve should NOT copy |
|---|---|---|---|---|---|---|---|
| 1 | **Linear** (SaaS conversion) | Shows the product *working* — live activity feed, agent collaboration, diffs — not screenshots of stillness | Identity claim ("The product development system…") + product-in-motion | Single primary action; feature announcements as secondary | Simulated-but-true product workflow inline | Demonstrate workflows, not features; restraint in color | Its density/enterprise tone; monochrome minimalism would feel cold for diving |
| 2 | **AllTrails** (outdoor consumer) | Search-as-hero: the first interaction IS the product; aspirational lifestyle photography | "Find your next adventure" + functional search box | Action verbs ("Explore nearby trails") | Feature sections each with phone mockup + QR | Make the hero *do something*; warm, inclusive outdoor tone | Directory-link sprawl; multi-CTA hero |
| 3 | **Merlin Bird ID** (species ID / edtech) | The closest analog to Marine ID. "Identify the birds you see or hear" = instant comprehension; institutional trust (Cornell Lab) without testimonials | Capability promise + "free guide" subhead | Download + "More about Sound ID" (capability deep-links) | Three ID methods each demonstrated step-by-step | Honest trust via *who makes it* and *how it works*; per-capability deep sections | Nothing major — it's the model for honest capability marketing |
| 4 | **Komoot** (adventure planning) | Emotional framing of planning ("Explore beyond the map"); collections of real routes as social proof | Emotional line + free-signup CTA | Free-first | Curated real content (routes) as demo | Real content as proof — real dive sites, real trip shapes | Stats-heavy social proof (50M users) — Steve can't and shouldn't |
| 5 | **Mindtrip** (AI travel) | "Start chatting" — hero CTA drops you into the product; 5-step How-it-Works | Two-word emotional headline ("Travel better.") | Start chatting / app download / video | Chat-first entry + illustrated steps | Let the CTA *be* the product entry; show a plan being built | Press-logo trust wall (unavailable to Steve); vague headline alone |
| 6 | **Fin.ai** (B2B AI agent) | Clear B2B narrative: Train → Test → Deploy → Analyze flywheel; scope clarity | Category claim + benchmark proof | Trial / demo / sales — three lanes | Framework diagram + resolution metrics | The *workflow story* for /dive-centres (Apply → Configure → Review → Go live already mirrors it — keep) | "#1" claims, benchmark chest-beating, guarantees |
| 7 | **PADI** (diving org) | Emotion first: "The ocean is another world you can explore. No experience required, just curiosity!" | Aspirational line + single CTA ("Learn to Scuba Dive") | One primary action per audience tier | Course tiers, travel, conservation | Diving is sold on wonder + accessibility; conservation tone resonates with divers | Mega-nav breadth; membership upsell density |
| 8 | **Shearwater** (dive tech premium) | Credibility through engineering: documentary underwater photography (caves, wrecks, real rigs), spec transparency, no hype | "YOUR DIVE, CRYSTAL CLEAR" — confidence, no urgency | Calm "Learn more" CTAs | Real product in real environments | The *credible-technology* aesthetic: authentic imagery, precision typography, dive-computer visual language | Hardware spec-sheet structure |
| 9 | **Claude.com** (AI assistant) | Clean identity + immediate path to product; FAQ as structural element | Short action headline + auth entry | "Try free" dominant | Tier cards, minimal | Directness; whitespace; FAQ pattern | Abstract illustration system (Steve needs ocean authenticity, not abstraction) |
| 10 | **Flighty** (consumer app, premium) | **Best-in-class honest proof:** hero shows *real live flight data*, not mockups; premium earned via craft + Apple Design Award | "Get the truth when you travel" — visceral benefit | Single download CTA repeated | Live data visualization as hero | Show real Steve output verbatim; craft = trust for early products; named-person credibility (founder) over logos | Award badges Steve doesn't have; testimonial volume |
| 11 | **Aman** (premium tourism) | Desire through restraint: enormous imagery, minimal copy, unhurried pacing, soft CTAs | Single image + short transformation line | Invitational ("Discover more") | None — atmosphere is the product | Pacing and breathing room; "expedition-premium" feel; let underwater imagery carry emotion | Softness of CTAs (Steve needs conversion), sparse information |
| 12 | **Duolingo** (edtech, character brand) | Character as brand moat: Duo carries comprehension, emotion, memorability; bright, minimal above-the-fold | Mascot + simple promise + two CTAs | "Get started" free-first | Character-led illustration; product screens secondary | Steve-the-character can do this work for diving: a *personality* generic AI can't match; character reacts, guides, celebrates | Meme-chaos brand voice (safety-adjacent product needs steadiness); infantilizing the audience |

Sources: [linear.app](https://linear.app/), [alltrails.com](https://www.alltrails.com/), [merlin.allaboutbirds.org](https://merlin.allaboutbirds.org/), [komoot.com](https://www.komoot.com/), [mindtrip.ai](https://mindtrip.ai/), [fin.ai](https://fin.ai/), [padi.com](https://www.padi.com/), [shearwater.com](https://shearwater.com/), [claude.com](https://claude.com/), [flighty.com](https://flighty.com/), [aman.com](https://www.aman.com/), Duolingo via [landingmetrics.com](https://www.landingmetrics.com/landing-page-design-example/duolingo), [design.duolingo.com](https://design.duolingo.com/marketing/assets), [kimp.io](https://www.kimp.io/duolingo-logo/); conversion patterns via [unbounce.com](https://unbounce.com/landing-page-articles/landing-page-best-practices/), [framer.com/blog](https://www.framer.com/blog/landing-page-best-practices/), [perfectafternoon.com](https://www.perfectafternoon.com/2025/hero-section-design/).

---

## 4. Key patterns discovered

1. **The hero should *do* something.** The strongest consumer products (AllTrails, Mindtrip, Flighty, Linear) put a working or truthfully-simulated product interaction in the first viewport. Static feature lists are the weakest pattern observed.
2. **Honest proof beats manufactured proof.** Flighty (real data) and Merlin (institutional method transparency) build more trust than logo walls. For a product with zero testimonials, *showing real output* is the only social proof that matters — and it's sufficient.
3. **One CTA per audience per viewport.** Every high-converting page had exactly one primary action above the fold. Splitting diver/dive-shop attention in the hero (current live site) is the single clearest conversion defect. Single-CTA pages convert measurably better ([unbounce](https://unbounce.com/landing-page-examples/high-converting-landing-pages/)).
4. **B2B lives on its own page, linked, not merged.** Fin.ai, Linear, AllTrails all separate business narratives. **The user's consumer-first / `/dive-centres` hypothesis is confirmed.**
5. **Character is a defensible moat for an assistant.** Duolingo demonstrates that a character with personality creates comprehension speed ("it's the owl app") and emotional retention no generic UI achieves. Steve is the only AI dive buddy with a face.
6. **Diving is sold on wonder, credibility is built with precision.** PADI sells curiosity and another world; Shearwater earns trust with engineering aesthetics. The winning visual voice is the *combination*: emotional ocean imagery + dive-instrument precision detail.
7. **Category examples say "for divers" instantly through vocabulary.** Merlin says "the birds you see or hear." Steve's copy should be full of ragged-tooth seasons, surface intervals, no-fly windows — vocabulary *is* positioning (V2 already does this well — keep).
8. **Mobile is the primary canvas.** ~68% of landing traffic is mobile ([brandedagency](https://www.brandedagency.com/blog/high-converting-landing-pages)); dive-travel users disproportionately so (airport lounges, boats, resorts).

---

## 5. Positioning recommendation

**Category:** The AI dive buddy. (Not "AI scuba app" — apps are downloaded, buddies are trusted.)

**One-line positioning:** *Scuba Steve is your AI dive buddy — for everything before, between and after dives.*

Grounded in real product capability (verified against the ScubaSteveRocks app repo — views actually shipped: Chat, Voice Chat, Identify/Marine ID, Dive Trip Planner, Dive Site Lookup, Surface Interval tools & calculators, Topics/Teaching Library, Color Correction, Logbook, Sighting Map, Scuba News):

- **Strongest consumer value prop:** one focused place for the diver's whole surface cycle — plan the trip, research the site, ID what you saw, fix the photo, refresh before you're back in.
- **Strongest emotional value prop:** the dive-buddy relationship — someone who *speaks diving*, remembers the excitement, never makes you feel like a beginner.
- **Strongest practical value prop:** purpose-built workflows (trip planner, marine ID from photo, site research, refresh plans) instead of prompting a general chatbot from scratch.
- **Strongest differentiator from general AI:** diving context by default + structured dive workflows + safety-aware framing that consistently defers to training, briefings and professionals.
- **Strongest reason to try immediately:** free to start; bring your very next real question ("what was that eel?", "is Aliwal doable for my nervous buddy?") and get a useful answer in one exchange.

**Claims discipline (hard constraints for the coding model):** never claim superiority over general AI, medical authority, instructor replacement, guaranteed ID, or guaranteed safety. All demo content must be labeled illustrative and mirror real product behavior. Marine ID language is always "identification starting point" with confidence framing.

---

## 6. Audience strategy

| Audience | Intent when landing | Served by |
|---|---|---|
| **Recreational divers (primary)** | "What is this? Is it useful for *my* diving?" | Entire homepage; hero within 5 seconds |
| New divers | "Will this help me not feel lost?" | Refresh/course-prep demo, safety framing, plain language |
| Returning divers (dry spell) | "I'm rusty" | "Been dry for months?" moment + Refresh demo |
| Dive travellers | "Help me plan Mozambique" | Trip Planner demo (lead demo) |
| Marine-life enthusiasts | "What did I see?" | Marine ID demo + Color Fix |
| Instructors / dive pros evaluating | "Is this safe to recommend? Does it respect training?" | "Steve is / is not" + founder MSDT credibility + safety microcopy everywhere |
| Dive-centre owners | "Can this help my business?" | Nav link + homepage gateway section + `/dive-centres` |

**Routing decision (confirmed):** homepage is 100% consumer-narrative; business visitors are caught by three signposts only — nav link "Dive Centres", the gateway section (late-page), and the final-CTA split panel. No B2B copy above the fold. Outreach emails link **directly to `/dive-centres`**, never the homepage.

---

## 7. Recommended homepage narrative

The story arc (each beat answers the visitor's next unspoken question):

1. **Hero** — "What is this?" → *Your AI dive buddy* + watch it answer a real question.
2. **Moments** — "Is this for me?" → *Most of diving happens on land* — the four moments you already live.
3. **Steve in action** — "Prove it." → Four deep, structured demos (Trip / ID / Sites / Refresh).
4. **Color Fix interlude** — "Whoa." → visceral before/after slider, the most instantly-legible feature.
5. **Capabilities** — "What else?" → six-tool overview, one line each.
6. **Why diving-specific** — "Why not ChatGPT?" → vocabulary, workflows, safety-aware by design.
7. **Trust & founder** — "Can I trust it?" → dive buddy not dive professional; built by an MSDT.
8. **Dive Centre gateway** — (for the business minority) → "What if Steve knew your dive centre?"
9. **FAQ (compact)** — objection handling + schema integrity.
10. **Final CTA** — split diver/business panels.
11. **Footer** — updates signup, safety disclaimer, contact.

Changes vs V2 working tree: adds #4 (Color Fix slider), #9 (FAQ restored), founder folded into #7; hero upgraded per §9; demos upgraded per §11. Order otherwise preserved — V2's arc is sound.

---

## 8. Five hero concepts

Scored 1–5 (5 best). Implementation complexity: L/M/H.

| Concept | Clarity | Emotion | Differentiation | Credibility | Mobile | Complexity | Conversion potential |
|---|---|---|---|---|---|---|---|
| **A. "Your AI dive buddy" — Steve portrait + static chat chip** (V2 as-built) | 5 | 3 | 3 | 4 | 5 | L | 3 — clear but inert; nothing to do but click |
| **B. Ask-Steve interactive demo hero** — question chips animate a real scripted answer in a chat frame | 5 | 4 | 5 | 5 | 4 | M | **5** — the product proves itself in viewport one |
| **C. "Before, between and after dives" cycle triptych** — three-panel dive-cycle visual | 4 | 3 | 4 | 4 | 3 (panels stack weakly) | M | 3 |
| **D. Destination→plan transformation** — type "Mozambique", watch an itinerary assemble | 4 | 5 | 5 | 4 | 3 (heavy for small screens) | H | 4 — spectacular but single-feature; risks "trip planner app" misread |
| **E. Depth-descent cinematic** — scroll-driven surface-light→abyss intro before content | 3 | 5 | 4 | 3 | 2 | H | 2 — beautiful, but delays comprehension; hostile to reduced-motion and LCP |

---

## 9. Chosen hero direction

**Concept B, carrying A's headline. ("A+B hybrid.")**

- **Headline:** `Your AI dive buddy.` (keep — it's the fastest identity transfer in any concept)
- **Accent line:** `Before, between and after dives.` (keeps C's best idea as the subordinate line — V2 already has this exact structure; keep it)
- **Subheadline (tightened to 19 words):** `Plan trips, identify marine life, research dive sites and refresh your skills — with an assistant built only for diving.`
- **Primary CTA:** `Try Scuba Steve` → `APP_URL` (event: `hero_try_steve_clicked` — already wired)
- **Secondary CTA:** `See Steve in action` → smooth-scroll to `#demo` (event: `hero_capabilities_clicked` — already wired; relabel)
- **Microcopy:** `Free to start. A planning and learning buddy — never a replacement for training or local briefings.`

**Hero visual — the Ask-Steve panel** (replaces V2's static `hero-chat-chip`):
- A chat-style card ("hero demo") with 3 question chips: `Plan my Mozambique trip` · `What's this eel? 📷` · `I haven't dived in 8 months`.
- On load (and on chip tap), the selected question types into the card, a subtle "Steve is thinking" beat plays (~600ms), then a 2–3 line scripted answer streams in with a small structured artifact (e.g., a 3-day itinerary strip or an ID card chip).
- Label under the card: `Illustrative example — real answers adapt to you.`
- Steve's character portrait anchors the card (small, top-left avatar position), not a full-height portrait — the *conversation* is the hero, Steve is present in it.
- **Reduced motion / no JS:** the first Q&A renders fully static, no typing animation. **Mobile:** card sits below headline+CTA (comprehension and conversion first), chips scroll horizontally.
- Analytics: chip taps fire `product_demo_started {demo_id, source_section:"hero"}`; completion of stream fires `product_demo_completed`.

**5-second test:** headline delivers identity (1s), accent line delivers scope (2s), the demo card visually confirms "it's a chat assistant about diving" (instant, pre-reading). Passes.

**Background:** keep the existing diver-with-torch hero image (already preloaded), darkened 55–65% with the surface-light gradient (§12), so text contrast is guaranteed.

---

## 10. Section-by-section homepage specification

Format per section: objective / headline / copy direction / composition / interaction & motion / CTA / mobile / assets / complexity / rationale.

### S1 — Hero
As §9. Desktop: 2-col grid (content 1.05fr / demo card 0.95fr), min-height ~88vh. Mobile: stacked, no forced viewport height. Assets: existing `bg_hero` (re-encoded AVIF/WebP, see §23), Steve avatar crop. **Complexity: M.** Rationale: comprehension + demonstration + single CTA in viewport one.

### S2 — Moments ("Most of diving happens on land.")
- **Objective:** self-recognition; "this is for me."
- **Headline:** keep V2's `Most of diving happens on land.` — the best line on the site. Lede: keep.
- **Copy:** keep the four V2 moments verbatim (Booked a trip? / Saw something amazing? / Heading to a new site? / Been dry for months?).
- **Composition:** four cards in a 4-col row (desktop) / 2×2 (tablet) / vertical stack with left icon rail (mobile). Each card gets a small line-art dive icon (ticket, fish, map contour, calendar) — line-art only, no emoji.
- **Interaction:** cards are links that scroll to the matching demo tab and pre-select it (fires `feature_selected {feature:"trip-planner"…}`).
- **Motion:** Reveal stagger (80ms).
- **CTA:** none (cards are the affordance). **Complexity: L.**
- **Rationale:** converts feature-shopping into moment-recognition; wires curiosity directly into the demo.

### S3 — Steve in action (demo suite)
See §11 (full specification). **Complexity: M–H.** The conversion heart of the page.

### S4 — Color Fix interlude
- **Objective:** one visceral, zero-reading proof moment.
- **Headline:** `Bring the reds back.` Sub: `One tap of underwater colour correction — this is a real photo, before and after.`
- **Composition:** full-bleed-ish before/after **drag slider** (real asset pair: `PA310001.JPG` original + corrected `color correct.jpg` — verify the pair matches; if not, export a true pair from the app's ColorCorrectionView).
- **Interaction:** pointer/touch drag + keyboard (arrow keys move divider; slider is a `role="slider"` with `aria-valuenow`). First drag fires `product_demo_started {demo_id:"color-fix"}`.
- **Mobile:** slider works by touch; initial divider at 35% so "after" dominates.
- **CTA:** text link `Fix one of yours → Try Scuba Steve` (fires `open_scuba_steve_clicked {source_section:"color_fix"}`).
- **Complexity: M.** Rationale: photos are the most shareable, most instantly-understood capability; a real before/after is irrefutable honest proof.

### S5 — Core capabilities
- **Objective:** completeness scan for the systematic visitor.
- **Headline:** keep `One assistant. The whole dive cycle.`
- **Copy:** keep V2's six entries (Chat, Trip Planner, Marine ID, Dive Site Research, Photo Color Fix, Knowledge Refresh) — verified real in the app repo.
- **Composition:** compact 3×2 grid (desktop) / 2×3 (tablet) / single column (mobile). Not cards — borderless rows with a hairline bathymetric divider (§12), icon + name + one line. Deliberately quieter than S3/S4.
- **Complexity: L.** Rationale: after demonstration, enumeration; keeping it visually quiet avoids the "endless rounded cards" template smell.

### S6 — Why diving-specific
- **Objective:** answer "why not just ChatGPT?" without attacking general AI.
- **Headline:** keep `Generic AI knows a bit about everything. Steve knows diving.`
- **Copy:** keep V2's three points (Speaks diving / Structured dive workflows / Safety-aware by design).
- **Composition:** dark section over the coral-garden background (existing asset), three columns → stacked on mobile.
- **Complexity: L.**

### S7 — Trust & founder ("A dive buddy, not a dive professional.")
- **Objective:** convert honesty into trust; give the skeptical instructor a reason to nod.
- **Composition:** V2's two-column "Steve is / Steve is not" lists (keep verbatim), **plus a founder strip beneath**: small authentic photo of Jay, one paragraph: `Built by Jay Van der Colff — Master Scuba Diver Trainer and founder of OSEA Diver. Steve exists because the questions divers ask don't stop when the dive ends.` Plus an invitation line: `Don't take our word for it — ask Steve something hard from your own diving.` (link → app, `source_section:"trust"`).
- **Verify before shipping:** MSDT title with Jay; use a real founder photo, NOT `Steve.png` if that image is the character (see Risk R6).
- **Complexity: L.**

### S8 — Dive Centre gateway
- Keep V2 section as written (`What if Steve knew your dive centre?` + pilot paragraph + CTA `Explore the Dive Centre Pilot`). Visual: amber/warm accent to mark the audience switch. Event already wired (`dive_centre_pilot_clicked`, plus section-view event). **Complexity: L.**

### S9 — FAQ (compact)
- Restore 5–6 `<details>` items matching `index.html`'s FAQPage JSON-LD **exactly** (update both together; drop the photo-enhancement Q if messaging shifts, and update the schema in the same commit). Quiet styling. **Complexity: L.** Rationale: objection handling + schema integrity + long-tail SEO.

### S10 — Final CTA
- Keep V2's split panel (Divers / Dive centres) and headline `Your next dive starts with a question.` Add one line of reassurance under the diver button: `Free to start. No card.` **Complexity: L.**

### Footer
- Keep V2 footer (brand, diver-updates form, safety disclaimer, links). Change `business_form_*` event names on the diver signup to `diver_updates_*` (keep legacy dual-fire as PilotForm does). **Complexity: L.**

---

## 11. Product demonstration specification

**Method decision:** interactive tabs + scripted streaming, rendered as **real product-shaped output** (structured artifacts, not just chat bubbles). Not video (heavy, unmaintainable), not scroll-hijacked storytelling (mobile-hostile), not raw UI captures alone (static). Every demo is explicitly labeled: `Illustrative example — based on real Scuba Steve answers. Real answers adapt to you and stay safety-aware.` This satisfies the "simulated but accurate" requirement and the no-fake-chat constraint: content must be generated by actually asking the production app these four questions and editing for length, never inventing capability.

Keep V2's `DemoShowcase` tabs component (ARIA is already correct) and upgrade each panel:

1. **Trip Planner** — Q: *"Plan a 7-day Mozambique dive trip for two divers and one non-diver."* → thinking beat → answer streams; then a structured **itinerary strip** renders below the text: D1–2 arrive/check dives · D3–5 two-tank mornings (Manta Reef, Giant's Castle) · D6 ocean safari (non-diver joins) · D7 no-fly buffer. Chips for "operator questions" and "packing list" shown as *next-step affordances* (non-functional, visually consistent with app).
2. **Marine ID** — photo thumbnail attaches (use a real honeycomb moray frame from existing marine media) → analysis shimmer over the photo → **ID card artifact**: species name + Latin name, "Likely match" confidence framing, habitat/behaviour lines, and the mandatory line *"A starting point — confirm with your local guide."*
3. **Dive Sites** — Q: *"What should I know before diving Aliwal Shoal?"* → answer + **site brief card**: depth range 12–30m, boat entry, surge/current notes, seasonal highlight (ragged-tooth in cooler months), "book with a local operator" line.
4. **Refresh** — Q: *"I haven't dived for eight months. What should I refresh?"* → answer + **checklist artifact**: buoyancy & weighting / mask & reg skills / gas planning basics / signals / own gear setup, plus "pool refresher with an instructor is the gold standard."

**Interaction & analytics:** tab switch fires existing `feature_demo_interacted` **plus** new `feature_selected`; stream start `product_demo_started {demo_id}`; stream end `product_demo_completed {demo_id}`. A "replay" affordance re-runs the animation. Auto-run the visible tab once when the section first enters the viewport (respecting reduced motion).

**Reduced motion / no-JS:** full static render of Q + answer + artifact, no typing, no shimmer.

**Assets required:** 1 moray photo, 3 small artifact illustrations/none (artifacts are pure HTML/CSS), verified copy for 4 Q&As exported from the real app.

---

## 12. Visual design system

**Feel target:** premium dive expedition × intelligent assistant × credible technology (Shearwater precision + PADI wonder + Flighty craft). **Banned:** neon AI gradients, heavy glassmorphism, floating particles everywhere, stock-diver clichés, corporate SaaS blue, wall-to-wall rounded cards.

### Depth progression (the page's signature)
The page descends. Section backgrounds step through a depth scale top-to-bottom:

| Token | Hex | Used by |
|---|---|---|
| `--surface-0` (sunlit) | `#EAF7F9` | Moments, Capabilities (light bands) |
| `--depth-10` | `#0E4A5A` | Hero base, Why-section overlay |
| `--depth-20` | `#093947` | Demo section |
| `--depth-30` | `#06252F` | Trust, gateway (current brand base — keep) |
| `--depth-40` (abyss) | `#02121A` | Final CTA, footer |
| `--accent-air` | `#9EE8F1` | Primary CTA, links, eyebrows on dark (keep — it's brand equity) |
| `--accent-signal` | `#FFB37A` | B2B/dive-centre accent only (warm "surface marker buoy" orange) |
| `--ink` / `--ink-soft` | `#0B2B34` / `#48656E` | Text on light bands |
| `--line` | `rgba(158,232,241,0.16)` dark / `#D8E7EA` light | Hairlines, bathymetric strokes |

Light bands get faint **bathymetric contour lines** (single inline SVG pattern, ≤2KB, 3–4% opacity) instead of card borders — the topographic texture reads "dive chart," not "template."

### Typography
- **Display:** `Bricolage Grotesque` (Google Fonts, variable) for h1/h2 — characterful, contemporary, not-template. Weights 600–800 only (kill the universal `font-weight:900`).
- **Body/UI:** keep `Inter` (400/500/650).
- **Instrument:** `IBM Plex Mono` for dive-computer micro-details — eyebrows become instrument labels: `// BEFORE THE DIVE`, artifact metadata (`DEPTH 12–30 M · BOAT ENTRY`), demo timestamps. Tabular numerals. This is the "dive-computer-inspired micro detail" carrier.
- Self-host via `@font-face` + `font-display: swap`; subset latin. **CSP note:** self-hosting avoids adding `fonts.googleapis.com`/`gstatic` to `vercel.json` CSP; if CDN-loaded instead, CSP `style-src`/`font-src` must be extended.
- Scale: h1 `clamp(2.6rem, 6vw, 4.6rem)` (down from 5.8rem — current is oversized on desktop), h2 `clamp(1.9rem, 3.2vw, 2.6rem)`, body 1.0625rem/1.65.

### Components
- Buttons: keep pill shape (brand continuity), min-height 48px, `--accent-air` primary with `#05242E` text (contrast 12+:1); visible `:focus-visible` ring (2px `--accent-air` offset 3px) on **all** interactive elements.
- Cards: 12px radius, hairline border, **no** drop-shadow soup; elevation via background step, not shadow.
- Demo window: dark instrument panel — mono header strip `SCUBA STEVE · DIVE BUDDY`, subtle scan-light on stream (motion-gated).
- Imagery treatment: authentic underwater photos get a consistent duotone-ish deep-teal grade (CSS `filter` or pre-graded exports) so mixed-quality sources cohere.

---

## 13. Motion strategy

Principles: motion demonstrates or orients, never decorates; everything ≤400ms except demo streaming; **all motion behind `@media (prefers-reduced-motion: no-preference)`** — the stylesheet must finally include the reduced-motion block `Reveal.tsx` claims exists.

| Motion | Where | Implementation |
|---|---|---|
| Scroll reveal (fade + 12px rise, 80ms stagger) | All sections | existing `Reveal` + new CSS (`.reveal { opacity:0; translate:0 12px } .reveal.is-visible { … }`) |
| Typing/stream + thinking beat | Hero demo, S3 demos | JS interval revealing text nodes; CSS caret |
| Before/after divider spring | S4 slider | CSS transition on drag release |
| Bubble drift (6–8 tiny bubbles, hero only) | Hero | one CSS keyframe layer, `opacity ≤ .35`, removed under reduced motion — the *only* particulate on the page |
| Tab crossfade | Demo tabs | 160ms opacity |
| CTA hover lift | Buttons | keep existing 160ms transform |

No scroll-jacking, no parallax on mobile, no autoplaying video. Performance budget: no layout-thrashing animations (opacity/transform only).

---

## 14. Trust strategy

No testimonials, counts, logos, ratings, awards, or adoption stats exist — **none will be fabricated**. Trust ladder, in page order:

1. **Real output as proof** (hero demo + S3 + S4 real before/after) — the Flighty principle.
2. **Vocabulary fluency** — copy that only a diver would write.
3. **Transparent boundaries** — "Steve is / Steve is not," safety microcopy at hero, trust section, footer.
4. **Founder credibility** — Jay Van der Colff, MSDT, founder of OSEA Diver; real photo, one honest paragraph (verify title/photo before shipping — Risk R6).
5. **Challenge invitation** — "Ask Steve something hard from your own diving" (confidence signal + activation driver).
6. **Truthful beta/pilot language** — the dive-centre pilot is explicitly a pilot, "reviewed personally," scope vs not-yet split (V2 already exemplary — keep).
7. **Method transparency in FAQ** — what Steve is designed for, what it defers to humans on.

---

## 15. Mobile strategy

- Order per section: headline → CTA → demo/visual (comprehension before payload).
- Fix: nav "Try Scuba Steve" must **not** disappear <420px — shrink to `Try Steve` instead (removes the current `display:none` rule).
- Hero: no forced 100vh; demo card below CTAs; chips horizontally scrollable with edge-fade affordance.
- Demos: tabs become a horizontal scroll-snap chip row; artifacts stack; text ≥16px to avoid iOS zoom-on-focus.
- Touch targets ≥44×44px everywhere (current 48px min-height is good — keep).
- Sticky mini-CTA: after scrolling past S3, a slim bottom bar (`Try Scuba Steve`) appears on mobile only; dismissible; fires `open_scuba_steve_clicked {source_section:"sticky"}`. (Single addition of persistent conversion surface; test carefully — see QA.)
- Images: `srcset` with 640/1080/1600 widths; hero LCP target <2.5s on 4G.
- Forms: correct `autocomplete`/`inputmode`; pilot form fields full-width single column.

## 16. Desktop strategy

- 1200px max content container, consistent across sections (fixes the 820/860/920 drift).
- Hero 2-col; demo section 1-col centered (demo window max 880px — a focused stage, not full-bleed).
- Bathymetric texture and depth stepping are most visible on desktop; light/dark band rhythm gives scroll pacing.
- Hover states carry more information on desktop (moment cards show "See it in action →" on hover).

---

## 17. Dive Centre page specification (`/dive-centres`)

V2's page is structurally strong. Keep: hero concept & headline (*"Your dive centre already has the answers. Steve helps customers find them."* — this was the brief's alternative positioning and it's the better line; the teaser on the homepage keeps *"What if Steve knew your dive centre?"* so both concepts are used where each is strongest), problem section, what-is section, journey, pilot steps, scope vs not-yet, form.

**Additions required:**

1. **Example customer conversation widget** (after "What is Dive Shop Steve?"): a static-but-styled chat exchange — Customer: *"I'm certified but haven't dived in two years — can I join Saturday's boat?"* → Shop Steve: answer drawing on *fictional-but-labeled* shop config (refresher policy, price, Saturday schedule) → ends with handoff chip `Continue on WhatsApp with [Shop]`. Label: `Example with sample shop information — your Steve answers only from what you approve.` **Complexity: M.**
2. **Shop-owner FAQ** (before the form; 5 items): Where does Steve get answers? (only your approved info + diving context) / What if it doesn't know? (says so + hands off) / Effort to set up? (you provide the info; we configure) / Cost? (pilot terms discussed personally — honest, since unpriced) / Can we review before launch? (yes, that's step 3). `<details>` styling shared with homepage FAQ. **Complexity: L.**
3. **Outreach-email ergonomics:** anchors `#how-it-works`, `#example`, `#scope`, `#apply` (email deep-links); page must read standalone (no dependence on homepage context); meta description written for email-preview snippeting (App.tsx ROUTE_META already exists — refine copy); add a small "reply instead" line near the form: `Prefer email? Reply directly to the message that sent you here, or write to scubasteverocksai@gmail.com.`
4. **Visual:** same design system, `--accent-signal` (warm SMB orange) as the accent; wreck-background hero kept but graded to match §12.
5. **Analytics:** add `dive_centre_page_viewed` on mount (currently only the reused `dive_centre_section_viewed` fires — keep both), `pilot_example_viewed` when the conversation widget enters viewport.

---

## 18. Consumer conversion funnel

```
Impression (social/search/word-of-mouth)
  → Landing (page_view via Vercel Analytics)
  → 5s comprehension (hero)               [drop-off measure: bounce w/o scroll]
  → Curiosity (moments)                    reached_problem_section
  → Proof (hero demo / S3 / S4)            product_demo_started / _completed / feature_selected
  → Intent                                 hero_try_steve_clicked | open_scuba_steve_clicked (nav/colorfix/trust/sticky/final)
  → App handoff (APP_URL, same tab)
  → Activation (measured inside the app — out of landing scope; recommend a
    `?utm_source=landing&utm_content=<source_section>` param on APP_URL so the
    product's analytics can attribute activation)
```

The UTM param is the one missing link today: `launchApp()` navigates bare. Append `utm_source=landing_page&utm_medium=web&utm_content=<source_section>` (product app must tolerate/ignore unknown params — verify).

## 19. B2B conversion funnel

```
Outreach email (personal, founder-sent)
  → /dive-centres#example (deep link)      dive_centre_page_viewed
  → Understand value (problem + example)   pilot_example_viewed
  → Inspect scope (honest pilot split)     reached via scroll events
  → Apply                                  dive_centre_form_started → dive_centre_form_submitted
  → Firestore lead (businessInterestLeads) → personal founder reply (manual, stated on page)
```

Secondary entry: homepage teaser (`dive_centre_pilot_clicked {source_section:"home_teaser"|"nav"|"final"}`) — already wired.

---

## 20. Analytics plan

Existing instrumentation is genuinely good; extend, don't replace. Mapping to the brief's minimum set:

| Brief event | Status | Action |
|---|---|---|
| `hero_try_steve_clicked` | ✅ exists | keep |
| `product_demo_started` | ❌ | **add** (hero chip tap, S3 auto/tap, S4 first drag) `{demo_id, source_section}` |
| `product_demo_completed` | ❌ | **add** (stream finished) `{demo_id}` |
| `feature_selected` | partial (`feature_demo_interacted`) | **add** `feature_selected`, dual-fire legacy name |
| `dive_centre_gateway_clicked` | exists as `dive_centre_pilot_clicked` | keep name (history preserved) |
| `dive_centre_page_viewed` | partial (`dive_centre_section_viewed` reused) | **add** distinct page event |
| `pilot_form_started` / `_submitted` | ✅ as `dive_centre_form_started/_submitted` | keep |
| `final_cta_clicked` | ✅ exists | keep |

Also add: `pilot_example_viewed`, `sticky_cta_clicked` (or reuse `open_scuba_steve_clicked {source_section:"sticky"}` — prefer reuse), rename footer diver signup events to `diver_updates_started/submitted/success` with legacy dual-fire. Keep the once-per-session section-view events — they answer "where do users leave." **Answering the five questions:** drop-off = section-view funnel; feature interest = `feature_selected` + demo completions; click-through = `open_scuba_steve_clicked` by `source_section`; pilot start/complete = `dive_centre_form_started` vs `_submitted`. Vercel Analytics custom events require a paid plan — **verify events appear in the dashboard post-deploy** (they're coded today, but confirm they're actually being recorded; if not, this whole measurement plan silently fails — Risk R5).

---

## 21. SEO plan

1. **Canonical decision (blocking):** `index.html` canonical + OG URLs point to `https://www.scubasteve.rocks/` while the landing deploys at `scuba-steve-landing-page.vercel.app`. Either (a) the landing page becomes the site at `www.scubasteve.rocks` root (then keep canonicals, coordinate with the product app's routing), or (b) it stays on its own domain (then canonical/OG must point to that domain). Currently the Vercel URL is telling Google "index the other site instead" — deliberate cross-domain canonical, acceptable only if (a) is imminent. **Ask the founder; default assumption: (a).**
2. Title/H1 alignment: keep keyword-bearing `<title>` (marine life ID / dive trip planner / AI scuba) but ensure H1 stays identity-led; App.tsx runtime title swap per route already works.
3. FAQPage JSON-LD must mirror the visible FAQ (S9) — update both in one commit.
4. Keep Organization + SoftwareApplication schema; do **not** add AggregateRating/Review (no data — would violate honesty and Google guidelines).
5. `/dive-centres` needs its own meta (exists) + og:image (create a B2B variant OG card) + inclusion in a new `sitemap.xml` + `robots.txt` (neither exists — add both, trivial).
6. `futureSeoRoutes` (marine-life-identification, dive-trip-planner, etc.) stay dormant — good future long-tail plays, out of scope now.
7. Image `alt`s: already good; keep discipline.
8. Prerender consideration: the SPA serves empty HTML to non-JS crawlers for body content (WebFetch confirmed only meta is visible). Google renders JS, but for resilience add `vite-plugin-prerender`-style static snapshot of `/` and `/dive-centres` **only if cheap** (the product repo already has a `scripts/prerender.mjs` pattern to copy). Priority: medium.

## 22. Accessibility requirements

- WCAG 2.2 AA contrast on all text (check `--ink-soft` on light bands ≥4.5:1; `#9EE8F1` only for large text/CTAs on dark).
- `prefers-reduced-motion`: global block disabling reveal/typing/bubbles/slider spring — **must actually exist this time**; demos render complete static state.
- Demo tabs: keep existing ARIA tab pattern + add arrow-key navigation (currently click-only).
- Before/after slider: `role="slider"`, keyboard operable, `aria-label="Compare photo before and after colour correction"`.
- `:focus-visible` rings on every interactive element; skip-link kept; heading order strictly h1→h2→h3 per page; typing animation content present in DOM for screen readers before animation (animate visually via masking, or use `aria-live="polite"` completed text).
- Forms: labels (exist), `aria-describedby` for error text, error summary focus on failed submit.
- Hero background `alt=""` + `aria-hidden` (exists — keep).

## 23. Performance requirements

- LCP <2.5s (4G mid-tier Android): hero image re-encoded (AVIF+WebP fallback, ≤180KB @1600w, `srcset`), keep `fetchpriority=high` preload, self-host instead of Firebase Storage URL (removes DNS+TLS to googleapis and the CSP img-src dependency).
- CLS <0.05: explicit `aspect-ratio`/dimensions on all images, demo window fixed min-height so streaming never shifts layout.
- JS budget: no new deps except zero-dep code; typing animation and slider are hand-rolled (~2–3KB). **No animation library.**
- Fonts: 2 families + mono subset, woff2, `font-display: swap`, preload display font.
- All below-fold images `loading="lazy"` (exists — keep).
- Lighthouse targets: Perf ≥90 mobile, A11y ≥95, SEO ≥95.

---

## 24. Exact implementation phases

### Phase A — Foundations & repo hygiene
- **Objective:** make the working tree coherent: commit V2 skeleton behind a complete design-system stylesheet; nothing user-visible ships yet (work on a branch).
- **Files:** new branch `redesign/v3`; commit untracked `src/pages/`, `src/components/`, `src/router.tsx`, modified `App.tsx`; **rewrite `src/styles.css`** (tokens §12, layout container, buttons, forms, nav, footer, reveal + reduced-motion block, all V2 section classes); add fonts under `public/fonts/`; fix nav mobile CTA; add `robots.txt`, `sitemap.xml`.
- **Dependencies:** none. **Risk:** low. **Verification:** `npm run typecheck && npm run build`; every class referenced in TSX exists in CSS (grep audit); manual viewport pass 360/768/1280; reduced-motion emulation. **Rollback:** branch deletion; `Main` untouched.

### Phase B — Hero & product proof
- **Objective:** ship §9 hero (Ask-Steve panel) + §S2 moment-card→demo wiring.
- **Files:** new `src/components/HeroDemo.tsx`; edit `HomePage.tsx` (hero JSX, moments links), `styles.css`, `media.ts` (avatar crop, optimized hero image), `index.html` (preload new hero asset path).
- **Dependencies:** A. **Risk:** medium (animation correctness, reduced-motion, LCP). **Verification:** demo plays/replays; static under reduced-motion & JS-off (content server-rendered in markup); Lighthouse mobile ≥90; events fire (`product_demo_started/_completed` visible in network `va` calls). **Rollback:** revert hero commit; V2 static hero remains functional.

### Phase C — Demo suite & Color Fix
- **Objective:** §11 upgraded `DemoShowcase` (structured artifacts, streaming, auto-run-on-view) + §S4 slider; restore FAQ (S9) synced with JSON-LD; trust/founder strip (S7).
- **Files:** edit `DemoShowcase.tsx`; new `src/components/BeforeAfterSlider.tsx`, `src/components/Faq.tsx`; edit `HomePage.tsx`, `styles.css`, `index.html` (JSON-LD sync), `media.ts` (before/after pair, moray photo).
- **Dependencies:** A (B independent). **Risk:** medium. **Content gate:** the four Q&As must be generated from the real app and reviewed by the founder before merge. **Verification:** keyboard-operate tabs & slider; artifact layout at 360px; schema validator (Google Rich Results test) passes. **Rollback:** each component reverts independently.

### Phase D — Dive Centre page enhancements
- **Objective:** §17 — example conversation, shop-owner FAQ, anchors, meta/OG, `--accent-signal` styling.
- **Files:** edit `DiveCentresPage.tsx`, `App.tsx` (ROUTE_META copy), `styles.css`; new `src/components/ShopConversation.tsx`; new B2B OG image asset.
- **Dependencies:** A. **Risk:** low. **Verification:** deep-link anchors from a cold email client; form submit → Firestore doc appears in `businessInterestLeads`; mobile pass. **Rollback:** independent revert.

### Phase E — Analytics & funnel completion
- **Objective:** §20 new events, UTM params on `APP_URL` navigation, sticky mobile CTA, footer event rename (dual-fire).
- **Files:** edit `analytics.ts` (optional helper), `HomePage.tsx`, `Nav.tsx`, `Footer.tsx`, `DemoShowcase.tsx`, `HeroDemo.tsx`, `config.ts` (URL builder).
- **Dependencies:** B, C. **Risk:** low code / medium measurement (verify Vercel plan records custom events). **Verification:** every event visible in Vercel Analytics within 24h of preview deploy; UTM arrives at app (check product logs). **Rollback:** events are additive; revert freely.

### Phase F — Accessibility & performance polish
- **Objective:** §22–23 to targets.
- **Files:** `styles.css`, image assets, `index.html`.
- **Verification:** Lighthouse (mobile+desktop) both pages ≥90/95/95; axe DevTools zero critical; manual screen-reader pass (NVDA) on hero demo + tabs + forms; 3G throttle test. **Risk:** low. **Rollback:** n/a (polish).

### Phase G — Final QA, canonical decision & launch
- **Objective:** cross-browser QA (§27 checklist), resolve §21 canonical/domain decision with founder, deploy.
- **Steps:** Vercel preview deploy → full checklist → founder review → merge to `Main` → production deploy → post-deploy smoke (forms → Firestore, events, OG cards via social debuggers).
- **Risk:** medium (domain decision is external). **Rollback:** Vercel instant rollback to previous deployment.

---

## 25. File-level implementation map

**Preserve untouched:** `api/business-interest.js`, `api/early-access.js`, `api/_lib/*`, `src/analytics.ts` (extend-only), `src/router.tsx`, `src/routes.ts`, `vite.config.ts`, `tsconfig.json`, `package.json` (no new deps expected), `.env.example`.

**Modify:** `src/styles.css` (full rewrite — the core deliverable), `src/pages/HomePage.tsx` (hero, moments links, S4/S7/S9 insertion), `src/pages/DiveCentresPage.tsx` (§17), `src/components/DemoShowcase.tsx` (§11), `src/components/Nav.tsx` (mobile CTA, UTM), `src/components/Footer.tsx` (event rename), `src/App.tsx` (ROUTE_META copy), `src/config.ts` (UTM builder), `src/media.ts` (new/optimized assets), `index.html` (JSON-LD sync, canonical per §21 decision, preload path, meta refresh), `vercel.json` (only if CSP needs font/img source changes), `README.md` (stale event list + new setup notes).

**Create:** `src/components/HeroDemo.tsx`, `src/components/BeforeAfterSlider.tsx`, `src/components/Faq.tsx`, `src/components/ShopConversation.tsx`, `public/fonts/*` (Bricolage Grotesque, Inter, IBM Plex Mono subsets), `public/images/` optimized hero/moray/before-after/OG-b2b assets, `public/robots.txt`, `public/sitemap.xml`, optional `src/components/StickyCta.tsx`.

**Remove (justified):** dead V1 JSX already gone from working tree — nothing else; keep `early-access` API (harmless legacy per README).

**Asset production list (founder/human tasks):** export 4 real Q&A transcripts from the app; true before/after photo pair; Steve character avatar crop; real founder photo; B2B OG image; confirm MSDT title; confirm `Steve.png` identity (character vs founder).

**Environment variables:** unchanged (`VITE_APP_URL`, `ADMIN_CREDENTIALS_JSON` or split Firebase creds). Verify `VITE_APP_URL` is set in Vercel prod to the real app origin.

---

## 26. Risk register

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Working-tree V2 code was never reviewed/committed; unknown regressions vs live V1 | High | High | Phase A commits on a branch; full manual QA before merge; live site untouched until Phase G |
| R2 | Canonical/domain ambiguity (landing vs scubasteve.rocks) suppresses landing SEO or splits authority | High | Medium | Founder decision in Phase G gate; document both options (§21) |
| R3 | Demo copy drifts from real product behavior → honesty violation | Medium | High | Content gate in Phase C: transcripts generated in the production app, founder-approved |
| R4 | Hero animation hurts LCP/CLS on mobile | Medium | Medium | Static-first render, animation as enhancement; Lighthouse gate in Phase B |
| R5 | Vercel Analytics custom events not recorded on current plan → funnel blind | Medium | High | Verify on preview deploy in Phase E before building dashboards |
| R6 | `Steve.png` labeled "founder portrait" in media.ts but used as character — wrong face in founder/trust section | Medium | Medium | Founder confirms asset identity; separate character avatar from founder photo |
| R7 | FAQPage JSON-LD / visible-FAQ mismatch (exists in V2 today) → schema spam signal | Certain if unfixed | Medium | S9 restoration synced in one commit (Phase C) |
| R8 | Sticky mobile CTA annoys users / cannibalizes section CTAs | Low | Low | Dismissible, appears only after demo section, measure `source_section:"sticky"` share |
| R9 | Firebase-hosted images (tokens in URLs) could be rotated/deleted → broken hero | Low | High | Phase A/F self-hosts all critical images in `public/` |
| R10 | OneDrive-synced repo path → file-lock/CRLF oddities during build (warnings already observed) | Medium | Low | `.gitattributes` with `* text=auto eol=lf`; builds in CI/Vercel unaffected |

---

## 27. QA checklist (Phase G)

**Browsers/devices:** Chrome + Safari + Firefox desktop; iOS Safari (real device, small: SE/13 mini class); Android Chrome (mid-tier); iPad portrait.

- [ ] 5-second test with 2–3 real divers: "what is this product?" answered correctly
- [ ] Hero demo: plays, replays, chip switching, reduced-motion static, JS-disabled static content present
- [ ] All CTAs navigate to `VITE_APP_URL` with correct UTM `source_section`
- [ ] Demo tabs: mouse, touch, keyboard (arrows/Enter), screen reader announce
- [ ] Before/after slider: drag, touch, keyboard, no scroll-trap on mobile
- [ ] Moments cards deep-link to correct pre-selected demo tab
- [ ] `/dive-centres`: all anchors from email deep-links land correctly
- [ ] Pilot form: success → Firestore doc; validation errors announced; honeypot invisible; double-submit blocked
- [ ] Footer diver signup: success path + error path
- [ ] Events: full funnel visible in Vercel Analytics (hero click, demo start/complete, feature_selected, gateway, page_viewed, form start/submit, final CTA)
- [ ] Lighthouse mobile: Perf ≥90 / A11y ≥95 / SEO ≥95, both routes
- [ ] LCP <2.5s (4G throttle), CLS <0.05, no layout shift during demo streaming
- [ ] Rich Results test: Organization, SoftwareApplication, FAQPage all valid; FAQ matches visible content
- [ ] OG cards render (X/WhatsApp/Facebook debuggers) for both routes
- [ ] 360px width: no horizontal scroll anywhere; nav CTA visible
- [ ] Dark-ish ambient check: page is dark-themed by design — verify light-band text contrast in bright-light simulation
- [ ] prefers-reduced-motion: zero animation anywhere
- [ ] 404/unknown route falls back to home via rewrite (SPA) without console errors
- [ ] Rollback rehearsal: previous Vercel deployment restorable in <2 min

---

## 28. Handoff prompt structure for Opus/Sonnet

Feed the coding model one phase at a time. Template:

```
CONTEXT
- Repo: C:\Users\User\OneDrive\Desktop\OSEA_SOURCE\ScubaSteveLandingPage
- Read docs/LANDING_PAGE_STRATEGY.md fully before editing. It is the source of truth.
- The working tree contains an uncommitted redesign (V2). Do not discard it; you are completing it.
- Branch: redesign/v3 (create in Phase A, reuse thereafter).

TASK: Execute Phase <X> exactly as specified in §24 Phase <X> and the referenced
sections (§<...>). Do not implement other phases. Do not add dependencies.

HARD CONSTRAINTS
- Honesty: no invented testimonials/stats/claims; demo copy only from the approved
  transcripts in <path>; Marine ID language always "starting point".
- Design tokens in §12 verbatim; motion rules in §13; a `prefers-reduced-motion`
  block is mandatory.
- Preserve all existing analytics event names; new events per §20 only.
- Accessibility per §22 is acceptance criteria, not polish.

VERIFICATION (run before declaring done)
- npm run typecheck && npm run build
- <phase-specific checks from §24>
- Report results honestly, including anything skipped.

OUT OF SCOPE
- Committing to Main, deploying, changing api/, changing env vars.
```

Sequence the phases A→G, reviewing the Vercel preview between C→D and F→G with the founder. The only decisions the coding model must NOT make itself: canonical/domain (§21.1), demo transcript content (§11), founder photo/title (§14), pilot pricing language (§17 FAQ).

---

*End of report.*
