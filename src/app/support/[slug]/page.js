import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import SupportArticleView from "../SupportArticleView";
import {
  getSupportArticleBySlug,
  getSupportArticles,
  getSupportTopics,
} from "@/utils/support";

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const res = await getSupportArticles({ limit: 50 });
    return (res.articles || []).map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const article = await getSupportArticleBySlug(slug);
    if (!article) return { title: "Help Center | Pintree" };
    return {
      title: `${article.headline} | Pintree Help Center`,
      description: article.excerpt || article.headline,
    };
  } catch {
    return { title: "Help Center | Pintree" };
  }
}

export default async function SupportArticlePage({ params }) {
  const { slug } = await params;

  let article = null;
  try {
    article = await getSupportArticleBySlug(slug);
  } catch (err) {
    console.error(`Error loading support article ${slug}:`, err);
  }

  if (!article) notFound();

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
      related = (relRes.articles || []).filter((a) => a.slug !== slug).slice(0, 3);
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

