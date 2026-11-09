/**
 * Pintree Support API Utilities
 * Connects to:
 * - https://api.places.mcabee.in/v1/support/topics
 * - https://api.places.mcabee.in/v1/support?page=1&limit=10
 * - https://api.places.mcabee.in/v1/support/slug/:slug
 */

export const SUPPORT_API_BASE = "https://api.places.mcabee.in/v1";

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
  const res = await fetch(`${SUPPORT_API_BASE}/support/topics`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch support topics (status ${res.status})`);
  }
  const json = await res.json();
  return json.data || [];
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
}

/**
 * Fetch a single support article by slug
 * @param {string} slug
 * @returns {Promise<object|null>}
 */
export async function getSupportArticleBySlug(slug) {
  if (!slug) return null;

  const res = await fetch(
    `${SUPPORT_API_BASE}/support/slug/${encodeURIComponent(slug)}`,
    {
      headers: { Accept: "application/json" },
    }
  );

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(
      `Failed to fetch support article with slug "${slug}" (status ${res.status})`
    );
  }

  const json = await res.json();
  return json.data || null;
}

