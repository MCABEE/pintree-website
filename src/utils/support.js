/**
 * Pintree Support API Utilities
 * Connects to:
 * - https://api.places.mcabee.in/v1/support/topics
 * - https://api.places.mcabee.in/v1/support?page=1&limit=100
 * - https://api.places.mcabee.in/v1/support/slug/:slug
 */

import { PLACES_API_BASE } from "@/config/api";

export const SUPPORT_API_BASE = PLACES_API_BASE;

export const FALLBACK_TOPICS = [
  {
    id: "cmw65hs5w0000ldu4b2k0y37w",
    heading: "Getting Started",
    subHeading: "Learn the basics of using Pintree.",
    sortOrder: 1,
    isActive: true,
    articleCount: 8,
  },
  {
    id: "cmw65hsax0001ldu4qkq7soxn",
    heading: "Accounts & Profiles",
    subHeading: "Manage your account, profile and personal information.",
    sortOrder: 2,
    isActive: true,
    articleCount: 8,
  },
  {
    id: "cmw65hshd0003ldu4v71gu62e",
    heading: "Connections & Privacy",
    subHeading: "Manage connections, friends and privacy settings.",
    sortOrder: 4,
    isActive: true,
    articleCount: 5,
  },
  {
    id: "cmw65hskn0004ldu4icnwv1hk",
    heading: "News & Media",
    subHeading: "Explore news, publications and media content on Pintree.",
    sortOrder: 5,
    isActive: true,
    articleCount: 3,
  },
];

export const FALLBACK_ARTICLES = [
  // Getting Started (9 articles)
  {
    id: "cmw6ate8i0001o7017u6bxy7v",
    topicId: "cmw65hs5w0000ldu4b2k0y37w",
    headline: "How Local Communities Are Building Meaningful Connections on Pintree",
    slug: "how-local-communities-are-building-meaningful-connections-on-pintree",
    excerpt: "Discover how communities are bringing people together through shared interests, collaboration and meaningful conversations",
    publishedAt: "2026-11-07T11:06:49.552Z",
    updatedAt: "2026-11-07T11:20:50.689Z",
  },
  {
    id: "cmw94zyaw0033o701xsujtme7",
    topicId: "cmw65hs5w0000ldu4b2k0y37w",
    headline: "Creating your Pintree account",
    slug: "creating-your-pintree-account",
    excerpt: "Learn how to create your Pintree account and get started.",
    publishedAt: "2026-11-09T10:47:16.326Z",
    updatedAt: "2026-11-09T10:57:24.338Z",
  },
  {
    id: "cmw950y0b003eo70152nmqjy1",
    topicId: "cmw65hs5w0000ldu4b2k0y37w",
    headline: "Logging in and managing your password",
    slug: "logging-in-and-managing-your-password",
    excerpt: "Learn how to sign in securely and manage your Pintree password.",
    publishedAt: "2026-11-09T10:48:02.599Z",
    updatedAt: "2026-11-09T10:58:30.689Z",
  },
  {
    id: "cmw95211s003yo701cxsrodwa",
    topicId: "cmw65hs5w0000ldu4b2k0y37w",
    headline: "Changing your username",
    slug: "changing-your-username",
    excerpt: "Learn how to update your username and maintain your identity on Pintree.",
    publishedAt: "2026-11-09T10:48:53.199Z",
    updatedAt: "2026-11-09T10:48:53.201Z",
  },
  {
    id: "cmw952d9l004ao701jj5yj6kv",
    topicId: "cmw65hs5w0000ldu4b2k0y37w",
    headline: "Managing account visibility",
    slug: "managing-account-visibility",
    excerpt: "Understand how to manage who can discover and view your Pintree profile.",
    publishedAt: "2026-11-09T10:49:09.031Z",
    updatedAt: "2026-11-09T10:49:09.033Z",
  },
  {
    id: "cmw952mps004lo701pn2r14s1",
    topicId: "cmw65hs5w0000ldu4b2k0y37w",
    headline: "Deactivating or deleting your account",
    slug: "deactivating-or-deleting-your-account",
    excerpt: "Understand the difference between deactivating and permanently deleting your Pintree account.",
    publishedAt: "2026-11-09T10:49:21.277Z",
    updatedAt: "2026-11-09T10:49:21.279Z",
  },
  {
    id: "cmw952zjs004xo701jj0929sg",
    topicId: "cmw65hs5w0000ldu4b2k0y37w",
    headline: "How to reset your password",
    slug: "how-to-reset-your-password",
    excerpt: "Follow this step-by-step guide to recover access to your Pintree account.",
    publishedAt: "2026-11-09T10:49:37.911Z",
    updatedAt: "2026-11-09T10:49:37.912Z",
  },
  {
    id: "cmw9536b50058o701p7cpeigh",
    topicId: "cmw65hs5w0000ldu4b2k0y37w",
    headline: "Updating your email address and phone number",
    slug: "updating-email-address-and-phone-number",
    excerpt: "Learn how to update the contact details associated with your Pintree account.",
    publishedAt: "2026-11-09T10:49:46.672Z",
    updatedAt: "2026-11-09T10:49:46.674Z",
  },

  // Accounts & Profiles (8 articles)
  {
    id: "cmw953fcv005jo701erv49awa",
    topicId: "cmw65hsax0001ldu4qkq7soxn",
    headline: "Following and unfollowing people",
    slug: "following-and-unfollowing-people",
    excerpt: "Learn how to follow people and manage the profiles you want to stay connected with.",
    publishedAt: "2026-11-09T10:49:58.398Z",
    updatedAt: "2026-11-09T10:49:58.400Z",
  },
  {
    id: "cmw953m8u005to7017m4782ao",
    topicId: "cmw65hsax0001ldu4qkq7soxn",
    headline: "Understanding followers and friends",
    slug: "understanding-followers-and-friends",
    excerpt: "Understand the difference between followers, following and friends on Pintree.",
    publishedAt: "2026-11-09T10:50:07.323Z",
    updatedAt: "2026-11-09T10:50:07.326Z",
  },
  {
    id: "cmw954glh0063o7017rxg9nbe",
    topicId: "cmw65hsax0001ldu4qkq7soxn",
    headline: "Managing follow requests",
    slug: "managing-follow-requests",
    excerpt: "Learn how to review and manage incoming follow requests.",
    publishedAt: "2026-11-09T10:50:46.660Z",
    updatedAt: "2026-11-09T10:50:46.661Z",
  },
  {
    id: "cmw954qmf006eo7013gju4d4g",
    topicId: "cmw65hsax0001ldu4qkq7soxn",
    headline: "Creating and managing Circles",
    slug: "creating-and-managing-circles",
    excerpt: "Discover how to organize your connections using Circles on Pintree.",
    publishedAt: "2026-11-09T10:50:59.653Z",
    updatedAt: "2026-11-09T10:50:59.655Z",
  },
  {
    id: "cmw9550w0006qo701i3ld2mi2",
    topicId: "cmw65hsax0001ldu4qkq7soxn",
    headline: "Controlling who sees your posts",
    slug: "controlling-who-sees-your-posts",
    excerpt: "Learn how to manage the audience and visibility of your Pintree posts.",
    publishedAt: "2026-11-09T10:51:12.958Z",
    updatedAt: "2026-11-09T10:51:12.960Z",
  },
  {
    id: "cmw9557iq0071o701osmoubk7",
    topicId: "cmw65hsax0001ldu4qkq7soxn",
    headline: "Blocking and managing users",
    slug: "blocking-and-managing-users",
    excerpt: "Learn how to block unwanted interactions and manage restricted accounts.",
    publishedAt: "2026-11-09T10:51:21.552Z",
    updatedAt: "2026-11-09T10:51:21.554Z",
  },
  {
    id: "cmw955e8v007co701plqza3fw",
    topicId: "cmw65hsax0001ldu4qkq7soxn",
    headline: "Finding and connecting with people",
    slug: "finding-and-connecting-with-people",
    excerpt: "Discover ways to find people and build meaningful connections on Pintree.",
    publishedAt: "2026-11-09T10:51:30.269Z",
    updatedAt: "2026-11-09T10:51:30.271Z",
  },
  {
    id: "cmw955lk0007oo701l1x5ox9a",
    topicId: "cmw65hsax0001ldu4qkq7soxn",
    headline: "Managing your connection list",
    slug: "managing-your-connection-list",
    excerpt: "Learn how to review, organize and maintain your Pintree connections.",
    publishedAt: "2026-11-09T10:51:39.742Z",
    updatedAt: "2026-11-09T10:51:39.744Z",
  },

  // Connections & Privacy (5 articles)
  {
    id: "cmw95aety007zo701udpur5md",
    topicId: "cmw65hshd0003ldu4v71gu62e",
    headline: "Managing your privacy settings",
    slug: "managing-your-privacy-settings",
    excerpt: "Learn how to manage your privacy preferences and control your information on Pintree.",
    publishedAt: "2026-11-09T10:55:24.308Z",
    updatedAt: "2026-11-09T10:55:24.310Z",
  },
  {
    id: "cmw95asof008bo7018lk2iyyb",
    topicId: "cmw65hshd0003ldu4v71gu62e",
    headline: "Controlling who can send you connection requests",
    slug: "controlling-connection-requests",
    excerpt: "Understand how to manage incoming connection requests and relationship preferences.",
    publishedAt: "2026-11-09T10:55:42.254Z",
    updatedAt: "2026-11-09T10:55:42.255Z",
  },
  {
    id: "cmw95b1uh008mo701awgpdnv0",
    topicId: "cmw65hshd0003ldu4v71gu62e",
    headline: "Understanding public and private profiles",
    slug: "understanding-public-and-private-profiles",
    excerpt: "Learn how public and private profile visibility affects your Pintree experience.",
    publishedAt: "2026-11-09T10:55:54.136Z",
    updatedAt: "2026-11-09T10:55:54.137Z",
  },
  {
    id: "cmw95b7ym008wo701syli6zga",
    topicId: "cmw65hshd0003ldu4v71gu62e",
    headline: "Managing blocked users",
    slug: "managing-blocked-users",
    excerpt: "Learn how to review and manage accounts you have blocked on Pintree.",
    publishedAt: "2026-11-09T10:56:02.058Z",
    updatedAt: "2026-11-09T10:56:02.062Z",
  },
  {
    id: "cmw95bhbd0098o701oxnxm7um",
    topicId: "cmw65hshd0003ldu4v71gu62e",
    headline: "Controlling profile information visibility",
    slug: "controlling-profile-information-visibility",
    excerpt: "Discover how to manage the visibility of personal information on your profile.",
    publishedAt: "2026-11-09T10:56:14.183Z",
    updatedAt: "2026-11-09T10:56:14.185Z",
  },

  // News & Media (3 articles)
  {
    id: "cmw95bpo8009jo7013y56nqif",
    topicId: "cmw65hskn0004ldu4icnwv1hk",
    headline: "Exploring news and publications on Pintree",
    slug: "exploring-news-and-publications-on-pintree",
    excerpt: "Discover how to explore news articles, publications and updates on Pintree.",
    publishedAt: "2026-11-09T10:56:25.015Z",
    updatedAt: "2026-11-09T10:56:25.017Z",
  },
  {
    id: "cmw95by2s009uo701gwgevu0k",
    topicId: "cmw65hskn0004ldu4icnwv1hk",
    headline: "Finding the latest Pintree announcements",
    slug: "finding-the-latest-pintree-announcements",
    excerpt: "Learn where to find official announcements and important Pintree updates.",
    publishedAt: "2026-11-09T10:56:35.906Z",
    updatedAt: "2026-11-09T10:56:35.908Z",
  },
  {
    id: "cmw95c6d000a5o7018zha7e8h",
    topicId: "cmw65hskn0004ldu4icnwv1hk",
    headline: "Understanding news categories",
    slug: "understanding-news-categories",
    excerpt: "Understand how news categories organize articles and publications on Pintree.",
    publishedAt: "2026-11-09T10:56:46.641Z",
    updatedAt: "2026-11-09T10:56:46.644Z",
  },
];

/**
 * Converts a topic heading or object into a URL-friendly slug
 * e.g. "Getting Started" -> "getting-started"
 *      "Accounts & Profiles" -> "accounts-and-profiles"
 */
export function getTopicSlug(topicOrHeading) {
  if (!topicOrHeading) return "";
  const heading =
    typeof topicOrHeading === "string"
      ? topicOrHeading
      : topicOrHeading.heading || topicOrHeading.id || "";
  return heading
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Normalizes a topic slug/name for tolerant matching
 */
function normalizeKey(str = "") {
  return str
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/and/g, "")
    .replace(/[^a-z0-9]/g, "")
    .replace(/s+/g, "");
}

/**
 * Resolves a topic by either ID, exact slug, or tolerant name matching
 */
export async function getTopicBySlugOrId(slugOrId) {
  if (!slugOrId) return null;
  const norm = slugOrId.toLowerCase().trim();

  let topics = [];
  try {
    topics = await getSupportTopics();
  } catch (err) {
    console.warn("Using fallback topics in getTopicBySlugOrId:", err.message);
    topics = FALLBACK_TOPICS;
  }
  if (!topics || topics.length === 0) {
    topics = FALLBACK_TOPICS;
  }

  // 1. Direct ID match
  let match = topics.find((t) => t.id && t.id.toLowerCase() === norm);
  if (match) return match;

  // 2. Direct slug match
  match = topics.find((t) => getTopicSlug(t) === norm);
  if (match) return match;

  // 3. Relaxed / fuzzy slug match (e.g. account-and-profile vs accounts-and-profiles)
  const key = normalizeKey(norm);
  match = topics.find((t) => {
    return (
      normalizeKey(t.heading) === key ||
      normalizeKey(getTopicSlug(t)) === key ||
      normalizeKey(t.id) === key
    );
  });

  return match || null;
}

/**
 * Format relative time string from ISO date string
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return "Recently updated";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Recently updated";

  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - date.getTime());
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffDays < 1) return "Updated today";
  if (diffDays === 1) return "Updated yesterday";
  if (diffDays < 7) return `Updated ${diffDays} days ago`;
  if (diffWeeks < 4) return `Updated ${diffWeeks} ${diffWeeks === 1 ? "week" : "weeks"} ago`;
  if (diffMonths < 12) return `Updated ${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`;
  return `Updated ${diffYears} ${diffYears === 1 ? "year" : "years"} ago`;
}

/**
 * Estimate read time from article text or excerpt
 */
export function estimateReadTime(text = "") {
  if (!text) return "2 min read";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(2, Math.min(8, Math.ceil(words / 40)));
  return `${minutes} min read`;
}

/**
 * Maps topic heading to an icon identifier used in HelpCenterView
 * @param {string} heading
 * @returns {"user"|"people"|"grid"|"star"|"shield"|"settings"}
 */
export function getTopicIcon(heading = "") {
  const lower = heading.toLowerCase();
  if (lower.includes("account") || lower.includes("profile")) return "user";
  if (lower.includes("people") || lower.includes("communit") || lower.includes("room")) return "people";
  if (lower.includes("news") || lower.includes("media") || lower.includes("discover")) return "grid";
  if (lower.includes("start") || lower.includes("basics")) return "star";
  if (lower.includes("privacy") || lower.includes("safety") || lower.includes("security")) return "shield";
  return "settings";
}

/**
 * Fetch all support topics
 * @returns {Promise<Array>} List of topics
 */
export async function getSupportTopics() {
  try {
    const res = await fetch(`${SUPPORT_API_BASE}/support/topics`, {
      headers: { Accept: "application/json" },
      // Optional next revalidation cache
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch support topics (status ${res.status})`);
    }
    const json = await res.json();
    return json.data || FALLBACK_TOPICS;
  } catch (err) {
    console.warn("getSupportTopics falling back to local topics:", err.message);
    return FALLBACK_TOPICS;
  }
}

/**
 * Fetch support articles list with pagination, topic filter and search
 * @param {object} [options]
 * @param {number} [options.page=1]
 * @param {number} [options.limit=100]
 * @param {string} [options.topicId]
 * @param {string} [options.search]
 * @returns {Promise<{ articles: Array, total: number, page: number, limit: number, totalPages: number }>}
 */
export async function getSupportArticles({
  page = 1,
  limit = 100,
  topicId,
  search,
} = {}) {
  try {
    const url = new URL(`${SUPPORT_API_BASE}/support`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));

    if (topicId) {
      url.searchParams.set("topicId", topicId);
    }

    if (search && search.trim()) {
      url.searchParams.set("search", search.trim());
    }

    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch support articles (status ${res.status})`);
    }

    const json = await res.json();
    const rawData = json.data || {};
    return {
      articles: rawData.articles || [],
      total: rawData.total ?? (rawData.articles || []).length,
      page: rawData.page ?? page,
      limit: rawData.limit ?? limit,
      totalPages: rawData.totalPages ?? 1,
    };
  } catch (err) {
    console.warn("getSupportArticles falling back to local articles:", err.message);
    let filtered = FALLBACK_ARTICLES;
    if (topicId) {
      filtered = filtered.filter((a) => a.topicId === topicId);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.headline.toLowerCase().includes(q) ||
          (a.excerpt && a.excerpt.toLowerCase().includes(q))
      );
    }
    return {
      articles: filtered,
      total: filtered.length,
      page: 1,
      limit,
      totalPages: 1,
    };
  }
}

/**
 * Fetch a single support article by slug
 * @param {string} slug
 * @returns {Promise<object|null>}
 */
export async function getSupportArticleBySlug(slug) {
  if (!slug) return null;

  try {
    const res = await fetch(
      `${SUPPORT_API_BASE}/support/slug/${encodeURIComponent(slug)}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        // Check fallback articles
        const fallback = FALLBACK_ARTICLES.find((a) => a.slug === slug);
        return fallback || null;
      }
      throw new Error(
        `Failed to fetch support article with slug "${slug}" (status ${res.status})`
      );
    }

    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.warn(`getSupportArticleBySlug for "${slug}" falling back:`, err.message);
    const fallback = FALLBACK_ARTICLES.find((a) => a.slug === slug);
    return fallback || null;
  }
}
