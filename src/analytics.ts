import { track } from "@vercel/analytics";

type TrackingProperties = Record<string, string>;

const SESSION_PREFIX = "scuba_steve_landing_event:";

function getDeviceType() {
  if (typeof window === "undefined") return "unknown";
  if (window.matchMedia("(max-width: 680px)").matches) return "mobile";
  if (window.matchMedia("(max-width: 1024px)").matches) return "tablet";
  return "desktop";
}

function getPagePath() {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.search}`;
}

function hasTrackedThisSession(eventName: string) {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(`${SESSION_PREFIX}${eventName}`) === "1";
  } catch {
    return false;
  }
}

function markTrackedThisSession(eventName: string) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(`${SESSION_PREFIX}${eventName}`, "1");
  } catch {
    // Session storage can be unavailable in privacy-restricted contexts.
  }
}

export function trackLandingEvent(eventName: string, properties: TrackingProperties = {}) {
  try {
    track(eventName, {
      ...properties,
      page_path: getPagePath(),
      device_type: getDeviceType()
    });
  } catch {
    // Analytics must never break visitor actions like lead capture.
  }
}

export function trackLandingEventOncePerSession(eventName: string, properties: TrackingProperties = {}) {
  if (hasTrackedThisSession(eventName)) return;
  markTrackedThisSession(eventName);
  trackLandingEvent(eventName, properties);
}
