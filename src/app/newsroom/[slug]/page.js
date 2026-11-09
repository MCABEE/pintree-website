import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import ArticleView from "../ArticleView";
import { getAllSlugs, getArticle, getRelated } from "../articles";
import { getNewsBySlug, getNews } from "@/utils/news";

export const dynamicParams = true;

export async function generateStaticParams() {
  const localSlugs = getAllSlugs().map((slug) => ({ slug }));
  try {
    const res = await getNews({ limit: 50 });
    const apiSlugs = (res.articles || []).map((a) => ({ slug: a.slug }));
    const set = new Set(apiSlugs.map((s) => s.slug));
    for (const item of localSlugs) {
      if (!set.has(item.slug)) {
        apiSlugs.push(item);
      }
    }
    return apiSlugs;
  } catch {
    return localSlugs;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let article = null;
  try {
    article = await getNewsBySlug(slug);
  } catch {
    // fallback
  }
  if (!article) {
    article = getArticle(slug);
  }
  if (!article) return { title: "Newsroom | Pintree" };

  return {
    title: `${article.title} | Pintree Newsroom`,
    description: article.summary || article.excerpt || article.title,
  };
}

export default async function NewsroomArticlePage({ params }) {
  const { slug } = await params;

  let article = null;
  try {
    article = await getNewsBySlug(slug);
  } catch (err) {
    console.error(`Error loading article ${slug}:`, err);
  }

  if (!article) {
    article = getArticle(slug);
  }

  if (!article) notFound();

  let related = [];
  try {
    const categoryQuery = article.categoryRaw || article.category;
    if (categoryQuery) {
      const relRes = await getNews({
        category: categoryQuery,
        limit: 10,
      });
      // Strictly only articles in the same category, excluding the current article
      related = (relRes.articles || [])
        .filter(
          (a) =>
            a.slug !== slug &&
            (a.categoryRaw === article.categoryRaw ||
              a.category === article.category)
        )
        .slice(0, 3);
    }
  } catch (err) {
    console.error("Failed to fetch related news for same category:", err);
    related = [];
  }

  return (
    <div className="min-h-screen bg-white text-[#525252] selection:bg-[#CAFFA6] selection:text-[#202020]">
      <ArticleView article={article} related={related} />
      <Footer />
    </div>
  );
}
