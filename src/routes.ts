export type FutureSeoRoute = {
  path: string;
  label: string;
  keywordTarget: string;
  showInNavigation: boolean;
};

export const futureSeoRoutes: FutureSeoRoute[] = [
  {
    path: "/marine-life-identification",
    label: "Marine Life Identification",
    keywordTarget: "marine life identification app",
    showInNavigation: false
  },
  {
    path: "/dive-trip-planner",
    label: "Dive Trip Planner",
    keywordTarget: "dive trip planner",
    showInNavigation: false
  },
  {
    path: "/underwater-photo-enhancement",
    label: "Underwater Photo Enhancement",
    keywordTarget: "underwater photo enhancement",
    showInNavigation: false
  },
  {
    path: "/scuba-ai-assistant",
    label: "Scuba AI Assistant",
    keywordTarget: "scuba AI assistant",
    showInNavigation: false
  }
];

export const futureNavigationRoutes = futureSeoRoutes.filter((route) => route.showInNavigation);
