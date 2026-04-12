const SWZEGO_HOST = "xcimg.szwego.com";

export function optimizeCatalogImageUrl(url, options = {}) {
  if (typeof url !== "string" || !url) {
    return url;
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  if (parsed.hostname !== SWZEGO_HOST) {
    return url;
  }

  const width = Number.isFinite(options.width) ? Math.max(120, Math.round(options.width)) : 640;
  const quality = Number.isFinite(options.quality)
    ? Math.max(35, Math.min(90, Math.round(options.quality)))
    : 72;
  const format = options.format === "avif" ? "avif" : "webp";

  parsed.search = `?imageMogr2/auto-orient/thumbnail/!${width}x${width}r/quality/${quality}/format/${format}`;

  return parsed.toString();
}
