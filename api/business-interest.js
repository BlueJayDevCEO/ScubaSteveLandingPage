import crypto from "node:crypto";
import { firestoreRequest, getFirebaseCredentials, hasFirebaseCredentials, toFirestoreFields } from "./_lib/firebase-rest.js";
import { isBodyTooLarge, methodNotAllowed, readJsonBody, setCors } from "./_lib/http.js";
import { isEnquiryNotifyConfigured, sendEnquiryNotification } from "./_lib/notify.js";
import { EMAIL_PATTERN, isValidOptionalUrl, sanitizeText } from "./_lib/validation.js";

const COLLECTION_NAME = "businessInterestLeads";
const MAX_BODY_BYTES = 8 * 1024;

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return methodNotAllowed(res);
  }

  if (isBodyTooLarge(req, MAX_BODY_BYTES)) {
    return res.status(413).json({ error: "Request body is too large." });
  }

  const body = readJsonBody(req);
  if (body.websiteUrl || body.company || body.url) {
    return res.status(200).json({ ok: true, spam: true });
  }

  const visitorType = body.visitorType === "business" ? "business" : "diver";
  const email = sanitizeText(body.email, 254).toLowerCase();
  const lead = {
    visitorType,
    name: sanitizeText(body.name),
    email,
    businessName: sanitizeText(body.businessName),
    businessType: sanitizeText(body.businessType),
    country: sanitizeText(body.country),
    website: sanitizeText(body.website, 300),
    message: sanitizeText(body.message, 1000)
  };

  if (
    !lead.name ||
    !EMAIL_PATTERN.test(email) ||
    !lead.country ||
    (visitorType === "business" && (!lead.businessName || !lead.businessType)) ||
    !isValidOptionalUrl(lead.website)
  ) {
    return res.status(400).json({ error: "Please complete the required signup fields." });
  }

  const credentials = getFirebaseCredentials();
  const hasFirebase = hasFirebaseCredentials(credentials);
  const hasEmail = isEnquiryNotifyConfigured();

  // The endpoint needs at least one working channel: email (Resend) and/or
  // Firestore storage. Email is the primary channel for the current setup.
  if (!hasFirebase && !hasEmail) {
    return res.status(503).json({ error: "Enquiry delivery is not configured yet." });
  }

  let stored = false;
  let emailed = false;
  let duplicateStore = false;

  // 1) Store in Firestore if configured (best-effort — never blocks email).
  // A previously-seen email only skips re-writing the Firestore doc; it must
  // NEVER skip the email below — every valid submission gets emailed, even
  // from a repeat visitor asking a new question.
  if (hasFirebase) {
    try {
      const documentId = crypto.createHash("sha256").update(email).digest("hex");
      const documentPath = `${COLLECTION_NAME}/${documentId}`;
      const existing = await firestoreRequest(credentials, documentPath);
      if (existing.ok) {
        duplicateStore = true;
        stored = true;
      } else {
        const payload = toFirestoreFields({
          ...lead,
          source: "landing-page",
          createdAt: new Date(),
          userAgent: sanitizeText(req.headers["user-agent"], 500),
          referrer: sanitizeText(req.headers.referer || req.headers.referrer, 500)
        });
        const response = await firestoreRequest(credentials, documentPath, {
          method: "PATCH",
          body: JSON.stringify(payload)
        });
        stored = response.ok;
        if (!stored) console.error("business_interest_store_failed", response.status);
      }
    } catch (storeError) {
      console.error("business_interest_store_error", storeError);
    }
  }

  // 2) Email the enquiry to the inbox via Resend if configured — always, on
  // every valid submission, regardless of Firestore dedup state.
  if (hasEmail) {
    try {
      await sendEnquiryNotification({ ...lead, source: "landing-page" });
      emailed = true;
    } catch (notifyError) {
      console.error("enquiry_notification_failed", notifyError);
    }
  }

  if (stored || emailed) {
    return res.status(200).json({ ok: true, duplicate: duplicateStore, stored, emailed });
  }

  return res.status(500).json({ error: "We could not send your enquiry right now. Please try again in a moment." });
}
