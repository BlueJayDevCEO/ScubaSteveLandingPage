// Production must set VITE_APP_URL to the real Scuba Steve app URL, not this landing page URL.
export const APP_URL = import.meta.env.VITE_APP_URL || "https://scubasteverocks-1b9a9.web.app/";

/**
 * Builds the outbound app URL with campaign attribution so the product's own
 * analytics can measure landing-page activation. The app must tolerate/ignore
 * unknown query params (verify in QA — see strategy §18).
 */
export function buildAppUrl(sourceSection: string): string {
  try {
    const url = new URL(APP_URL, window.location.href);
    url.searchParams.set("utm_source", "landing_page");
    url.searchParams.set("utm_medium", "web");
    url.searchParams.set("utm_content", sourceSection);
    return url.toString();
  } catch {
    return APP_URL;
  }
}
