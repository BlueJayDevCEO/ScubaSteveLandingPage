export type LandingMediaAsset = {
  src: string;
  alt: string;
  source: string;
  suggestedUse: string;
  safeForPublicMarketing: boolean;
};

const storage = "https://firebasestorage.googleapis.com/v0/b/scubasteverocks-1b9a9.firebasestorage.app/o";

export const media = {
  brand: {
    oseaLogo: {
      src: "/images/osea-logo.png",
      alt: "OSEA Diver logo",
      source: "ScubaSteveRocks public/images/brand/osea-logo.png, copied into landing public/images/osea-logo.png",
      suggestedUse: "Navigation, founder section, footer branding",
      safeForPublicMarketing: true
    }
  },
  social: {
    ogImage: {
      src: "https://www.scubasteve.rocks/images/social/scuba-steve-og.png",
      alt: "Scuba Steve AI social preview",
      source: "Landing public/images/scuba-steve-og.png, matching ScubaSteveRocks public/images/social/scuba-steve-og.png",
      suggestedUse: "Open Graph and Twitter social preview",
      safeForPublicMarketing: true
    }
  },
  hero: {
    background: {
      src: `${storage}/public%2Fvideo%2FMaldives.webp?alt=media&token=485eb3f9-c78f-4a35-a6f5-57777e4ce742`,
      alt: "Maldives reef water used as Scuba Steve landing hero background",
      source: "ScubaSteveRocks components/LoginPage.tsx",
      suggestedUse: "Hero background image",
      safeForPublicMarketing: true
    },
    fallbackBackground: {
      src: `${storage}/site%2Fbackgrounds%2Fsunset.png.jpeg?alt=media&token=da3eb943-95e7-49f5-a7fb-d6700ead7fc5`,
      alt: "Ocean sunset background from Scuba Steve",
      source: "ScubaSteveRocks components/LoginPage.tsx and constants/backgrounds.ts",
      suggestedUse: "Fallback or future alternate hero background",
      safeForPublicMarketing: true
    }
  },
  product: {
    marineId: {
      src: `${storage}/public%2Fvideo%2FApp%20layout%20Media%2FID%20marinelife.webp?alt=media&token=5b0eb9cb-85a6-4bdf-bb4c-c651c2185eaf`,
      alt: "Scuba Steve AI marine life identification app preview for divers",
      source: "ScubaSteveRocks components/ToolsHubView.tsx",
      suggestedUse: "Marine Life ID preview card",
      safeForPublicMarketing: true
    },
    tripPlanner: {
      src: `${storage}/public%2Fvideo%2FApp%20layout%20Media%2FTrip%20planner.webp?alt=media&token=17861eab-d571-4d4b-89ee-9fd39c36f9b9`,
      alt: "Scuba Steve AI dive trip planner app preview for scuba travel planning",
      source: "ScubaSteveRocks components/ToolsHubView.tsx",
      suggestedUse: "Hero product device and trip planner preview card",
      safeForPublicMarketing: true
    },
    aiChat: {
      src: `${storage}/public%2Fvideo%2FApp%20layout%20Media%2FSteve.png?alt=media&token=98017731-0889-4eb0-9367-14a953f2255b`,
      alt: "Scuba Steve scuba AI assistant chat preview for dive questions",
      source: "ScubaSteveRocks components/ToolsHubView.tsx",
      suggestedUse: "AI chat preview card",
      safeForPublicMarketing: true
    },
    photoEnhancement: {
      src: "https://www.scubasteve.rocks/demo-color-after.svg",
      alt: "Scuba Steve underwater photo enhancement color correction preview",
      source: "ScubaSteveRocks public/demo-color-after.svg",
      suggestedUse: "Underwater photo enhancement preview card",
      safeForPublicMarketing: true
    },
    photoEnhancementBefore: {
      src: "https://www.scubasteve.rocks/demo-color-before.svg",
      alt: "Before view of underwater photo color correction demo",
      source: "ScubaSteveRocks public/demo-color-before.svg",
      suggestedUse: "Future before-and-after photo enhancement comparison",
      safeForPublicMarketing: true
    },
    photoEnhancementStorageSample: {
      src: `${storage}/public%2Fvideo%2FApp%20layout%20Media%2FPA310001.JPG?alt=media&token=72dd7cb8-cc5d-4904-8531-81117ed13f65`,
      alt: "Original underwater photo enhancement sample image",
      source: "ScubaSteveRocks components/ColorCorrectionView.tsx",
      suggestedUse: "Reference only unless optimized before use on the landing page",
      safeForPublicMarketing: true
    },
    localMarineIdPreview: {
      src: "/images/marine-id-preview.png",
      alt: "Scuba Steve marine ID app preview",
      source: "ScubaSteveRocks public/images/login/marine-id-preview.png, copied into landing public/images/marine-id-preview.png",
      suggestedUse: "Fallback local Marine ID preview",
      safeForPublicMarketing: true
    },
    localDivePlanPreview: {
      src: "/images/dive-plan-preview.png",
      alt: "Scuba Steve dive plan app preview",
      source: "ScubaSteveRocks public/images/login/dive-plan-preview.png, copied into landing public/images/dive-plan-preview.png",
      suggestedUse: "Fallback local dive planner preview",
      safeForPublicMarketing: true
    },
    localOceanTripsPreview: {
      src: "/images/ocean-trips-preview.png",
      alt: "Scuba Steve ocean trips app preview",
      source: "ScubaSteveRocks public/images/login/ocean-trips-preview.png, copied into landing public/images/ocean-trips-preview.png",
      suggestedUse: "Fallback local AI chat or ocean trips preview",
      safeForPublicMarketing: true
    }
  },
  backgrounds: {
    diverAbyss: {
      src: `${storage}/site%2Fbackgrounds%2Fbg_hero.jpg.jpg?alt=media&token=68d9d400-6396-43b8-bdb2-6b5d37a6c7c1`,
      alt: "Diver abyss background",
      source: "ScubaSteveRocks constants/backgrounds.ts",
      suggestedUse: "Future alternate hero or feature background",
      safeForPublicMarketing: true
    },
    coralGarden: {
      src: `${storage}/site%2Fbackgrounds%2Fbg_cta.jpg.jpg?alt=media&token=4345ded0-49ed-40f9-8e51-567c2e9765f7`,
      alt: "Coral garden background",
      source: "ScubaSteveRocks constants/backgrounds.ts",
      suggestedUse: "Future CTA or trust-section background",
      safeForPublicMarketing: true
    },
    wreck: {
      src: `${storage}/site%2Fbackgrounds%2FWreck.png.jpg?alt=media&token=9f6fa859-f5e3-4517-a6dc-8761dd8c498a`,
      alt: "Wreck dive background",
      source: "ScubaSteveRocks constants/backgrounds.ts",
      suggestedUse: "Future dive-experience background",
      safeForPublicMarketing: true
    }
  }
} as const;

export const mediaInventory: LandingMediaAsset[] = [
  media.brand.oseaLogo,
  media.social.ogImage,
  media.hero.background,
  media.hero.fallbackBackground,
  media.product.marineId,
  media.product.tripPlanner,
  media.product.aiChat,
  media.product.photoEnhancement,
  media.product.photoEnhancementBefore,
  media.product.photoEnhancementStorageSample,
  media.product.localMarineIdPreview,
  media.product.localDivePlanPreview,
  media.product.localOceanTripsPreview,
  media.backgrounds.diverAbyss,
  media.backgrounds.coralGarden,
  media.backgrounds.wreck
];
