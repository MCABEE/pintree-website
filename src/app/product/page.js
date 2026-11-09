import Footer from "@/components/Footer";
import ProductView from "./ProductView";

export const metadata = {
  title: "Products",
  description:
    "Explore the products and experiences that make Pintree a space for people, communities, publishers and businesses.",
};

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-white text-[#202020] antialiased selection:bg-[#CAFFA6] selection:text-[#204654]">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
      />
      <ProductView />
      <Footer />
    </div>
  );
}
