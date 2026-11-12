/**
 * Pintree Newsroom API Utilities
 * Connects to:
 * - https://api.places.mcabee.in/v1/news?page=1&limit=10
 * - https://api.places.mcabee.in/v1/news/slug/:slug
 */

import { PLACES_API_BASE } from "@/config/api";

export const NEWS_API_BASE = PLACES_API_BASE;

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

export const FALLBACK_ARTICLES = [
  {
    id: "cmw92pcr5002fo701swkr60r1",
    slug: "enhanced-privacy-controls-granular-audience-tiers-for-personal-profiles",
    title: "Enhanced privacy controls: Granular audience tiers for personal profiles",
    headline: "Enhanced privacy controls: Granular audience tiers for personal profiles",
    excerpt: "New privacy controls offer users more flexibility over who can view their personal profile information.",
    category: "Product Updates",
    categoryRaw: "PRODUCT_UPDATES",
    attribution: "Pintree Product Team",
    image: "https://image.pintree.co/1794217381538-hqdefault.jpg",
    imageAlt: "Enhanced privacy controls: Granular audience tiers for personal profiles",
    date: "Nov 9, 2026",
    dateTime: "2026-11-09",
  },
  {
    id: "cmw92izjb0021o701an5tw4rk",
    slug: "how-independent-book-clubs-and-creative-collectives-found-a-new-home-on-pintree",
    title: "How independent book clubs and creative collectives found a new home on Pintree",
    headline: "How independent book clubs and creative collectives found a new home on Pintree",
    excerpt: "Discover how independent book clubs and creative communities connect, collaborate and share their passions on Pintree.",
    category: "Stories",
    categoryRaw: "COMMUNITY_STORIES",
    attribution: "Pintree Community Team",
    image: "https://image.pintree.co/1794217082683-a92bdf90-dbbe-11f1-b441-2b33b063138f.jpg.webp",
    imageAlt: "How independent book clubs and creative collectives found a new home on Pintree",
    date: "Nov 9, 2026",
    dateTime: "2026-11-09",
  },
  {
    id: "cmw92aua4001uo701ftzlyuwz",
    slug: "pintree-appoints-elena-rostova-as-vice-president-of-community-integrity",
    title: "Pintree appoints Elena Rostova as Vice President of Community Integrity",
    headline: "Pintree appoints Elena Rostova as Vice President of Community Integrity",
    excerpt: "Pintree announces a new leadership appointment focused on community integrity and trust.",
    category: "Company News",
    categoryRaw: "COMPANY_NEWS",
    attribution: "Pintree Communications Team",
    image: "https://image.pintree.co/1794216704400-apple_news-local-expansion_hero_10262021_big.jpg.large_2x.jpg",
    imageAlt: "Pintree appoints Elena Rostova as Vice President of Community Integrity",
    date: "Nov 9, 2026",
    dateTime: "2026-11-09",
  },
  {
    id: "cmw926wgn001jo701y13kitmy",
    slug: "introducing-focused-rooms-intimate-topic-spaces-within-larger-communities",
    title: "Introducing Focused Rooms: Intimate topic spaces within larger communities",
    headline: "Introducing Focused Rooms: Intimate topic spaces within larger communities",
    excerpt: "Discover Focused Rooms, dedicated spaces for meaningful discussions within larger communities.",
    category: "Product Updates",
    categoryRaw: "PRODUCT_UPDATES",
    attribution: "Pintree Product Team",
    image: "https://image.pintree.co/1794216520676-kyrmhas_1701182285359_1709622176270.webp",
    imageAlt: "Introducing Focused Rooms: Intimate topic spaces within larger communities",
    date: "Nov 9, 2026",
    dateTime: "2026-11-09",
  },
  {
    id: "cmw62nxwu0002s901x9sf9hp1",
    slug: "introducing-pintree-s-new-privacy-dashboard",
    title: "Introducing Pintree's New Privacy Dashboard",
    headline: "Introducing Pintree's New Privacy Dashboard",
    excerpt: "A redesigned privacy dashboard gives users greater control and transparency.",
    category: "Product Updates",
    categoryRaw: "PRODUCT_UPDATES",
    attribution: "Pintree Product Team",
    image: "https://image.pintree.co/1794035915605-foodio_delivery_app_showcase.png",
    imageAlt: "Introducing Pintree's New Privacy Dashboard",
    date: "Nov 7, 2026",
    dateTime: "2026-11-07",
  },
  {
    id: "cmw60xb5k0000ld9kbgebxghh",
    slug: "expanding-decentralized-communities-across-40-metropolitan-hubs",
    title: "Expanding Decentralized Communities Across 40+ Metropolitan Hubs",
    headline: "Expanding Decentralized Communities Across 40+ Metropolitan Hubs",
    excerpt: "Pintree expands localized privacy nodes across forty core metropolises.",
    category: "Announcements",
    categoryRaw: "ANNOUNCEMENTS",
    attribution: "Pintree Editorial Team & Ops",
    image: "https://image.pintree.co/1794032742692-vanta_luxury_jewelry_platform_showcase.png",
    imageAlt: "Expanding Decentralized Communities Across 40+ Metropolitan Hubs",
    date: "Nov 7, 2026",
    dateTime: "2026-11-07",
  },
];

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
  if (!article) return "1 min read";

  // If the article or API already provides an explicit read time, honor it
  if (typeof article.readTime === "string" && article.readTime.trim()) {
    return article.readTime.includes("min read")
      ? article.readTime
      : `${article.readTime} min read`;
  }
  if (typeof article.readingTime === "string" && article.readingTime.trim()) {
    return article.readingTime.includes("min read")
      ? article.readingTime
      : `${article.readingTime} min read`;
  }
  if (typeof article.readingTime === "number" && article.readingTime > 0) {
    return `${article.readingTime} min read`;
  }

  let wordCount = 0;
  const countWords = (text) => {
    if (!text || typeof text !== "string") return 0;
    const clean = text.replace(/<[^>]*>/g, " ").trim();
    return clean ? clean.split(/\s+/).length : 0;
  };

  wordCount += countWords(article.headline || article.title);
  wordCount += countWords(article.excerpt || article.summary);
  wordCount += countWords(article.lead);
  wordCount += countWords(article.content || article.body);

  if (Array.isArray(article.paragraphs)) {
    for (const p of article.paragraphs) {
      wordCount += countWords(p);
    }
  }

  if (Array.isArray(article.blocks)) {
    for (const b of article.blocks) {
      wordCount += countWords(b?.text);
      if (Array.isArray(b?.items)) {
        for (const it of b.items) {
          wordCount += countWords(it?.text || it?.title);
        }
      }
    }
  }

  if (Array.isArray(article.sections)) {
    for (const s of article.sections) {
      wordCount += countWords(s?.heading);
      wordCount += countWords(s?.intro);
      wordCount += countWords(s?.text);
      if (Array.isArray(s?.paragraphs)) {
        for (const p of s.paragraphs) {
          wordCount += countWords(p);
        }
      }
      if (Array.isArray(s?.items)) {
        for (const it of s.items) {
          wordCount += countWords(it?.title);
          wordCount += countWords(it?.text);
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

