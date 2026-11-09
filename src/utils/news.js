/**
 * Pintree Newsroom API Utilities
 * Connects to:
 * - https://api.places.mcabee.in/v1/news?page=1&limit=10
 * - https://api.places.mcabee.in/v1/news/slug/:slug
 */

export const NEWS_API_BASE = "https://api.places.mcabee.in/v1";

export const CATEGORY_MAP = {
  "All News": "",
  Announcements: "ANNOUNCEMENTS",
  "Product Updates": "PRODUCT_UPDATES",
  "Company News": "COMPANY_NEWS",
  Stories: "COMMUNITY_STORIES",
};

export const REVERSE_CATEGORY_MAP = {
  ANNOUNCEMENTS: "Announcements",
  PRODUCT_UPDATES: "Product Updates",
  COMPANY_NEWS: "Company News",
  COMMUNITY_STORIES: "Stories",
};

/**
 * Format raw category enum to human readable label
 * @param {string} cat
 * @returns {string}
 */
export function formatCategory(cat) {
  if (!cat) return "News";
  if (REVERSE_CATEGORY_MAP[cat]) return REVERSE_CATEGORY_MAP[cat];
  return cat
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Format ISO date string into readable date (e.g. "Nov 9, 2026")
 * @param {string} isoString
 * @returns {string}
 */
export function formatDate(isoString) {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

/**
 * Format ISO date string into YYYY-MM-DD
 * @param {string} isoString
 * @returns {string}
 */
export function formatDateTime(isoString) {
  if (!isoString) return "";
  return isoString.split("T")[0];
}

/**
 * Format date string into "Month Year" (e.g. "November 2026")
 * @param {string} isoOrFormatted
 * @returns {string}
 */
export function monthYear(isoOrFormatted) {
  if (!isoOrFormatted) return "";
  try {
    const d = new Date(isoOrFormatted);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }
  } catch {
    // fallback
  }
  const parts = String(isoOrFormatted).split(" ");
  if (parts.length >= 3) {
    return `${parts[0]} ${parts[parts.length - 1]}`;
  }
  return isoOrFormatted;
}

/**
 * Estimate reading time in minutes
 * @param {string|Array} content
 * @returns {string}
 */
export function estimateReadTime(article) {
  let wordCount = 0;
  if (article.excerpt) wordCount += article.excerpt.split(/\s+/).length;
  if (article.headline) wordCount += article.headline.split(/\s+/).length;
  if (Array.isArray(article.blocks)) {
    for (const b of article.blocks) {
      if (b.text) wordCount += b.text.split(/\s+/).length;
      if (Array.isArray(b.items)) {
        for (const it of b.items) {
          if (it.text) wordCount += it.text.split(/\s+/).length;
        }
      }
    }
  }
  const minutes = Math.max(1, Math.ceil(wordCount / 180));
  return `${minutes} min read`;
}

/**
 * Normalizes an API article object to match the component schema
 * @param {object} apiArticle
 * @returns {object}
 */
export function normalizeArticle(apiArticle) {
  if (!apiArticle) return null;

  return {
    id: apiArticle.id,
    slug: apiArticle.slug,
    title: apiArticle.headline || apiArticle.title || "",
    headline: apiArticle.headline || apiArticle.title || "",
    excerpt: apiArticle.excerpt || apiArticle.summary || "",
    summary: apiArticle.excerpt || apiArticle.summary || "",
    category: formatCategory(apiArticle.category),
    categoryRaw: apiArticle.category || "",
    attribution: apiArticle.attribution || "Pintree Team",
    author: apiArticle.attribution || "Pintree Team",
    authorImage:
      apiArticle.authorImage ||
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAd-M9VIRpFx1-cPl3w6Mp71Y4hbomr1Mp9lIe5qY5A2IvDd4C_J5t8gq9r3gNLt3L2wtgUxQKxbsHM6rDlIyO49kjXO2hIghyXZzO43lHb1Js4j7pfTIkuOU3aWkdRgfDjfsBvnAVeOR_tZ10Qw9GaJ_j5rb-M5mVV-dyYtlv-n9fwAC35H6D6Cw71pEpgVdjYopvkwz8wGVzIIw8TEqJnsBwGbVSZ3KUTu65eSd1dMWA7e2CkdJsO",
    image:
      apiArticle.heroImageUrl ||
      apiArticle.image ||
      "https://image.pintree.co/1794032742692-vanta_luxury_jewelry_platform_showcase.png",
    heroImageUrl: apiArticle.heroImageUrl || apiArticle.image || "",
    imageAlt: apiArticle.headline || apiArticle.title || "",
    caption: apiArticle.caption || "",
    date: formatDate(apiArticle.publishedAt || apiArticle.createdAt),
    dateTime: formatDateTime(apiArticle.publishedAt || apiArticle.createdAt),
    publishedAt: apiArticle.publishedAt,
    readTime: estimateReadTime(apiArticle),
    blocks: apiArticle.blocks || null,
    // Preserve legacy fields if present
    lead: apiArticle.lead || null,
    paragraphs: apiArticle.paragraphs || null,
    sections: apiArticle.sections || null,
  };
}

/**
 * Fetch news articles list with pagination, category filter and search
 * @param {object} [options]
 * @param {number} [options.page=1]
 * @param {number} [options.limit=10]
 * @param {string} [options.category]
 * @param {string} [options.search]
 * @returns {Promise<{ articles: Array, total: number, page: number, limit: number, totalPages: number }>}
 */
export async function getNews({
  page = 1,
  limit = 10,
  category,
  search,
} = {}) {
  const url = new URL(`${NEWS_API_BASE}/news`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));

  if (category && category !== "All News") {
    const rawCategory = CATEGORY_MAP[category] || category;
    if (rawCategory) {
      url.searchParams.set("category", rawCategory);
    }
  }

  if (search && search.trim()) {
    url.searchParams.set("search", search.trim());
  }

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch news articles (status ${res.status})`);
  }

  const json = await res.json();
  const rawData = json.data || {};
  const rawArticles = rawData.articles || [];

  return {
    articles: rawArticles.map(normalizeArticle),
    total: rawData.total ?? rawArticles.length,
    page: rawData.page ?? page,
    limit: rawData.limit ?? limit,
    totalPages: rawData.totalPages ?? 1,
  };
}

/**
 * Fetch a single news article by slug
 * @param {string} slug
 * @returns {Promise<object|null>}
 */
export async function getNewsBySlug(slug) {
  if (!slug) return null;

  const res = await fetch(
    `${NEWS_API_BASE}/news/slug/${encodeURIComponent(slug)}`,
    {
      headers: { Accept: "application/json" },
    }
  );

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(
      `Failed to fetch article with slug "${slug}" (status ${res.status})`
    );
  }

  const json = await res.json();
  return normalizeArticle(json.data);
}

