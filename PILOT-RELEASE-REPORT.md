# Dive Centre Pilot preview release report

Verification date: 1 October 2026. Production was not promoted. ScubaSteveRocks and scubasteveB2B were not modified. The later user instruction to combine the signup blocks was implemented on the preview branch.

## PASS

- Landing Preview deployed successfully through the existing Vercel Git integration. Initial deployment build logs explicitly confirm Node 22 and successful static pilot prerendering.
- Actual deployed `/`, `/dive-centres`, and `/dive-centres/` render the expected pages without an observed redirect loop. Homepage and pilot titles differ correctly. Pilot browser DOM has the expected canonical, description, Open Graph title/description/URL, Twitter metadata, and route-specific WebPage schema; homepage schema is absent there.
- Latest deployed preview has exactly one enquiry form on each page. Dropdown choices are Dive Centre Pilot, Diver updates, General enquiry. Non-pilot selections hide business fields. Topic is carried into saved leads and notification email. Local mocked-provider tests verify topic delivery.
- Initial preview controlled fictitious pilot application was accepted; Vercel runtime logs show POST `/api/business-interest` HTTP 200 at 07:14:51 UTC, with no warning/error/fatal messages in the inspected deployment window. This proves API acceptance, not actual inbox receipt.
- Empty application validation works. No unexpected browser console errors/warnings were captured on the inspected deployed pages. Desktop has no horizontal overflow.
- Exact old SMTP password was checked in memory against current tracked and nonignored untracked application files: absent from both repositories, with no code reference. No replacement secret was committed. Provider revocation remains the owner's task.
- Landing: 5 tests, typecheck, build, dependency audit pass. Onboarding: 8 tests, build/syntax checks, dependency audit pass. Both audits report zero vulnerabilities. These are local results, not deployed Onboarding evidence.

## FAIL

- Configured canonical-domain social image returns HTTP 404. Open Graph and Twitter image validation fails.
- Vercel Web Analytics is not enabled for the landing project, so deployed analytics collection is not operationally proven.

## UNVERIFIED

- Onboarding Preview deployment and its Node 22 runtime: no separate existing Onboarding Vercel project was found; CLI authentication is expired and the connector exposes no teams. No initial Production deployment was created as a workaround.
- Replacement SMTP configuration/revocation, real receipt at the configured OSEA inbox, Firestore persistence and distinct repeated deployed lead records. The checked accessible Gmail search did not show the controlled application, but that mailbox is not proven to be the configured destination.
- All deployed invitation tests: absent/invalid/tampered/expired/revoked/valid invitations, fragment removal, cookie HttpOnly/Secure/SameSite, direct index bypass, public asset protection.
- All deployed private Blob tests: approved PDF/JPEG/PNG, invalid signatures/types, count/3 MiB/request limits, private unauthenticated denial, authorised retrieval, centreId/submission paths, review state, persistence across SMTP failure and orphan cleanup.
- Full dummy accepted-business-to-onboarding journey and onboarding notification receipt; no acceptance or invitation was issued without verified application delivery.
- Cold starts, deployed Express routes, upload platform rejection boundaries, Onboarding runtime logs, and sensitive bundle checks on the deployed Onboarding application.
- Deployed initial raw HTML/HTTP response metadata: unauthenticated requests encounter Vercel Preview authentication. Browser view-source access was blocked by browser security policy; protection was kept intact. Local built HTML proves prerendering locally only.
- Mobile viewport proof: requested override did not change the measured viewport, so mobile overflow remains unverified.
- Actual analytics ingestion for start/apply/submit/success/error. Code inspection shows analytics properties exclude form contents, but actual ingestion is not established.
- Latest dropdown change has deployed UI proof and mocked email tests, but no second live submission was sent from that revision.

## REQUIRED BEFORE PRODUCTION

1. Owner revoke the compromised SMTP credential and configure its replacement in Vercel only; restore Vercel CLI access and identify/link the separate Onboarding project.
2. Configure Preview-only Onboarding origin, signing secret, private Blob store and SMTP; deploy as Preview on Node 22.
3. Correct and recheck the broken social-image URL; enable and prove the required analytics collection without inadvertently changing existing production settings.
4. Prove actual application inbox receipt, Firestore persistence/repeated records if configured, and the complete deployed invitation/private-storage/onboarding notification journey, including failure and boundary checks.
5. Complete raw deployed HTML/status, mobile and runtime evidence, then record the currently active production rollback deployment before promotion.

## CONFIGURATION

Names only; no secret values recorded.

Landing observed in Vercel Production and Preview: `RESEND_API_KEY`, `ENQUIRY_FROM`, `VITE_APP_URL`, `ADMIN_CREDENTIALS_JSON`.
Landing optional delivery override: `ENQUIRY_EMAIL`. Alternative Firebase configuration names: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.
Onboarding required/optional server configuration: `ONBOARDING_ORIGIN`, `ONBOARDING_INVITE_SECRET`, `ONBOARDING_REVOKED_INVITES`, `BLOB_READ_WRITE_TOKEN`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `NOTIFY_EMAIL`, `PORT`.

Firewall proposal, not applied: on the separate Onboarding project only, require environment equals Preview, method equals POST and exact path. `/api/session`: fixed-window per-IP 60 requests/60 seconds with log action initially, then 20/60 seconds with rate-limit rejection after observation. `/api/onboard`: 50/3600 seconds log initially, then 10/3600 seconds rejection. Inspect and review the pending ruleset before publishing; do not overwrite another draft. Counters are regional; retain application validation and invitation checks. Shared-IP legitimate traffic must be observed before enforcement. Production rules require a separately reviewed rollout; process-memory limits alone are insufficient.

## DEPLOYMENTS

Latest Landing Preview: https://scuba-steve-landing-page-otw09m2um-bluejaydevceos-projects.vercel.app
Commit: `2d4c246e5328ccaa85f46030597e60c95dc96f78`; GitHub deployment `6778585024`, successful Preview.
Branch: `codex/dive-centre-pilot-preview-2026-10-01`.

Initial tested Landing Preview: https://scuba-steve-landing-page-bnv7al41p-bluejaydevceos-projects.vercel.app
Vercel deployment `dpl_CjDYM6Zgbde2nbhSvqDsiHkyRa7K`; commit `89262a761124a0d0dd171a2c7e447d1c958feffa`; GitHub deployment `6778385131`.

Onboarding: not deployed; no Preview identifier exists.

## ROLLBACK

No production change was made, so this task needs no production rollback. Before any future promotion, record and verify the active production deployment for each project in Vercel. A historical successful Landing Production deployment exists at https://scuba-steve-landing-page-oycdzkwhj-bluejaydevceos-projects.vercel.app (commit `764e353d3b985ff64f4969539fcb3cfd49197f3f`, GitHub deployment `6710731894`), but the dashboard showed no active Production deployment; it is therefore not yet a verified rollback target.

Once the prior active target is verified, return production to that exact deployment with Vercel Instant Rollback in the project's deployment menu, or `vercel rollback <verified-previous-deployment-url>` in the correctly linked project. Verify the production domain and journey afterward. Onboarding has no known prior deployment: keep it unexposed until a baseline and rollback plan exist. Rollback does not undo Blob/Firestore writes or configuration changes; record and restore any changed configuration separately. Promotion of a Preview can trigger a rebuild with Production configuration, so Preview success alone does not validate that resulting build.
References: https://vercel.com/docs/instant-rollback and https://vercel.com/docs/deployments/promote-preview-to-production

## FINAL DECISION

NOT READY FOR PRODUCTION PROMOTION
