# Scuba Steve AI Landing Page

Standalone activation-first landing page for Scuba Steve AI.

Primary goal: send visitors to the Scuba Steve app at `https://www.scubasteve.rocks`.

Secondary goals: collect diver early-access leads, capture dive business interest, and preview educational article content for SEO and trust.

## Stack

- React
- Vite
- TypeScript
- Vercel Analytics
- Vercel Serverless Function for `/api/early-access`
- Firebase Firestore via server-side REST credentials

## Local Setup

```bash
npm install
npm run dev
```

Local Vite dev runs the frontend only. Use Vercel local dev if you need to exercise `/api/early-access` as a route:

```bash
vercel dev
```

## Build

```bash
npm run lint
npm run typecheck
npm run build
```

## Email Capture

Endpoint:

```bash
POST /api/early-access
```

Stored Firestore collection:

```text
earlyAccessLeads
```

Fields:

- `email`
- `name`
- `diverLevel`
- `source=landing-page`
- `createdAt`
- `userAgent`
- `referrer`

Duplicate protection uses a SHA-256 hash of the normalized email address as the Firestore document ID.

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

## Required Environment Variables

Set in Vercel Project Settings. Do not expose these as `VITE_*` variables.

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

1. Create a new Vercel project from this repository.
2. Set the Firebase Admin environment variables above.
3. Deploy.
4. Submit the early-access form once and confirm a document appears in `earlyAccessLeads`.
5. Submit the business interest form once and confirm a document appears in `businessInterestLeads`.

## Analytics Events

- `launch_app_click`
- `early_access_open`
- `early_access_submit_success`
- `business_interest_open`
- `business_interest_submit_success`
- `article_card_click`
- `feature_card_click`
