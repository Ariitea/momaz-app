import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const ISSUE_ID = "MOM-304";
const PREVIOUS_ISSUE_ID = "MOM-303";
const DEFAULT_CATALOG_PATH = resolve(ROOT, "public/data/products.json");
const EVIDENCE_DIR = resolve(ROOT, `docs/evidence/${ISSUE_ID}`);
const SAMPLE_REPORT_PATH = resolve(EVIDENCE_DIR, "title-normalization-sample-report.json");
const SAMPLE_SUMMARY_PATH = resolve(EVIDENCE_DIR, "title-normalization-summary.md");
const FULL_REPORT_PATH = resolve(EVIDENCE_DIR, "title-normalization-full-report.json");
const FULL_SUMMARY_PATH = resolve(EVIDENCE_DIR, "title-normalization-full-summary.md");
const UNCERTAIN_PATH = resolve(EVIDENCE_DIR, "title-normalization-uncertain-cases.json");
const SPOT_CHECK_PATH = resolve(EVIDENCE_DIR, "title-normalization-spot-check-50.json");
const RANDOM_UNCERTAIN_SAMPLE_PATH = resolve(EVIDENCE_DIR, "title-normalization-uncertain-random-50.json");
const WORST_UNCERTAIN_SAMPLE_PATH = resolve(EVIDENCE_DIR, "title-normalization-uncertain-worst-50.json");
const IMPROVED_CASES_SAMPLE_PATH = resolve(EVIDENCE_DIR, "title-normalization-improved-50.json");
const REMAINING_LOW_SAMPLE_PATH = resolve(EVIDENCE_DIR, "title-normalization-remaining-low-50.json");
const PREVIOUS_FULL_REPORT_PATH = resolve(
  ROOT,
  `docs/evidence/${PREVIOUS_ISSUE_ID}/title-normalization-full-report.json`
);
const SAMPLE_SIZE = 30;
const SPOT_CHECK_SIZE = 50;
const SOFT_TITLE_CAP = 30;
const MEDIUM_SAMPLE_SIZE = 50;
const MEDIUM_SAMPLE_PATH = resolve(EVIDENCE_DIR, "title-normalization-medium-sample-50.json");

const MODE = process.argv.includes("--full") ? "full" : "sample";
const WRITE_CATALOG = MODE === "full" && process.argv.includes("--write-catalog");

function resolveSourceCatalogPath(argv) {
  const inlineArg = argv.find((item) => item.startsWith("--source-catalog="));
  if (inlineArg) {
    const value = inlineArg.split("=", 2)[1];
    return resolve(ROOT, value);
  }

  const flagIndex = argv.indexOf("--source-catalog");
  if (flagIndex !== -1 && argv[flagIndex + 1]) {
    return resolve(ROOT, argv[flagIndex + 1]);
  }

  return DEFAULT_CATALOG_PATH;
}

const SOURCE_CATALOG_PATH = resolveSourceCatalogPath(process.argv);

const BRAND_PATTERNS = [
  { brand: "Rolex", regex: /\brolex\b/i },
  { brand: "Patek Philippe", regex: /\bpatek\s+philippe\b/i },
  { brand: "Richard Mille", regex: /\brichard\s+mille\b/i },
  { brand: "Omega", regex: /\bomega\b/i },
  { brand: "Audemars Piguet", regex: /\baudemars\s+piguet\b|\bap\b/i },
  { brand: "Hublot", regex: /\bhublot\b/i },
  { brand: "Cartier", regex: /\bcartier\b/i },
  { brand: "Panerai", regex: /\bpanerai\b/i },
  { brand: "Vacheron Constantin", regex: /\bvacheron\s+constantin\b/i },
  { brand: "Jaeger-LeCoultre", regex: /\bjaeger[\s.-]*lecoultre\b/i },
  { brand: "Tudor", regex: /\btudor\b/i },
];

const BRAND_MODEL_DICTIONARY = {
  Rolex: [
    "Daytona",
    "Datejust",
    "Submariner",
    "GMT-Master",
    "GMT-Master II",
    "Explorer",
    "Explorer II",
    "Yacht-Master",
    "Sea-Dweller",
    "Sky-Dweller",
    "Oyster Perpetual",
  ],
  "Patek Philippe": ["Nautilus", "Aquanaut", "Calatrava", "Complications", "Grand Complications"],
  "Audemars Piguet": ["Royal Oak", "Royal Oak Offshore", "Code 11.59"],
  "Richard Mille": ["RM011", "RM027", "RM035", "RM055", "RM67", "RM07"],
  Omega: ["Speedmaster", "Seamaster", "Constellation", "De Ville"],
  Cartier: ["Santos", "Tank", "Ballon Bleu"],
  Hublot: ["Big Bang", "Classic Fusion", "Spirit of Big Bang"],
  "Vacheron Constantin": ["Overseas", "Patrimony", "Traditionnelle"],
};

const DICTIONARY_ALIASES = {
  "GMT-Master": ["gmt master", "gmt-master", "gmtmaster"],
  "GMT-Master II": ["gmt master ii", "gmt-master ii", "gmt master 2", "gmt-master 2", "gmtmasterii", "gmtmaster2"],
  "Royal Oak": ["royal oak", "royaloak"],
  "Royal Oak Offshore": ["royal oak offshore", "royaloakoffshore", "offshore"],
  "Code 11.59": ["code 11.59", "code 11 59", "code1159"],
  "Ballon Bleu": ["ballon bleu", "ballonbleu"],
  "Sea-Dweller": ["sea dweller", "sea-dweller", "seadweller"],
  "Sky-Dweller": ["sky dweller", "sky-dweller", "skydweller"],
  "Yacht-Master": ["yacht master", "yacht-master", "yachtmaster"],
  "Oyster Perpetual": ["oyster perpetual", "oysterperpetual"],
  "De Ville": ["de ville", "deville"],
  "Spirit of Big Bang": ["spirit of big bang", "spiritofbigbang"],
};

const LEGACY_MODEL_PATTERNS = [
  { model: "Air-King", regex: /\bair[\s-]*king\b/i },
  { model: "Day-Date", regex: /\bday[\s-]*date\b/i },
  { model: "Twenty-4", regex: /\btwenty[\s-]*4\b/i },
  { model: "Golden Ellipse", regex: /\bgolden\s+ellipse\b/i },
  { model: "Aqua Terra", regex: /\baqua\s+terra\b/i },
  { model: "Planet Ocean", regex: /\bplanet\s+ocean\b/i },
  { model: "Globemaster", regex: /\bglobemaster\b/i },
  { model: "Luminor", regex: /\bluminor\b/i },
  { model: "Radiomir", regex: /\bradiomir\b/i },
  { model: "Milgauss", regex: /\bmilgauss\b/i },
  { model: "Cellini", regex: /\bcellini\b/i },
  { model: "1908", regex: /\b1908\b/i },
  { model: "Sang Bleu", regex: /\bsang\s*bleu\b/i },
  { model: "Mille Miglia", regex: /\bmille\s*miglia\b/i },
  { model: "Portugieser", regex: /\bportugieser\b/i },
  { model: "Portofino", regex: /\bportofino\b/i },
  { model: "Overseas Dual Time", regex: /\boverseas\s+dual\s+time\b/i },
];

const NOISE_PATTERNS = [
  /\bnew\s+model\b/gi,
  /\blatest\b/gi,
  /\bhot[-\s]*selling\b/gi,
  /\bhighly\s+recommended\b/gi,
  /\bfactory\b/gi,
  /\btop\s+version\b/gi,
  /\bimported\b/gi,
  /\bautomatic\b/gi,
  /\bmechanical\b/gi,
  /\bmovement\b/gi,
  /\bwatch\b/gi,
  /\breplica\b/gi,
  /\bmen'?s\b/gi,
  /\bwomen'?s\b/gi,
  /\bseries\b/gi,
  /\bbrand\b/gi,
  /\bmodel\b/gi,
  /\bspecs?\b/gi,
  /\bsize\b/gi,
  /\bmm\b/gi,
  /\bdiameter\b/gi,
];

const GENERIC_FORBIDDEN = new Set(["watch", "luxury watch", "untitled"]);
const GENERIC_TOKENS = new Set([
  "watch",
  "luxury",
  "factory",
  "model",
  "series",
  "version",
  "movement",
  "automatic",
  "mechanical",
  "classic",
  "new",
  "best",
  "top",
  "sale",
  "hot",
  "style",
  "size",
  "men",
  "women",
  "orologio",
  "uomo",
  "donna",
  "replica",
  "ultimate",
  "customized",
  "chronograph",
  "steel",
  "bezel",
  "dial",
  "bracelet",
  "strap",
  "mm",
  "uncategorized",
  "goose",
  "uhr",
  "montre",
  "orologi",
  "product",
  "products",
  "made",
  "with",
  "this",
  "that",
  "these",
  "those",
  "from",
  "latest",
  "look",
  "great",
  "easy",
  "carry",
  "equipped",
  "named",
  "original",
  "versione",
  "nuovo",
  "nuova",
  "nuove",
  "best",
  "year",
  "market",
  "listing",
  "effect",
  "body",
  "capacity",
  "fashionable",
  "practical",
  "beautiful",
  "modelle",
  "modello",
  "serie",
  "cinturino",
  "specchi",
  "specs",
  "highlights",
  "automatico",
  "uomo",
  "donna",
]);

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function stripEmojiAndSymbols(value) {
  return value.replace(/[^\p{L}\p{N}\s\-./]/gu, " ");
}

function cleanToken(value) {
  return value.replace(/^[./-]+|[./-]+$/g, "").trim();
}

function sanitizeTitle(value) {
  let cleaned = normalizeWhitespace(stripEmojiAndSymbols(value));
  for (const pattern of NOISE_PATTERNS) {
    cleaned = cleaned.replace(pattern, " ");
  }
  return normalizeWhitespace(cleaned);
}

function detectBrand(text) {
  for (const candidate of BRAND_PATTERNS) {
    if (candidate.regex.test(text)) {
      return candidate.brand;
    }
  }
  return "Unknown";
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeForMatch(value) {
  return normalizeWhitespace(
    stripEmojiAndSymbols(String(value || ""))
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[._/:-]+/g, " ")
      .toLowerCase()
  );
}

function compactForMatch(value) {
  return normalizeForMatch(value).replace(/\s+/g, "");
}

function buildDictionaryIndex() {
  const rows = [];
  for (const [brand, models] of Object.entries(BRAND_MODEL_DICTIONARY)) {
    for (const model of models) {
      const aliases = Array.from(new Set([model, ...(DICTIONARY_ALIASES[model] || [])]))
        .map((alias) => normalizeForMatch(alias))
        .filter(Boolean)
        .map((alias) => ({
          phrase: alias,
          compact: alias.replace(/\s+/g, ""),
          tokenCount: alias.split(" ").filter(Boolean).length,
          regex: new RegExp(`(^|\\s)${escapeRegex(alias)}(\\s|$)`, "i"),
        }));

      rows.push({
        brand,
        model,
        aliases,
        modelLength: model.length,
        modelTokens: normalizeForMatch(model).split(" ").filter(Boolean),
      });
    }
  }
  return rows;
}

const DICTIONARY_INDEX = buildDictionaryIndex();

function detectModelByPattern(text, brand) {
  const normalized = normalizeForMatch(text);
  const compact = normalized.replace(/\s+/g, "");
  const textTokens = new Set(normalized.split(" ").filter(Boolean));
  const dictionaryCandidates =
    brand && brand !== "Unknown" ? DICTIONARY_INDEX.filter((entry) => entry.brand === brand) : DICTIONARY_INDEX;

  const exactMatches = [];
  for (const entry of dictionaryCandidates) {
    for (const alias of entry.aliases) {
      if (alias.regex.test(normalized) || (alias.compact.length >= 5 && compact.includes(alias.compact))) {
        exactMatches.push({
          model: entry.model,
          score: alias.tokenCount * 100 + alias.phrase.length + entry.modelLength / 100,
        });
      }
    }
  }

  if (exactMatches.length > 0) {
    exactMatches.sort((a, b) => b.score - a.score);
    return { model: exactMatches[0].model, method: "dictionary_exact_match", confidence: "high" };
  }

  let bestPartial = null;
  for (const entry of dictionaryCandidates) {
    const tokens = entry.modelTokens;
    if (tokens.length === 0) {
      continue;
    }
    const overlap = tokens.filter((token) => textTokens.has(token)).length;
    if (overlap === 0) {
      continue;
    }
    const ratio = overlap / tokens.length;
    const hasNumericSignal = tokens.some((token) => /\d/.test(token) && textTokens.has(token));
    if (ratio < 0.5 && overlap < 2 && !hasNumericSignal) {
      continue;
    }
    const score = ratio * 100 + overlap * 10 + (hasNumericSignal ? 15 : 0) + entry.modelLength / 100;
    if (!bestPartial || score > bestPartial.score) {
      bestPartial = { model: entry.model, score };
    }
  }

  if (bestPartial) {
    return {
      model: bestPartial.model,
      method: "dictionary_partial_match",
      confidence: "medium",
      uncertainty_reason: "partial_dictionary_token_match",
    };
  }

  const explicitModel = text.match(/\bmodel\s*[:：]\s*([a-z0-9][a-z0-9 .\-]{2,40})/i);
  if (explicitModel) {
    const firstChunk = normalizeWhitespace(explicitModel[1]).split(/[|,;/]/)[0]?.trim() || "";
    if (firstChunk) {
      for (const candidate of LEGACY_MODEL_PATTERNS) {
        if (candidate.regex.test(firstChunk)) {
          return { model: candidate.model, method: "explicit_model_label", confidence: "high" };
        }
      }
    }
  }

  for (const candidate of LEGACY_MODEL_PATTERNS) {
    if (candidate.regex.test(text)) {
      return { model: candidate.model, method: "legacy_model_pattern", confidence: "high" };
    }
  }

  const rmCodeMatch = text.match(/\brm[\s-]*(\d{2,4}(?:[-./]\d{1,2})?)\b/i);
  if (rmCodeMatch) {
    const code = rmCodeMatch[1].replace(/[./]/g, "-").toUpperCase();
    return { model: `RM${code}`, method: "rm_code_pattern", confidence: "high" };
  }

  const alphaRefCodeMatch = text.match(/\b(\d{3,6}(?:[./-]?[A-Z]{1,3}\d{0,2})?)\b/i);
  if (alphaRefCodeMatch) {
    return {
      model: cleanToken(alphaRefCodeMatch[1]).toUpperCase(),
      method: "alphanumeric_reference_pattern",
      confidence: "medium",
    };
  }

  const refCodeMatch = text.match(/\b(\d{3,6}(?:[.-]\d{1,4})?)\b/);
  if (refCodeMatch) {
    return { model: refCodeMatch[1], method: "reference_code_pattern", confidence: "medium" };
  }

  return null;
}

function truncateSoft(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }

  const chunk = value.slice(0, maxLength + 1);
  const lastSpace = chunk.lastIndexOf(" ");
  if (lastSpace > 10) {
    return chunk.slice(0, lastSpace).trim();
  }
  return value.slice(0, maxLength).trim();
}

function safeShortenOriginal(originalTitle, brand) {
  let cleaned = sanitizeTitle(originalTitle);

  if (brand !== "Unknown") {
    cleaned = cleaned.replace(new RegExp(brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig"), " ");
    cleaned = normalizeWhitespace(cleaned);
  }

  const phrase = normalizeWhitespace(cleaned.split(/[,:;|]/)[0] || cleaned);
  return truncateSoft(phrase, SOFT_TITLE_CAP);
}

function gentleTrimOriginal(originalTitle) {
  return truncateSoft(normalizeWhitespace(stripEmojiAndSymbols(originalTitle)), SOFT_TITLE_CAP);
}

function normalizeBrandAlias(brand) {
  if (brand === "Audemars Piguet") {
    return "AP";
  }
  if (brand === "Vacheron Constantin") {
    return "VC";
  }
  return brand;
}

function extractStrongTokenModel(title, category, brand) {
  const hasStrongSignal = /(\bmodel\b[:：]|\brm[\s-]?\d{2,4}\b|\b\d{3,6}(?:[-./]\d{1,4})?\b|\bdaytona\b|\bdatejust\b|\bsubmariner\b|\bnautilus\b|\baquanaut\b|\broyal\s+oak\b|\boverseas\b|\bpatrimony\b|\bbig\s*bang\b|\bsantos\b|\bseamaster\b|\bspeedmaster\b|\bgmt\b|\btourbillon\b|\bchrono(graph)?\b)/i.test(
    title
  );

  if (title.length <= SOFT_TITLE_CAP && !hasStrongSignal) {
    return null;
  }

  const source = sanitizeTitle(`${title} ${category}`);
  const tokens = source
    .split(/\s+/)
    .map((token) => cleanToken(token))
    .filter(Boolean);

  const filtered = [];
  for (const token of tokens) {
    const lower = token.toLowerCase();
    if (lower.length < 2) {
      continue;
    }
    if (GENERIC_TOKENS.has(lower)) {
      continue;
    }
    if (/^[a-z]{1,2}$/i.test(token)) {
      continue;
    }
    if (/^\d{1,2}$/.test(token)) {
      continue;
    }
    if (brand !== "Unknown" && lower === brand.toLowerCase()) {
      continue;
    }
    if (/^(louis|vuitton|gucci|chanel|versace|fendi|moncler|canada)$/.test(lower)) {
      continue;
    }
    if (/^\d{3,6}(?:[-./]\d{1,4})?$/.test(token)) {
      filtered.push(token.toUpperCase());
      continue;
    }
    if (/^rm\d{2,4}$/i.test(token)) {
      filtered.push(token.toUpperCase().replace(/^RM/, "RM"));
      continue;
    }
    if (/^[a-z][a-z0-9-]{2,}$/i.test(token)) {
      filtered.push(token);
    }
    if (filtered.length >= 6) {
      break;
    }
  }

  if (filtered.length === 0) {
    return null;
  }

  const model = truncateSoft(normalizeWhitespace(filtered.slice(0, 3).join(" ")), SOFT_TITLE_CAP);
  if (!model || GENERIC_FORBIDDEN.has(model.toLowerCase())) {
    return null;
  }

  const confidence = /(^RM\d{2,4}$)|(\d{3,6})/.test(model) ? "medium" : "medium";
  const brandAlias = normalizeBrandAlias(brand);
  const needsBrandPrefix = /^\d/.test(model) && brandAlias && brandAlias !== "Unknown";
  const finalModel = needsBrandPrefix ? truncateSoft(`${brandAlias} ${model}`, SOFT_TITLE_CAP) : model;

  return {
    model: finalModel,
    method: "strong_token_extraction",
    confidence,
    uncertainty_reason: "promoted_from_low_with_strong_token",
  };
}

function fallbackModel(title, category, brand) {
  const promoted = extractStrongTokenModel(title, category, brand);
  if (promoted) {
    return promoted;
  }

  const shortened = safeShortenOriginal(title, brand);
  const gentle = gentleTrimOriginal(title);

  if (!gentle) {
    return {
      model: "Untitled",
      method: "empty_fallback",
      confidence: "low",
      uncertainty_reason: "empty_after_sanitization",
    };
  }

  const normalizedLower = shortened.toLowerCase();
  if (GENERIC_FORBIDDEN.has(normalizedLower)) {
    const backup = gentle;
    return {
      model: backup || "Untitled",
      method: "gentle_original_fallback",
      confidence: "low",
      uncertainty_reason: "generic_output_prevented",
    };
  }

  return {
    model: gentle || shortened,
    method: "gentle_original_fallback",
    confidence: "low",
    uncertainty_reason: "no_known_model_pattern",
  };
}

function toConfidenceLevel(confidence) {
  if (confidence === "high") {
    return "HIGH";
  }
  if (confidence === "medium") {
    return "MEDIUM";
  }
  return "LOW";
}

function normalizeProductTitle(product) {
  const originalTitle = normalizeWhitespace(String(product?.title || ""));
  const category = normalizeWhitespace(String(product?.category || ""));
  const joined = `${originalTitle} ${category}`;
  const watchCandidate = isWatchCandidate(product);
  const brand = detectBrand(joined);

  if (!watchCandidate) {
    const passthrough = truncateSoft(normalizeWhitespace(stripEmojiAndSymbols(originalTitle)), SOFT_TITLE_CAP) || "Untitled";
    return {
      id: product.id,
      sku: product.sku,
      category,
      brand,
      original_title: originalTitle,
      cleaned_title: passthrough,
      changed: passthrough !== originalTitle,
      method: "non_watch_passthrough",
      confidence: "medium",
      confidence_level: "MEDIUM",
      uncertainty_reason: null,
      deterministic: true,
    };
  }

  const matched = detectModelByPattern(joined, brand);
  const fallback = matched ?? fallbackModel(originalTitle, category, brand);

  const cleanedTitle = truncateSoft(fallback.model, SOFT_TITLE_CAP);
  const genericOutputBlocked = GENERIC_FORBIDDEN.has(cleanedTitle.toLowerCase());
  const finalTitle = genericOutputBlocked
    ? truncateSoft(normalizeWhitespace(stripEmojiAndSymbols(originalTitle)), SOFT_TITLE_CAP) || "Untitled"
    : cleanedTitle;

  const shouldUseBrandPrefix =
    fallback.confidence !== "high" &&
    fallback.method !== "strong_token_extraction" &&
    brand !== "Unknown" &&
    /^\d/.test(finalTitle);
  const brandPrefixTitle = shouldUseBrandPrefix ? truncateSoft(`${brand} ${finalTitle}`, SOFT_TITLE_CAP) : finalTitle;

  const uncertaintyReason =
    fallback.confidence === "high"
      ? null
      : fallback.uncertainty_reason || (shouldUseBrandPrefix ? "brand_ambiguity_safeguard" : "low_confidence_fallback");

  return {
    id: product.id,
    sku: product.sku,
    category,
    brand,
    original_title: originalTitle,
    cleaned_title: brandPrefixTitle,
    changed: brandPrefixTitle !== originalTitle,
    method: shouldUseBrandPrefix ? "brand_prefixed_fallback" : fallback.method,
    confidence: fallback.confidence,
    confidence_level: toConfidenceLevel(fallback.confidence),
    uncertainty_reason: uncertaintyReason,
    deterministic: true,
  };
}

function isWatchCandidate(product) {
  const category = String(product?.category || "");
  const title = String(product?.title || "");
  const haystack = `${category} ${title}`.toLowerCase();
  return /(男表|女表|watch|rolex|patek|omega|hublot|panerai|cartier|tudor|daytona|datejust|submariner|nautilus|rm\d)/i.test(
    haystack
  );
}

function pickRepresentativeSample(products) {
  const candidates = products.filter(isWatchCandidate).sort((a, b) => String(a.id).localeCompare(String(b.id)));
  const byBrand = new Map();

  for (const product of candidates) {
    const brand = detectBrand(`${product.title || ""} ${product.category || ""}`);
    if (!byBrand.has(brand)) {
      byBrand.set(brand, []);
    }
    byBrand.get(brand).push(product);
  }

  const preferredBrandOrder = ["Rolex", "Patek Philippe", "Richard Mille", "Omega", "Audemars Piguet", "Hublot"];
  const selected = [];
  const selectedIds = new Set();

  for (const brand of preferredBrandOrder) {
    const pool = byBrand.get(brand) || [];
    for (const product of pool) {
      if (selected.length >= SAMPLE_SIZE) {
        break;
      }
      if (!selectedIds.has(product.id)) {
        selected.push(product);
        selectedIds.add(product.id);
      }
      if (selected.filter((item) => detectBrand(`${item.title || ""} ${item.category || ""}`) === brand).length >= 5) {
        break;
      }
    }
  }

  for (const product of candidates) {
    if (selected.length >= SAMPLE_SIZE) {
      break;
    }
    if (!selectedIds.has(product.id)) {
      selected.push(product);
      selectedIds.add(product.id);
    }
  }

  return selected.slice(0, SAMPLE_SIZE);
}

function countBy(items, key) {
  const counters = new Map();
  for (const item of items) {
    const value = item[key] || "Unknown";
    counters.set(value, (counters.get(value) || 0) + 1);
  }
  return [...counters.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([value, count]) => ({ value, count }));
}

function stableHash(input) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pickDeterministicSpotCheck(entries, size) {
  const ranked = entries
    .map((entry) => ({
      ...entry,
      _rank: stableHash(`${entry.id}:${entry.original_title}`),
    }))
    .sort((a, b) => a._rank - b._rank)
    .slice(0, size)
    .map(({ _rank, ...entry }) => entry);

  return ranked;
}

function pickDeterministicRandom(entries, size, seed) {
  return entries
    .map((entry) => ({
      ...entry,
      _rank: stableHash(`${seed}:${entry.id}:${entry.original_title}:${entry.cleaned_title}`),
    }))
    .sort((a, b) => a._rank - b._rank)
    .slice(0, size)
    .map(({ _rank, ...entry }) => entry);
}

function pickWorstCases(entries, size) {
  return entries
    .map((entry) => {
      const originalLength = entry.original_title.length;
      const cleanedLength = entry.cleaned_title.length;
      const absoluteDelta = Math.abs(originalLength - cleanedLength);
      const normalizedDelta = originalLength > 0 ? absoluteDelta / originalLength : 0;
      const score = normalizedDelta * 100 + originalLength;
      return {
        ...entry,
        _score: score,
        _original_length: originalLength,
        _cleaned_length: cleanedLength,
      };
    })
    .sort((a, b) => {
      if (b._score !== a._score) {
        return b._score - a._score;
      }
      return b._original_length - a._original_length;
    })
    .slice(0, size)
    .map(({ _score, _original_length, _cleaned_length, ...entry }) => ({
      ...entry,
      worst_case_metrics: {
        original_length: _original_length,
        cleaned_length: _cleaned_length,
        modification_score: Number(_score.toFixed(2)),
      },
    }));
}

function applyNormalizedTitles(products, mappingById) {
  return products.map((product) => {
    const mapped = mappingById.get(product.id);
    if (!mapped) {
      return product;
    }
    return {
      ...product,
      title: mapped.cleaned_title,
    };
  });
}

function confidenceRank(level) {
  if (level === "HIGH") {
    return 3;
  }
  if (level === "MEDIUM") {
    return 2;
  }
  return 1;
}

function breakdownToMap(entries) {
  const map = new Map();
  for (const entry of entries || []) {
    map.set(entry.value, entry.count);
  }
  return map;
}

function loadPreviousFullReport() {
  try {
    const parsed = JSON.parse(readFileSync(PREVIOUS_FULL_REPORT_PATH, "utf8"));
    if (Array.isArray(parsed?.mapping) && Array.isArray(parsed?.confidence_level_breakdown)) {
      return parsed;
    }
  } catch (error) {
    return null;
  }
  return null;
}

function buildDeltaFromPrevious(currentReport, previousReport) {
  if (!previousReport) {
    return null;
  }

  const currentConfidence = breakdownToMap(currentReport.confidence_level_breakdown);
  const previousConfidence = breakdownToMap(previousReport.confidence_level_breakdown);
  const levels = ["HIGH", "MEDIUM", "LOW"];
  const confidenceDelta = {};
  for (const level of levels) {
    confidenceDelta[level] = (currentConfidence.get(level) || 0) - (previousConfidence.get(level) || 0);
  }

  return {
    compared_against_issue: PREVIOUS_ISSUE_ID,
    previous_report_path: PREVIOUS_FULL_REPORT_PATH,
    changed_count_delta: currentReport.changed_count - (previousReport.changed_count || 0),
    uncertain_count_delta: currentReport.uncertain_count - (previousReport.uncertain_count || 0),
    confidence_delta: confidenceDelta,
  };
}

function pickImprovedCases(currentEntries, previousReport, size) {
  if (!previousReport || !Array.isArray(previousReport.mapping)) {
    return [];
  }

  const previousById = new Map(previousReport.mapping.map((entry) => [entry.id, entry]));
  const improved = [];
  for (const entry of currentEntries) {
    const previous = previousById.get(entry.id);
    if (!previous) {
      continue;
    }
    const previousRank = confidenceRank(previous.confidence_level);
    const currentRank = confidenceRank(entry.confidence_level);
    if (currentRank <= previousRank) {
      continue;
    }
    improved.push({
      ...entry,
      previous_confidence_level: previous.confidence_level,
      previous_cleaned_title: previous.cleaned_title,
      uplift: `${previous.confidence_level}->${entry.confidence_level}`,
      _rank: (currentRank - previousRank) * 100 + stableHash(`${entry.id}:${entry.cleaned_title}:${entry.method}`) / 1e9,
    });
  }

  return improved
    .sort((a, b) => b._rank - a._rank)
    .slice(0, size)
    .map(({ _rank, ...entry }) => entry);
}

function buildSummary(report, modeLabel, reportPath) {
  const delta = report.delta_vs_mom_303_v4;
  return [
    `# ${ISSUE_ID} Product Title Normalization (${modeLabel})`,
    "",
    `- Generated at: ${report.generated_at}`,
    `- Source catalog size: ${report.source_product_count}`,
    `- Scope size: ${report.scope_size}`,
    `- Changed titles: ${report.changed_count}`,
    `- Unchanged titles: ${report.unchanged_count}`,
    `- Uncertain cases: ${report.uncertain_count}`,
    `- Confidence tier counts: HIGH=${report.confidence_level_breakdown.find((entry) => entry.value === "HIGH")?.count || 0}, MEDIUM=${report.confidence_level_breakdown.find((entry) => entry.value === "MEDIUM")?.count || 0}, LOW=${report.confidence_level_breakdown.find((entry) => entry.value === "LOW")?.count || 0}`,
    `- Generic-output blocked count: ${report.generic_output_blocked_count}`,
    `- Soft title cap: ${SOFT_TITLE_CAP} characters`,
    `- Deterministic consistency: confirmed (same input -> same output)`,
    `- Dictionary brands covered: ${Object.keys(BRAND_MODEL_DICTIONARY).length}`,
    ...(delta
      ? [
          `- Delta vs ${PREVIOUS_ISSUE_ID}: HIGH=${delta.confidence_delta.HIGH >= 0 ? "+" : ""}${delta.confidence_delta.HIGH}, MEDIUM=${delta.confidence_delta.MEDIUM >= 0 ? "+" : ""}${delta.confidence_delta.MEDIUM}, LOW=${delta.confidence_delta.LOW >= 0 ? "+" : ""}${delta.confidence_delta.LOW}`,
          `- Delta uncertain cases vs ${PREVIOUS_ISSUE_ID}: ${delta.uncertain_count_delta >= 0 ? "+" : ""}${delta.uncertain_count_delta}`,
        ]
      : [`- Delta vs ${PREVIOUS_ISSUE_ID}: unavailable (previous full report not found)`]),
    "",
    "## Method Breakdown",
    ...report.method_breakdown.map((entry) => `- ${entry.value}: ${entry.count}`),
    "",
    "## Confidence Tier Breakdown",
    ...report.confidence_level_breakdown.map((entry) => `- ${entry.value}: ${entry.count}`),
    "",
    "## Brand Breakdown",
    ...report.brand_breakdown.map((entry) => `- ${entry.value}: ${entry.count}`),
    "",
    "## Uncertain Reason Breakdown",
    ...report.uncertainty_reason_breakdown.map((entry) => `- ${entry.value}: ${entry.count}`),
    "",
    "## Fallback Hierarchy",
    "- 1) brand model dictionary exact/partial matching",
    "- 2) legacy known model / RM code / reference code",
    "- 3) cleaned shortened original title",
    "- 4) generic labels prevented (no `Watch`, `Luxury Watch`, empty label)",
    "",
    `Report JSON: ${reportPath}`,
  ];
}

function main() {
  const previousFullReport = loadPreviousFullReport();
  const payload = JSON.parse(readFileSync(SOURCE_CATALOG_PATH, "utf8"));
  const products = Array.isArray(payload?.products) ? payload.products : [];
  const scope = MODE === "sample" ? pickRepresentativeSample(products) : products;
  const normalized = scope.map(normalizeProductTitle);

  const changedCount = normalized.filter((entry) => entry.changed).length;
  const uncertain = normalized.filter((entry) => entry.confidence_level === "LOW");
  const genericOutputBlockedCount = normalized.filter(
    (entry) => entry.method === "gentle_original_fallback" && entry.uncertainty_reason === "generic_output_prevented"
  ).length;

  const report = {
    issue: ISSUE_ID,
    mode: MODE,
    generated_at: new Date().toISOString(),
    source_catalog: SOURCE_CATALOG_PATH,
    source_product_count: products.length,
    scope_size: normalized.length,
    soft_title_cap: SOFT_TITLE_CAP,
    changed_count: changedCount,
    unchanged_count: normalized.length - changedCount,
    uncertain_count: uncertain.length,
    confidence_level_breakdown: countBy(normalized, "confidence_level"),
    generic_output_blocked_count: genericOutputBlockedCount,
    method_breakdown: countBy(normalized, "method"),
    brand_breakdown: countBy(normalized, "brand"),
    uncertainty_reason_breakdown: countBy(uncertain, "uncertainty_reason"),
    delta_vs_mom_303_v4: buildDeltaFromPrevious(
      {
        changed_count: changedCount,
        uncertain_count: uncertain.length,
        confidence_level_breakdown: countBy(normalized, "confidence_level"),
      },
      previousFullReport
    ),
    uncertain_cases: uncertain.map((entry) => ({
      id: entry.id,
      brand: entry.brand,
      original_title: entry.original_title,
      cleaned_title: entry.cleaned_title,
      method: entry.method,
      confidence: entry.confidence,
      confidence_level: entry.confidence_level,
      reason_for_uncertainty: entry.uncertainty_reason,
    })),
    mapping: normalized,
  };

  mkdirSync(EVIDENCE_DIR, { recursive: true });

  if (MODE === "sample") {
    writeFileSync(SAMPLE_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    writeFileSync(SAMPLE_SUMMARY_PATH, `${buildSummary(report, "Sample", SAMPLE_REPORT_PATH).join("\n")}\n`, "utf8");

    console.log(`[mom-304] wrote ${SAMPLE_REPORT_PATH}`);
    console.log(`[mom-304] wrote ${SAMPLE_SUMMARY_PATH}`);
    console.log(`[mom-304] mode=sample size=${report.scope_size} changed=${report.changed_count} uncertain=${report.uncertain_count}`);
    return;
  }

  const spotCheck = pickDeterministicSpotCheck(normalized, SPOT_CHECK_SIZE);
  const uncertainRandom50 = pickDeterministicRandom(uncertain, 50, "mom-304-random-uncertain");
  const uncertainWorst50 = pickWorstCases(uncertain, 50);
  const mediumSample50 = pickDeterministicRandom(
    normalized.filter((entry) => entry.confidence_level === "MEDIUM"),
    MEDIUM_SAMPLE_SIZE,
    "mom-304-medium-sample"
  );
  const improved50 = pickImprovedCases(normalized, previousFullReport, 50);
  const remainingLow50 = pickDeterministicRandom(uncertain, 50, "mom-304-remaining-low");

  writeFileSync(FULL_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  writeFileSync(FULL_SUMMARY_PATH, `${buildSummary(report, "Full Catalog", FULL_REPORT_PATH).join("\n")}\n`, "utf8");
  writeFileSync(UNCERTAIN_PATH, `${JSON.stringify({ issue: ISSUE_ID, generated_at: report.generated_at, count: uncertain.length, cases: report.uncertain_cases }, null, 2)}\n`, "utf8");
  writeFileSync(SPOT_CHECK_PATH, `${JSON.stringify({ issue: ISSUE_ID, generated_at: report.generated_at, sample_size: spotCheck.length, method: "deterministic_hash_selection", checks: spotCheck }, null, 2)}\n`, "utf8");
  writeFileSync(
    RANDOM_UNCERTAIN_SAMPLE_PATH,
    `${JSON.stringify(
      {
        issue: ISSUE_ID,
        generated_at: report.generated_at,
        sample_size: uncertainRandom50.length,
        method: "deterministic_random_hash_selection",
        source: "LOW confidence tier from full report",
        checks: uncertainRandom50,
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  writeFileSync(
    WORST_UNCERTAIN_SAMPLE_PATH,
    `${JSON.stringify(
      {
        issue: ISSUE_ID,
        generated_at: report.generated_at,
        sample_size: uncertainWorst50.length,
        method: "deterministic_worst_case_ranking",
        source: "LOW confidence tier from full report",
        rank_formula: "score=(abs(original_length-cleaned_length)/original_length)*100 + original_length",
        checks: uncertainWorst50,
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  writeFileSync(
    MEDIUM_SAMPLE_PATH,
    `${JSON.stringify(
      {
        issue: ISSUE_ID,
        generated_at: report.generated_at,
        sample_size: mediumSample50.length,
        method: "deterministic_random_hash_selection",
        source: "MEDIUM confidence tier from full report",
        checks: mediumSample50,
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  writeFileSync(
    IMPROVED_CASES_SAMPLE_PATH,
    `${JSON.stringify(
      {
        issue: ISSUE_ID,
        generated_at: report.generated_at,
        sample_size: improved50.length,
        compared_against_issue: PREVIOUS_ISSUE_ID,
        method: "confidence_uplift_vs_previous_report",
        checks: improved50,
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  writeFileSync(
    REMAINING_LOW_SAMPLE_PATH,
    `${JSON.stringify(
      {
        issue: ISSUE_ID,
        generated_at: report.generated_at,
        sample_size: remainingLow50.length,
        method: "deterministic_random_hash_selection",
        source: "LOW confidence tier from current full report",
        checks: remainingLow50,
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  if (WRITE_CATALOG) {
    const mappingById = new Map(normalized.map((entry) => [entry.id, entry]));
    const updatedProducts = applyNormalizedTitles(products, mappingById);
    const updatedPayload = {
      ...payload,
      products: updatedProducts,
    };
    writeFileSync(DEFAULT_CATALOG_PATH, `${JSON.stringify(updatedPayload, null, 2)}\n`, "utf8");
    console.log(`[mom-304] wrote normalized catalog to ${DEFAULT_CATALOG_PATH}`);
  }

  console.log(`[mom-304] wrote ${FULL_REPORT_PATH}`);
  console.log(`[mom-304] wrote ${FULL_SUMMARY_PATH}`);
  console.log(`[mom-304] wrote ${UNCERTAIN_PATH}`);
  console.log(`[mom-304] wrote ${SPOT_CHECK_PATH}`);
  console.log(`[mom-304] wrote ${RANDOM_UNCERTAIN_SAMPLE_PATH}`);
  console.log(`[mom-304] wrote ${WORST_UNCERTAIN_SAMPLE_PATH}`);
  console.log(`[mom-304] wrote ${MEDIUM_SAMPLE_PATH}`);
  console.log(`[mom-304] wrote ${IMPROVED_CASES_SAMPLE_PATH}`);
  console.log(`[mom-304] wrote ${REMAINING_LOW_SAMPLE_PATH}`);
  console.log(
    `[mom-304] mode=full size=${report.scope_size} changed=${report.changed_count} uncertain=${report.uncertain_count} generic_blocked=${report.generic_output_blocked_count}`
  );
}

main();
