import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import SupportArticleView from "../SupportArticleView";
import SupportTopicView from "../SupportTopicView";
import {
  getSupportArticleBySlug,
  getSupportArticles,
  getSupportTopics,
  getTopicBySlugOrId,
} from "@/utils/support";

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const [articlesRes, topicsRes] = await Promise.all([
      getSupportArticles({ limit: 50 }),
      getSupportTopics(),
    ]);
    const articleSlugs = (articlesRes.articles || []).map((a) => ({
      slug: a.slug,
    }));
    return articleSlugs;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const article = await getSupportArticleBySlug(slug);
    if (article) {
      return {
        title: `${article.headline} | Pintree Help Center`,
        description: article.excerpt || article.headline,
      };
    }

    const topic = await getTopicBySlugOrId(slug);
    if (topic) {
      return {
        title: `${topic.heading} — Pintree Help Center`,
        description:
          topic.subHeading ||
          `Help articles and documentation for ${topic.heading} on Pintree.`,
      };
    }

    return { title: "Help Center | Pintree" };
  } catch {
    return { title: "Help Center | Pintree" };
  }
}

export default async function SupportSlugPage({ params }) {
  const { slug } = await params;

  // 1. Check if slug matches an article
  let article = null;
  try {
    article = await getSupportArticleBySlug(slug);
  } catch (err) {
    console.error(`Error loading support article ${slug}:`, err);
  }

  if (article) {
    let topicName = "";
    let related = [];

    try {
      const topics = await getSupportTopics();
      const topic = (topics || []).find((t) => t.id === article.topicId);
      if (topic) {
        topicName = topic.heading;
      }

      if (article.topicId) {
        const relRes = await getSupportArticles({
          topicId: article.topicId,
          limit: 4,
        });
        related = (relRes.articles || [])
          .filter((a) => a.slug !== slug)
          .slice(0, 3);
      }
    } catch (err) {
      console.error("Failed to load topic or related articles:", err);
    }

    return (
      <div className="min-h-screen bg-white text-[#525252] selection:bg-[#CAFFA6] selection:text-[#202020]">
        <SupportArticleView
          article={article}
          topicName={topicName}
          related={related}
        />
        <Footer />
      </div>
    );
  }

  // 2. If not an article, check if slug matches a topic
  let topic = null;
  try {
    topic = await getTopicBySlugOrId(slug);
  } catch (err) {
    console.error(`Error resolving topic for ${slug}:`, err);
  }

  if (topic) {
    let topicArticles = [];
    try {
      const res = await getSupportArticles({
        topicId: topic.id,
        limit: 100,
      });
      topicArticles = res.articles || [];
    } catch (err) {
      console.error(
        `Error loading articles for topic ${topic.heading}:`,
        err
      );
    }

    return (
      <div className="min-h-screen bg-white selection:bg-[#CAFFA6] selection:text-[#202020]">
        <SupportTopicView
          topic={topic}
          initialArticles={topicArticles}
        />
        <Footer />
      </div>
    );
  }

  // 3. Neither article nor topic found
  notFound();
}
