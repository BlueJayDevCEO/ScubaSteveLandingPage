# Dedicated dive-centre property

## Architecture and scope

`centres.scubasteve.rocks` is the dedicated marketing and pilot property, on Vercel project `scuba-steve-landing-page`, connected to BlueJayDevCEO/ScubaSteveLandingPage. `/` permanently redirects (308 on Vercel) to `/dive-centres`; `/dive-centres/` also redirects to the same canonical path. This preserves the existing page and avoids two competing indexable copies. Static root HTML has a meta-refresh fallback, the pilot content, and the destination canonical. The consumer homepage is no longer reachable through this application. Unknown paths have no catch-all rewrite.

The consumer product stays at `https://www.scubasteve.rocks`. Consumer CTA attribution continues through the existing utm_source/utm_medium/utm_content parameters. APP_URL is pinned to the consumer destination, preventing a stale VITE_APP_URL setting from sending visitors back into the B2B site. No consumer source, Firebase settings, authentication, billing, or production service was modified. Onboarding remains a separate invitation-only application.

## Exact changed files

- `src/App.tsx`: render the pilot alone, retain navigation/footer/safety and a single form; client root fallback.
- `src/config.ts`, `src/components/Nav.tsx`: fixed consumer destination; brand links directly to the pilot.
- `src/seo.ts`, `index.html`, `scripts/prerender.mjs`: B2B title, description, canonicals, social metadata and WebPage schema; remove consumer SoftwareApplication/FAQ schema; emit crawlable root fallback and pilot HTML.
- `public/sitemap.xml`, `public/robots.txt`: one canonical B2B page and centres-host sitemap.
- `vercel.json`: permanent root/slash redirects, explicit pilot rewrite, no consumer SPA fallback, remove unused consumer image host from CSP.
- `api/_lib/http.js`: B2B CORS default/allowlist; submission/storage/notification logic unchanged.
- `src/enquiry.ts`, `src/media.ts`: B2B mail provenance and local example image.
- `tests/seo-output.test.mjs`: updated domain and root fallback assertions.
- `docs/LANDING_PAGE_STRATEGY.md`: replace obsolete domain architecture instructions.
- This document and `PILOT-RELEASE-REPORT.md`: migration and earlier verification records.

## SEO review

Title: AI for Dive Centres: Scuba Steve Pilot. Description invites selected shops to provide courses, prices, schedules and local knowledge for review. One H1 remains on the pilot page. Initial HTML includes content, the form, title, description, canonical, OG/Twitter and route-specific WebPage schema before JavaScript. Canonical and OG URL identify `https://centres.scubasteve.rocks/dive-centres`. Sitemap lists only that page; robots permits crawling and references the centres sitemap. HTML specifies index/follow. The public social PNG is bundled locally and its absolute metadata URL now uses the centres host. Existing meaningful image alt text and decorative empty alt text are preserved. No keyword list or duplicate consumer page is published. Existing pilot claims, FAQ, scope, examples, analytics and single enquiry form are preserved.

Remaining exact consumer-host occurrences: `src/config.ts` intentionally links to the consumer application; this document explains that consumer destination. Neither is B2B SEO metadata. Email addresses remain unchanged brand/contact references. The old default Vercel hostname is absent from application code, metadata and configuration after removing stale documentation. Historical unique Preview URLs in the earlier release report are evidence, not canonical URLs.

## Later consumer cross-link, not implemented

Read-only inspection identified `ScubaSteveRocks/components/Footer.tsx`. In its existing link group (`flex items-center gap-x-6 gap-y-2 flex-wrap justify-center`), add this anchor immediately before Contact, using the same classes as Contact:

```tsx
<a
  href="https://centres.scubasteve.rocks"
  className="min-h-11 inline-flex items-center rounded-lg px-2 text-light-text/90 transition-colors hover:text-light-text focus:outline-none focus:ring-2 focus:ring-cyan-300 dark:text-slate-200 dark:hover:text-white"
>
  For Dive Centres
</a>
```

This is the proposed exact minimal follow-up. It has not been applied or deployed in the consumer repository.

## Domain and DNS operator instructions

1. Review the Preview and approve a separate production release. Do not assign this domain to the consumer project.
2. In Vercel, open `scuba-steve-landing-page`, Settings, Domains, and add only `centres.scubasteve.rocks` to this project. Check whether it already belongs to another project; stop rather than moving/detaching it. No domain settings were changed during this preparation.
3. At the authoritative DNS provider for scubasteve.rocks, add CNAME host/name `centres`, value exactly the project-specific CNAME target displayed by Vercel, with the provider's normal TTL. The exact target cannot be supplied until Vercel displays it; do not guess a generic legacy target. If ownership TXT verification is requested, copy precisely the name/value supplied by Vercel.
4. Leave apex, www, MX/mail and nameservers untouched. No www.centres alias is needed. Do not redirect www.scubasteve.rocks to this project.
5. Wait for Valid Configuration and certificate issuance in Vercel. Verify DNS resolves to the supplied target, HTTPS loads without certificate warnings, and the certificate covers centres.scubasteve.rocks. Do not bypass a TLS warning.
6. Confirm the centres root returns 308 with Location `/dive-centres`, slash normalisation has no loop, and final response is 200. Confirm raw HTML canonical/OG/schema use the centres host and social PNG returns 200 with image content type. Check sitemap/robots at the custom domain. Preview authentication may prevent unauthenticated raw response checks; keep it intact.

Vercel's current documentation specifies a project-specific CNAME for subdomains: https://vercel.com/docs/domains/working-with-domains/add-a-domain

## Validation and deployment checklist

Local typecheck, production build and all 5 automated tests pass; dependency audit reports zero vulnerabilities. Generated root and pilot HTML are checked for dedicated B2B metadata and canonical destination. Root is a redirect rather than a second self-canonical content page. Verify on the actual Preview: root/slash redirects, one H1/form, consumer CTA host and attribution, no console errors, image loading, and mobile widths before approving production. DNS/TLS/custom-host behaviour remains operator verification until the domain is attached and DNS propagates. Existing end-to-end onboarding/inbox/analytics blockers in the prior release report remain release gates; this architecture change does not establish production readiness.

## Rollback

Pre-change code baseline is commit `48dadf4dfef676d02436bd61138cea93824206cc`, with successful Preview https://scuba-steve-landing-page-bpozsq77a-bluejaydevceos-projects.vercel.app. Before a future production release, record the active Landing production deployment ID/URL and exact DNS record. Roll back only this Landing project to that verified deployment using Vercel Instant Rollback; restore only the centres record if it was changed. Do not move or detach the consumer www domain. If this is the first centres deployment, remove only the newly created centres DNS record and its Landing domain assignment if rollback requires taking it offline. No production promotion or DNS change was made by this task.

## Preview evidence

Architecture Preview: https://scuba-steve-landing-page-op9kw7r01-bluejaydevceos-projects.vercel.app (commit `9ed933e1a63d8568b9f7f1a58737c30b5a238b9c`, GitHub deployment `6779049893`, successful Preview). Actual browser navigation from root and trailing-slash pilot route reaches `/dive-centres` without a loop. Canonical and title are correct, with one form and no captured console warnings/errors. At measured viewport width 390px, document width is 375px: no horizontal overflow. Clicking Try Scuba Steve opened the intended consumer host with existing nav attribution. Generated raw HTML checks pass for root and pilot title, description, canonical, OG URL, WebPage URL, one H1 and index/follow. Actual HTTP status/header checks on the custom host remain pending domain setup; redirect behaviour is proven in the Preview browser, while 308 is configured in vercel.json.
