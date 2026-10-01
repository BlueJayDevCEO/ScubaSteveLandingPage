# Dive Centre Pilot assessment and implementation plan

Assessment before implementation, 1 October 2026. Reviewed local checkouts of all four named repositories. No consumer-app changes are planned.

## Current architecture and what stays

LandingPage is a React/Vite SPA on Vercel. `/dive-centres` already has the value proposition, illustrative conversation, scope exclusions, owner FAQ and PilotForm. Home teaser and navigation link internally to it. Keep the layout, questions, responsive CSS, safety footer and first-party submission flow. Native required/email/URL validation and accessible nested labels already exist. Resend delivers applications; optional server-side Firestore stores leads. No onboarding redirect exists, which is correct.

Onboarding is a vanilla nine-step HTML form served by Express. It already collects centre details, services, sites, documents and knowledge. SMTP credentials are server-side, not embedded in HTML. Preserve those questions. Currently anyone can load and POST the form; Multer writes into the repository filesystem; email is the only lasting record. Vercel cannot use that directory as durable storage. Existing in-memory IP limits are only per instance. Frontend step validation checks emptiness but not email validity; final submit bypasses required-field validation. Zoom is disabled and price upload is mouse-only.

ScubaSteveRocks is the existing React/Vite consumer application with Firebase functions, billing, safety checks and substantial independent test infrastructure. Leave it untouched. Shop scoping will be a future extension, not a copied app.

scubasteveB2B contains only a one-line README and Font Awesome assets. Those assets also exist elsewhere. Recommend archiving after owner review; do not delete or create another product there.

## Demonstrated gaps and exact minimal changes

| Repository | Change | Reason |
| --- | --- | --- |
| LandingPage | Build-time rendered `/dive-centres` HTML with route canonical, OG/Twitter metadata and WebPage schema; update metadata on SPA navigation | Initial HTML currently has homepage canonical, social tags and unrelated homepage schema; description/title alone change after JS |
| LandingPage | Apply-click event; explicit success/error events; avoid query strings in analytics | Missing CTA measurement and cleaner funnel segmentation |
| LandingPage | Store each submitted lead under a unique ID | Email-based dedup currently reports stored for an old document even if new email delivery fails |
| LandingPage | Explain acceptance before onboarding | Preserve separation and make the operational workflow explicit |
| Onboarding | Expiring HMAC invitation, HttpOnly cookie, protected HTML and POST, operator CLI | Small acceptance gate without accounts; no automatic public invitation issuance |
| Onboarding | Bounded memory uploads to private Blob; durable submission JSON before success; notification failure does not lose submission | Replace local disk; private review material; stay below Vercel request limit |
| Onboarding | Server validation, file signature checks, total limits, safe filenames and same-origin POST | Existing submission trusts arbitrary fields and client validation |
| Onboarding | Shared ocean colours/logo, zoom, focus, upload keyboard support, step and final validation | Preserve layout while correcting accessibility and validation |
| Onboarding | Durable started/completed events identified by invitation and centre | Measure eventual onboarding independently of visitor analytics blockers |

## Proposed production pilot

Two Vercel projects: public landing and invitation-only Express onboarding. Keep the public form's existing Resend and optional Firestore environment configuration. OSEA reviews applications manually, assigns a stable `centreId`, generates an invitation locally with the onboarding secret and configured origin, and personally sends it to the accepted owner. No email is sent by this implementation task.

The invitation expires (default seven days), is a bearer link and can be forwarded by its recipient. Exchange it for an HttpOnly SameSite cookie; use no-referrer and no-store. Secret rotation revokes all invitations; individual invitation IDs can be revoked via a server environment list. No centre email or secret goes into analytics.

Onboarding uses a **private** Vercel Blob store. Files are bounded to 3 MiB total per submission with a 3.5 MiB request guard, below Vercel's 4.5 MB limit. Only PDF/JPEG/PNG are accepted; larger/Office documents must be converted, compressed or arranged with OSEA. This is an intentional small-pilot limit rather than a new direct-upload subsystem. No completed medical records or personal diver data: blank business templates only. Persist files, then a JSON record in `review` state, then notify OSEA. A failed notification still returns success because the record is durable. OSEA must review private store records regularly and open documents as untrusted files. Failed partial saves are cleaned up; crashes may leave orphan files for operator cleanup. No automatic customer publication.

## Test plan and release gate

Run landing typecheck/build and API tests covering validation, no configured channel, email failure/success, durable fallback and repeat applicants. Inspect build HTML without JavaScript for canonical/social/schema/crawlable content. Browser-check 390px and desktop widths, both Apply CTAs, navigation, required/email validation, delivery success/error and keyboard access.

Run onboarding syntax/build checks and automated HTTP tests: protected root/index aliases, missing/tampered/expired/revoked invitations, cookie flags, origin rejection, required/email/URL validation, file signatures/counts/size, durable persistence, storage and email failure, started/completed records. Browser-check every step, invalid email, back/forward, keyboard upload, mobile overflow, final success/error.

Before real owners receive links: configure private Blob, secret/origin and SMTP; deploy a preview; verify actual upload/download privacy and an actual SMTP/Resend inbox delivery using approved test data; confirm Vercel routing, cold start and payload rejection. Local mocked tests cannot prove provider credentials or inbox delivery. Record evidence and do not call the pilot released until these external checks pass.

References: https://vercel.com/docs/frameworks/backend/express ; https://vercel.com/docs/vercel-blob/server-upload ; https://vercel.com/docs/vercel-blob/private-storage
