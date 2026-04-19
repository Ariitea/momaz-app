const MULTI_SPACE = /\s+/g;

function sanitizeText(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  return value.replace(MULTI_SPACE, " ").trim();
}

function truncateText(value, maxLength) {
  if (!maxLength || value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

export function getDisplayTitle(rawTitle, { fallback = "Untitled", maxLength = 74 } = {}) {
  const normalized = sanitizeText(rawTitle);
  if (!normalized) {
    return fallback;
  }

  return truncateText(normalized, maxLength);
}

export function getCategoryLabel(rawCategory, { fallback = "Collection" } = {}) {
  const normalized = sanitizeText(rawCategory);
  return normalized || fallback;
}

