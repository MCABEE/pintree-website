/**
 * Pintree FAQ API Utilities
 * Connects to:
 * - https://api.places.mcabee.in/v1/faqs
 * - https://api.places.mcabee.in/v1/faqs/topics
 */

export const FAQ_API_BASE = "https://api.places.mcabee.in/v1";

/**
 * Fetch all FAQ topics
 * @returns {Promise<Array>} List of topics
 */
export async function getFaqTopics() {
  const res = await fetch(`${FAQ_API_BASE}/faqs/topics`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch FAQ topics (status ${res.status})`);
  }
  const json = await res.json();
  return json.data || [];
}

/**
 * Fetch all FAQs grouped by topic (with questions array)
 * Optionally supports query params:
 * - search: search term
 * - topicId: filter by specific topic
 * @param {object} [options]
 * @param {string} [options.search]
 * @param {string} [options.topicId]
 * @returns {Promise<Array>} List of topics with nested questions
 */
export async function getFaqs({ search, topicId } = {}) {
  const url = new URL(`${FAQ_API_BASE}/faqs`);
  if (search && search.trim()) {
    url.searchParams.set("search", search.trim());
  }
  if (topicId) {
    url.searchParams.set("topicId", topicId);
  }

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch FAQs (status ${res.status})`);
  }
  const json = await res.json();
  return json.data || [];
}

/**
 * Fetch a single FAQ question by ID
 * @param {string} id
 * @returns {Promise<object>} Question details
 */
export async function getFaqById(id) {
  const res = await fetch(`${FAQ_API_BASE}/faqs/${id}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch FAQ question (status ${res.status})`);
  }
  const json = await res.json();
  return json.data || null;
}

