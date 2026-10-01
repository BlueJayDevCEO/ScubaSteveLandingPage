import React from "react";
import { renderToString } from "react-dom/server";
import { DiveCentresPage } from "./pages/DiveCentresPage";
export { pilotMeta } from "./seo";
export function render() {
  return renderToString(<DiveCentresPage />).replace(/reveal reveal-delay-/g, 'is-visible reveal reveal-delay-');
}
