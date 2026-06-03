# Scuba Steve AI Landing Page

Standalone landing page for Scuba Steve AI, built to introduce the product, send visitors into the app, and capture dive business interest.

## Current Goals

- Send visitors to the Scuba Steve app through the primary CTA.
- Capture business interest from dive centres, resorts, liveaboards, instructors, and travel companies.
- Provide SEO-friendly product copy and FAQs for the AI scuba app.

## Stack

- React
- Vite
- TypeScript
- Vercel Analytics
- Vercel Serverless Functions
- Firebase Firestore via server-side REST credentials

## Local Setup

```bash
npm install
npm run dev
```

Local Vite dev runs the frontend only. Use Vercel local dev if you need to exercise serverless API routes:

```bash
vercel dev
```

## App CTA Configuration

The primary CTA reads `VITE_APP_URL` at build time.

Expected production value:

```bash
VITE_APP_URL=https://scubasteverocks-1b9a9.web.app/
```

Set this to the real Scuba Steve app URL, not the landing page URL. If a custom app domain is introduced later, update `VITE_APP_URL` to that origin or path.

## Build

```bash
npm run typecheck
npm run build
```

## Business Interest Capture

Endpoint:

```bash
POST /api/business-interest
```

Stored Firestore collection:

```text
businessInterestLeads
```

Fields:

- `name`
- `email`
- `businessName`
- `businessType`
- `country`
- `website`
- `message`
- `source=landing-page`
- `createdAt`
- `userAgent`
- `referrer`

Duplicate protection uses a SHA-256 hash of the normalized email address as the Firestore document ID.

The endpoint includes a hidden honeypot field, required-field validation, optional website URL validation, an 8 KB body-size guard, CORS allowlisting, and generic client-facing error messages.

## Legacy Early Access Endpoint

`/api/early-access` is retained as unused legacy code for old deployments or old links. The current landing page does not render an early-access form and does not call this endpoint.

Stored Firestore collection for legacy submissions:

```text
earlyAccessLeads
```

## Required Environment Variables

Set in Vercel Project Settings.

Client build variable:

```bash
VITE_APP_URL=...
```

Server-only Firebase credentials. Do not expose these as `VITE_*` variables.

Preferred:

```bash
ADMIN_CREDENTIALS_JSON=...
```

Alternative:

```bash
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

## Vercel Deployment

1. Create or update the Vercel project from this repository.
2. Set `VITE_APP_URL` to the real Scuba Steve app URL.
3. Set the Firebase Admin environment variables above.
4. Deploy.
5. Submit the business interest form once and confirm a document appears in `businessInterestLeads`.

## Analytics Events

- `launch_app_click`
- `business_interest_open`
- `business_interest_submit_success`

