import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import ArticleView from "../ArticleView";
import { getAllSlugs, getArticle, getRelated } from "../articles";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Newsroom" };
  return {
    title: article.title,
    description: article.summary || article.excerpt || article.title,
  };
}

export default async function NewsroomArticlePage({ params }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <div className="min-h-screen bg-white text-[#525252] selection:bg-[#CAFFA6] selection:text-[#202020]">
      <ArticleView article={article} related={getRelated(article)} />
      <Footer />
    </div>
  );
}
