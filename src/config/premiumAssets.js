const PREMIUM_ASSET_BASE = "/assets/mom-134";

export const HERO_HOMEPAGE_IMAGE = `${PREMIUM_ASSET_BASE}/hero-homepage-master.jpg`;

export const CATALOG_FALLBACK_IMAGES = [
  `${PREMIUM_ASSET_BASE}/catalog-visual-01.jpg`,
  `${PREMIUM_ASSET_BASE}/catalog-visual-02.jpg`,
  `${PREMIUM_ASSET_BASE}/catalog-visual-03.jpg`,
];

export const PDP_STORYTELLING_VIDEO = `${PREMIUM_ASSET_BASE}/storytelling-loop-01.mp4`;
export const PDP_STORYTELLING_POSTER =
  `${PREMIUM_ASSET_BASE}/storytelling-loop-01-poster.jpg`;

function isValidMediaSource(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function dedupeSources(sources) {
  return [...new Set(sources.map((source) => source.trim()))];
}

function stableStringHash(value) {
  if (typeof value !== "string" || value.length === 0) {
    return 0;
  }

  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function buildCatalogImageCandidates(product) {
  const feedImages = [product?.image, ...(product?.images || [])].filter(
    isValidMediaSource
  );

  const identifier = product?.id || product?.sku || product?.title || "";
  const leadIndex = stableStringHash(String(identifier)) % CATALOG_FALLBACK_IMAGES.length;
  const editorialFirst = [
    CATALOG_FALLBACK_IMAGES[leadIndex],
    ...CATALOG_FALLBACK_IMAGES.filter((_, index) => index !== leadIndex),
  ];

  return dedupeSources([...editorialFirst, ...feedImages]);
}
