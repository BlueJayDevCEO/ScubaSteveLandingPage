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
    enquiryTopic: sanitizeText(body.enquiryTopic, 100),
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
  // Each submission is a separate durable record, including repeat applicants.
  if (hasFirebase) {
    try {
      const documentPath = `${COLLECTION_NAME}/${crypto.randomUUID()}`;
      const payload = toFirestoreFields({
        ...lead, source: "landing-page", createdAt: new Date(),
        userAgent: sanitizeText(req.headers["user-agent"], 500),
        referrer: sanitizeText(req.headers.referer || req.headers.referrer, 500)
      });
      const response = await firestoreRequest(credentials, documentPath, {
        method: "PATCH", body: JSON.stringify(payload)
      });
      stored = response.ok;
      if (!stored) console.error("business_interest_store_failed", response.status);
    } catch {
      console.error("business_interest_store_error");
    }
  }

  // 2) Email the enquiry to the inbox via Resend if configured — always, on
  // every valid submission, regardless of Firestore success.
  if (hasEmail) {
    try {
      await sendEnquiryNotification({ ...lead, source: "landing-page" });
      emailed = true;
    } catch (notifyError) {
      console.error("enquiry_notification_failed", notifyError);
    }
  }

  if (stored || emailed) {
    return res.status(200).json({ ok: true, duplicate: false, stored, emailed });
  }

  return res.status(500).json({ error: "We could not send your enquiry right now. Please try again in a moment." });
}
