import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import SupportTopicView from "../../SupportTopicView";
import {
  getSupportArticles,
  getSupportTopics,
  getTopicBySlugOrId,
  getTopicSlug,
  FALLBACK_TOPICS,
} from "@/utils/support";

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const topics = await getSupportTopics();
    return (topics || []).map((t) => ({
      slug: getTopicSlug(t),
    }));
  } catch {
    return FALLBACK_TOPICS.map((t) => ({
      slug: getTopicSlug(t),
    }));
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const topic = await getTopicBySlugOrId(slug);
    if (!topic) {
      return { title: "Topic — Pintree Help Center" };
    }
    return {
      title: `${topic.heading} — Pintree Help Center`,
      description:
        topic.subHeading ||
        `Help articles and documentation for ${topic.heading} on Pintree.`,
    };
  } catch {
    return { title: "Help Center — Pintree" };
  }
}

export default async function SupportTopicPage({ params }) {
  const { slug } = await params;

  let topic = null;
  try {
    topic = await getTopicBySlugOrId(slug);
  } catch (err) {
    console.error(`Error resolving topic for ${slug}:`, err);
  }

  if (!topic) {
    notFound();
  }

  let articles = [];
  try {
    const res = await getSupportArticles({
      topicId: topic.id,
      limit: 100,
    });
    articles = res.articles || [];
  } catch (err) {
    console.error(`Error fetching articles for topic ${topic.heading}:`, err);
  }

  return (
    <div className="min-h-screen bg-white selection:bg-[#CAFFA6] selection:text-[#202020]">
      <SupportTopicView topic={topic} initialArticles={articles} />
      <Footer />
    </div>
  );
}

