# Pilot validation — 1 October 2026

Changes are local and uncommitted in LandingPage and Onboarding. No deployment, customer email, repository archive or consumer-app modification was performed.

## Completed

- Landing: typecheck, Vite production build, build-time SSR of `/dive-centres`, five automated tests, dependency audit (zero reported vulnerabilities), whitespace/diff checks.
- Onboarding: Node syntax build checks, eight automated HTTP/security/storage tests, browser inline-script syntax check, dependency audit (zero reported vulnerabilities), whitespace/diff checks.
- Tests cover application validation, honeypot, size/method rejection, missing delivery configuration, repeated applications, Resend success/failure, Firestore fallback/failure, initial HTML SEO; onboarding invitation signatures/expiry/revocation/secret rotation, protected HTML/API, same-origin exchange and secure cookie, private document records, review/completion state, invalid inputs/files/count/size, partial-write cleanup and notification/storage failure.
- Built-page browser check: mobile 390px and desktop 1280px, no horizontal overflow; Apply reaches the form; native required/email validation; internal home/pilot navigation restores canonical and schema. Social tags are present in initial HTML, not only after JavaScript. Existing mailto links point at the enquiry inbox; Try Steve remains directed at the configured consumer app with attribution.
- Browser submission against the actual landing handler with an isolated mocked email provider: success message, then simulated provider failure shows the direct-email fallback. This does not send any real email.
- Browser onboarding using an isolated mocked Blob/SMTP app: accepted link removes fragment and opens form, invalid email prevents progression, all nine steps complete, back navigation works, success reaches thank-you screen. Newly visible document file controls caused 447px overflow at 390px; corrected wrapping reduced document width to 375px. Ocean tokens/logo shared without changing public layout. Heading focus and zoom corrected.
- Removed broken font preload/font-face requests for absent Lemon Milk assets; the existing fallback appearance remains. Fixed social-image/logo metadata paths to existing assets.
- Browser tests found `/dive-centres/` rendered the homepage due to exact route matching. Trailing slashes now normalise correctly.
- Found and removed an SMTP password in tracked `.env.example`; replacement is an operator action, not verified here.

## Limits of this evidence

The host ran Node 24.19.0; repositories target Node 22 on Vercel. Re-run production smoke checks on that runtime. Vercel Express support and request/upload constraints were checked against official documentation, but a Vercel deployment build was not run. The connected Vercel tool returned no accessible teams and project listing requires a team ID; local checkouts have no linked Vercel configuration or populated environment files.

Windows application control blocked agent-browser; the Codex in-app browser was used instead. Normal preview reported no console errors. The isolated Express landing harness falls back to HTML for Vercel's hosted analytics script and therefore reports an expected script parsing error; analytics **ingestion** requires a real Vercel deployment. Custom event instrumentation and durable onboarding event records are implemented, but production dashboards were not inspected.

Private Blob access, real SMTP/Resend delivery, deployed routing/cold starts, firewall limits and payload boundaries remain unverified. Follow the onboarding `docs/PILOT-RUNBOOK.md` release checks before sending real owners invitations. The committed SMTP credential must be revoked even though it is removed from the example file.
