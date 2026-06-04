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
      src: "/images/scuba-steve-og.png",
      alt: "Scuba Steve AI social preview",
      source: "Landing public/images/scuba-steve-og.png, matching ScubaSteveRocks public/images/social/scuba-steve-og.png",
      suggestedUse: "Open Graph and Twitter social preview",
      safeForPublicMarketing: true
    }
  },
  hero: {
    background: {
      src: `${storage}/site%2Fbackgrounds%2Fbg_hero.jpg.jpg?alt=media&token=68d9d400-6396-43b8-bdb2-6b5d37a6c7c1`,
      alt: "Scuba diver exploring blue water with a dive torch",
      source: "Firebase Storage site/backgrounds/bg_hero.jpg.jpg",
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
      alt: "Scuba diver photographing reef marine life for identification",
      source: "Firebase Storage public/video/App layout Media/ID marinelife.webp",
      suggestedUse: "Marine Life ID preview card",
      safeForPublicMarketing: true
    },
    tripPlanner: {
      src: `${storage}/public%2Fvideo%2FApp%20layout%20Media%2FSite%20conditions.webp?alt=media&token=fce44e49-39ad-4e02-b77d-1e2786f026df`,
      alt: "Diver entering the water at sunset while checking dive conditions",
      source: "Firebase Storage public/video/App layout Media/Site conditions.webp",
      suggestedUse: "Dive trip planning preview card",
      safeForPublicMarketing: true
    },
    aiChat: {
      src: `${storage}/public%2Fvideo%2FApp%20layout%20Media%2Fdive%20topics.webp?alt=media&token=46882956-2f50-4489-b616-e537c82fc469`,
      alt: "Scuba diver with underwater slate for dive topic questions",
      source: "Firebase Storage public/video/App layout Media/dive topics.webp",
      suggestedUse: "AI chat preview card",
      safeForPublicMarketing: true
    },
    photoEnhancement: {
      src: `${storage}/public%2Fvideo%2FApp%20layout%20Media%2Fcolor%20correct.jpg?alt=media&token=b48bf61b-119d-4189-bdf2-884a1557921e`,
      alt: "Before and after underwater photo color correction comparison",
      source: "Firebase Storage public/video/App layout Media/color correct.jpg",
      suggestedUse: "Underwater photo enhancement preview card",
      safeForPublicMarketing: true
    },
    stevePortrait: {
      src: `${storage}/public%2Fvideo%2FApp%20layout%20Media%2FSteve.png?alt=media&token=98017731-0889-4eb0-9367-14a953f2255b`,
      alt: "Scuba Steve founder portrait",
      source: "Firebase Storage public/video/App layout Media/Steve.png",
      suggestedUse: "Founder section portrait",
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
  media.product.stevePortrait,
  media.product.photoEnhancementBefore,
  media.product.photoEnhancementStorageSample,
  media.product.localMarineIdPreview,
  media.product.localDivePlanPreview,
  media.product.localOceanTripsPreview,
  media.backgrounds.diverAbyss,
  media.backgrounds.coralGarden,
  media.backgrounds.wreck
];
