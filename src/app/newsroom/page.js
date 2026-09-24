import Footer from "@/components/Footer";

export const metadata = {
  title: "Newsroom | Pintree",
  description:
    "Official updates, announcements, and milestones from the Pintree team, shared with our community and media.",
};

const moreArticles = [
  {
    title: "Pintree Expands Community Tools Across the Platform",
    excerpt:
      "New tools help users create, manage, and engage in purpose-driven communities more easily.",
  },
  {
    title: "Pintree Expands Community Tools Across the Platform",
    excerpt:
      "New tools help users create, manage, and engage in purpose-driven communities more easily.",
  },
  {
    title: "Pintree Expands Community Tools Across the Platform",
    excerpt:
      "New tools help users create, manage, and engage in purpose-driven communities more easily.",
  },
];

export default function NewsroomPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto w-full max-w-[1536px] px-6 lg:px-[136px]">
        <header className="pt-[50px] text-center md:pt-[100px]">
          <h1 className="pb-[25px] text-[28px] font-aeonik-medium leading-[1.12] text-[#1A1A1A] sm:text-[32px] lg:text-[48px] 2xl:text-[56px]">
            Newsroom
          </h1>
          <p className="mx-auto max-w-[920px] text-[16px] leading-[1.4] font-aeonik-regular text-[#1A1A1A] sm:text-[20px]">
            Official updates, announcements, and milestones from the Pintree
            team,
            <br className="hidden sm:inline" />
            shared directly with our community and media.
          </p>
        </header>

        <section className="pt-[50px] md:pt-[100px]">
          <h2 className="pb-2 text-left text-[20px] font-aeonik-medium text-[#0C0C0C] sm:text-[24px]">
            Latest
          </h2>

          <article className="mt-4 flex flex-col gap-4 lg:mt-6 lg:flex-row lg:items-start lg:gap-10">
            <img
              src="/news1.svg"
              alt="Pintree community features announcement"
              className="w-full shrink-0 object-cover sm:h-[338px] lg:w-[600px] lg:max-w-[600px]"
            />
            <div className="min-w-0 flex-1 lg:pt-1">
              <p className="pb-3.5 text-[16px] font-aeonik-regular text-[#000000] md:text-[20px]">
                15 December 2025, Mon
              </p>
              <h3 className="pb-2 text-[20px] font-aeonik-medium leading-[1.2] text-[#0C0C0C] sm:text-[24px] lg:text-[24px] xl:text-[36px] xl:leading-[1.2]">
                Pintree Introduces New Community Features to Strengthen
                Meaningful Connections.
              </h3>
              <p className="text-[16px] leading-[1.4] font-aeonik-regular text-[#0C0C0C]">
                Pintree has rolled out new community-focused features designed
                to help users connect around shared interests more effectively.
                The update enhances discovery, interaction, and moderation tools,
                making it easier for users, creators, and organizations to build
                purposeful spaces and engage..
              </p>
              <p className="pt-2 text-[14px] font-aeonik-regular text-[#0453F1]">
                Read More
              </p>
            </div>
          </article>
        </section>

        <section className="pt-10 md:pt-14">
          <h2 className="pb-[22px] text-left text-[20px] font-aeonik-medium text-[#0C0C0C] sm:text-[24px]">
            More from Pintree
          </h2>

          <div className="flex flex-col gap-6 pb-28 xl:flex-row xl:gap-6">
            {moreArticles.map((article, index) => (
              <article
                key={index}
                className="flex w-full flex-col xl:w-[464px] xl:max-w-[calc((100%-48px)/3)] xl:flex-1"
              >
                <img
                  src="/news2.svg"
                  alt=""
                  className="aspect-[464/261] w-full object-cover"
                />
                <p className="pt-5 pb-3.5 text-[16px] font-aeonik-regular text-[#000000]">
                  09 December 2025, Tue
                </p>
                <h3 className="pb-3 text-[24px] font-aeonik-medium leading-[1.2] text-[#0C0C0C]">
                  {article.title}
                </h3>
                <p className="text-[16px] leading-[1.4] font-aeonik-regular text-[#0C0C0C]">
                  {article.excerpt}
                </p>
                <p className="pt-4 text-[14px] font-aeonik-regular text-[#0453F1]">
                  Read More
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
