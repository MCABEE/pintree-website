const ICON = "/Group-1410097144.svg";
const WORDMARK = "/pintree-wordmark.svg";
const ICON_WHITE = "/pintree-mark-white.svg";

const FACTS = [
  ["Product", "Pintree"],
  ["A product of", "MCABEE DIGITAL"],
  ["Platform", "Social Networking"],
  ["Core Focus", "Social platform for people and communities"],
  ["Location", "Kerala, India"],
];

const EXPERIENCES = [
  ["People", "Create your personal profile, express who you are and connect with people through shared interests and meaningful relationships."],
  ["Communities", "Create or join communities built around shared interests, organizations and common goals. Share updates and participate with like-minded people."],
  ["Discovery", "Discover people, posts and communities beyond your existing network. Explore new interests and find conversations worth being part of."],
  ["Rooms", "Join focused discussion spaces within communities. Take part in structured conversations around specific topics and shared interests."],
  ["Connections", "Follow people, build mutual friendships and stay connected. Share personal moments with friends and selected circles."],
];

const grid =
  "bg-[linear-gradient(to_right,#EAEAEA_1px,transparent_1px),linear-gradient(to_bottom,#EAEAEA_1px,transparent_1px)] [background-size:32px_32px]";

function DownloadIcon({ accent = false }) {
  return (
    <svg className={`h-3.5 w-3.5 ${accent ? "text-[#CAFFA6]" : "text-[#777777]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function FileLink({ href, fileName, children, solid = false }) {
  return (
    <a
      href={href}
      download={fileName}
      className={
        solid
          ? "inline-flex items-center gap-2 rounded-lg bg-[#202020] px-4 py-2.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-black"
          : "inline-flex items-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-4 py-2.5 text-xs font-medium text-[#202020] transition-colors hover:border-[#CCCCCC] hover:bg-[#F7F7F7]"
      }
    >
      <DownloadIcon accent={solid} />
      {children}
    </a>
  );
}

function IndiaMark() {
  return (
    <svg className="inline-block h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#FFF7ED" stroke="#F97316" strokeWidth="1.5" />
      <path d="M8 15L12 8L16 15H8Z" fill="#16A34A" />
      <circle cx="12" cy="12" r="2" fill="#1D4ED8" />
    </svg>
  );
}

export default function PressMediaView() {
  return (
    <main className="mx-auto w-full max-w-[1536px] px-6 pb-32 pt-12 font-jakarta sm:px-12 md:px-16 md:pt-20 lg:px-24 xl:px-[128px]">
      <header className="mx-auto max-w-[1280px] border-b border-[#E5E5E5] pb-16 md:pb-24">
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#204654]" />
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#777777]">
            Press & Media
          </span>
        </div>
        <h1 className="font-aeonik-regular mb-6 max-w-3xl text-4xl font-normal leading-[1.15] text-[#202020] sm:text-5xl md:text-[48px]">
          Pintree, at a glance.
        </h1>
        <div className="max-w-2xl space-y-2">
          <p className="text-base font-normal leading-relaxed text-[#666666] sm:text-lg">
            Discover Pintree, explore our story and access official brand resources, product information and media materials.
          </p>
          <p className="text-sm font-normal text-[#777777]">
            For media, publishing, partnerships and brand enquiries.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 pt-8">
          {[
            ["#about", "About Pintree", false],
            ["#brand-resources", "Brand Resources (Assets & Guidelines)", true],
            ["#platform", "The Platform Overview", false],
            ["#enquiries", "Media Enquiries", false],
          ].map(([href, label, active]) => (
            <a
              key={href}
              href={href}
              className={
                active
                  ? "inline-flex items-center gap-1.5 rounded-full bg-[#CAFFA6]/40 px-3.5 py-1.5 text-xs font-medium text-[#202020] transition-colors hover:bg-[#CAFFA6]"
                  : "inline-flex items-center gap-1.5 rounded-full bg-[#F7F7F7] px-3.5 py-1.5 text-xs font-medium text-[#666666] transition-colors hover:bg-[#EAEAEA] hover:text-[#202020]"
              }
            >
              {active ? <span className="h-1.5 w-1.5 rounded-full bg-[#204654]" /> : null}
              {label}
            </a>
          ))}
        </div>
      </header>

      <section id="about" className="mx-auto max-w-[1280px] scroll-mt-24 border-b border-[#E5E5E5] py-16 md:py-24">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-6 lg:col-span-7">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#777777]">
              01 / Overview
            </span>
            <h2 className="font-aeonik-regular text-2xl font-normal leading-[1.2] text-[#202020] sm:text-3xl md:text-[34px]">
              A social platform shaped by people
              <br />
              and communities.
            </h2>
            <div className="max-w-xl space-y-5 text-[16px] leading-relaxed text-[#525252]">
              <p>
                Pintree is a community-first social platform designed to bring people together through meaningful connections, shared interests and purposeful conversations. It creates a space where people can express themselves, discover new perspectives and become part of communities that matter to them.
              </p>
              <p>
                Built around five connected experiences — People, Communities, Discovery, Rooms and Connections — Pintree brings together personal identity, shared interests and focused conversations in one social environment.
              </p>
              <p>
                From connecting with individuals and participating in communities to exploring new conversations beyond your existing network, Pintree encourages a more meaningful and participatory way to experience social networking.
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-[#E5E5E5]/80 bg-[#F7F7F7] p-8 sm:p-9 lg:col-span-5">
            <div className="mb-6 border-b border-[#E5E5E5] pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">
                Company & Product Facts
              </span>
            </div>
            <dl className="space-y-4 text-sm">
              {FACTS.map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between border-b border-[#E5E5E5]/60 pb-3">
                  <dt className="font-normal text-[#777777]">{label}</dt>
                  <dd className="max-w-[210px] text-right font-medium text-[#202020]">{value}</dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between border-b border-[#E5E5E5]/60 pb-3">
                <dt className="font-normal text-[#777777]">Website</dt>
                <dd className="text-right font-medium text-[#202020]">
                  <a href="https://pintree.co" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                    pintree.co
                    <svg className="h-3 w-3 text-[#777777]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </a>
                </dd>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <dt className="font-normal text-[#777777]">Recognition</dt>
                <dd className="flex flex-wrap items-center justify-end gap-1.5 text-right font-medium text-[#202020]">
                  <IndiaMark />
                  <span>Startup India – DPIIT Recognised</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section id="brand-resources" className="mx-auto max-w-[1280px] scroll-mt-24 border-b border-[#E5E5E5] py-16 md:py-24">
        <div className="mb-14 max-w-3xl md:mb-16">
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.14em] text-[#777777]">
            Brand Resources
          </span>
          <h2 className="font-aeonik-regular mb-4 text-3xl font-normal leading-[1.18] text-[#202020] sm:text-4xl md:text-[36px]">
            The Pintree identity.
          </h2>
          <p className="text-sm font-normal leading-relaxed text-[#666666] sm:text-base">
            Official Pintree logos, icons and brand resources. Download these assets when featuring Pintree in publications, articles, presentations and other media.
          </p>
        </div>

        <div className="space-y-10">
          <article className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white transition-colors hover:border-[#CCCCCC]">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className={`relative flex min-h-[260px] items-center justify-center border-b border-[#E5E5E5] p-10 sm:min-h-[300px] sm:p-14 lg:col-span-7 lg:border-b-0 lg:border-r ${grid}`}>
                <span className="absolute left-4 top-4 rounded border border-[#E5E5E5]/80 bg-[#F7F7F7] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-[#777777]">
                  White Surface • 1:1 Scale
                </span>
                <div className="flex items-center gap-4" aria-label="Pintree Primary Logo Preview">
                  <img src={ICON} alt="Pintree brand icon" className="h-11 w-11 rounded-xl object-contain sm:h-12 sm:w-12" />
                  <img src={WORDMARK} alt="" className="h-9 w-auto sm:h-10" />
                </div>
              </div>
              <div className="flex flex-col justify-between bg-[#F7F7F7]/40 p-8 sm:p-10 lg:col-span-5">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">Asset 01</span>
                    <span className="text-xs text-[#777777]">Vector & Raster</span>
                  </div>
                  <h3 className="mb-3 text-xl font-medium text-[#202020] sm:text-[22px]">Primary Logo</h3>
                  <p className="mb-6 text-sm leading-relaxed text-[#666666]">
                    The official Pintree logo combining the brand icon and wordmark. Recommended for general brand representation in editorials, headers, and media press kits.
                  </p>
                </div>
                <div className="border-t border-[#E5E5E5] pt-4">
                  <div className="mb-3 text-xs font-medium text-[#777777]">Available Formats</div>
                  <div className="flex flex-wrap items-center gap-3">
                    <FileLink href={WORDMARK} fileName="pintree-logo-primary.svg" solid>Download SVG</FileLink>
                    <FileLink href={ICON} fileName="pintree-logo-primary.svg">Download PNG</FileLink>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <article className="flex flex-col justify-between overflow-hidden rounded-xl border border-[#E5E5E5] bg-white transition-colors hover:border-[#CCCCCC]">
              <div className={`relative flex min-h-[220px] items-center justify-center border-b border-[#E5E5E5] p-10 ${grid}`}>
                <span className="absolute left-4 top-4 rounded border border-[#E5E5E5]/80 bg-[#F7F7F7] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-[#777777]">Wordmark</span>
                <img src={WORDMARK} alt="Pintree wordmark" className="h-9 w-auto max-w-full sm:h-11" />
              </div>
              <div className="flex flex-1 flex-col justify-between bg-[#F7F7F7]/40 p-7 sm:p-8">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">Asset 02</span>
                    <span className="text-xs text-[#777777]">SVG / PNG</span>
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-[#202020] sm:text-[20px]">Wordmark</h3>
                  <p className="mb-6 text-sm leading-relaxed text-[#666666]">
                    The official Pintree wordmark without the separate icon. Intended for editorial layouts and horizontal banners where the brand name is preferred.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 border-t border-[#E5E5E5] pt-4">
                  <FileLink href={WORDMARK} fileName="pintree-wordmark.svg" solid>Download SVG</FileLink>
                  <FileLink href={WORDMARK} fileName="pintree-wordmark.svg">Download PNG</FileLink>
                </div>
              </div>
            </article>

            <article className="flex flex-col justify-between overflow-hidden rounded-xl border border-[#E5E5E5] bg-white transition-colors hover:border-[#CCCCCC]">
              <div className={`relative flex min-h-[220px] items-center justify-center border-b border-[#E5E5E5] p-10 ${grid}`}>
                <span className="absolute left-4 top-4 rounded border border-[#E5E5E5]/80 bg-[#F7F7F7] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-[#777777]">Symbol</span>
                <img src={ICON} alt="Pintree brand icon" className="h-20 w-20 rounded-2xl object-contain" />
              </div>
              <div className="flex flex-1 flex-col justify-between bg-[#F7F7F7]/40 p-7 sm:p-8">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">Asset 03</span>
                    <span className="text-xs text-[#777777]">SVG / PNG</span>
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-[#202020] sm:text-[20px]">Brand Icon</h3>
                  <p className="mb-6 text-sm leading-relaxed text-[#666666]">
                    The standalone Pintree symbol for compact placements, profile imagery, app store badges and favicon identification.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 border-t border-[#E5E5E5] pt-4">
                  <FileLink href={ICON} fileName="pintree-brand-icon.svg" solid>Download SVG</FileLink>
                  <FileLink href={ICON} fileName="pintree-brand-icon.svg">Download PNG</FileLink>
                </div>
              </div>
            </article>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-7">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">Asset 04</span>
                  <h3 className="text-lg font-medium text-[#202020] sm:text-[20px]">Logo Variations (Contrast Tiers)</h3>
                </div>
                <span className="text-xs text-[#777777]">Light & Dark themes</span>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col justify-between rounded-xl border border-[#E5E5E5] bg-white p-5">
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-[#202020]">Dark Logo</span>
                      <span className="text-[10px] text-[#777777]">For light surfaces</span>
                    </div>
                    <div className={`relative mb-4 flex h-28 items-center justify-center overflow-hidden rounded-lg border border-[#E5E5E5]/60 p-4 ${grid}`}>
                      <div className="relative flex items-center gap-2.5">
                        <img src={ICON} alt="" className="h-7 w-7 rounded-md object-contain" />
                        <img src={WORDMARK} alt="Pintree" className="h-5 w-auto" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-t border-[#E5E5E5] pt-2 text-xs font-medium text-[#202020]">
                    <a href={WORDMARK} download="pintree-logo-dark.svg" className="hover:underline">SVG ↓</a>
                    <span className="text-[#E5E5E5]">|</span>
                    <a href={ICON} download="pintree-logo-dark.svg" className="hover:underline">PNG ↓</a>
                  </div>
                </div>
                <div className="flex flex-col justify-between rounded-xl border border-[#E5E5E5] bg-white p-5">
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-[#202020]">Light Logo</span>
                      <span className="text-[10px] text-[#777777]">For dark surfaces</span>
                    </div>
                    <div className="relative mb-4 flex h-28 items-center justify-center overflow-hidden rounded-lg border border-[#E5E5E5] bg-[#202020] p-4 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px]">
                      <div className="relative flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white p-0.5">
                          <img src={ICON_WHITE} alt="" className="h-full w-full object-contain" />
                        </span>
                        <img src={WORDMARK} alt="Pintree" className="h-5 w-auto brightness-0 invert" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-t border-[#E5E5E5] pt-2 text-xs font-medium text-[#202020]">
                    <a href={ICON_WHITE} download="pintree-logo-light.svg" className="hover:underline">SVG ↓</a>
                    <span className="text-[#E5E5E5]">|</span>
                    <a href={WORDMARK} download="pintree-logo-light.svg" className="hover:underline">PNG ↓</a>
                  </div>
                </div>
              </div>
            </div>

            <article className="flex flex-col justify-between overflow-hidden rounded-xl border border-[#E5E5E5] bg-white transition-colors hover:border-[#CCCCCC] lg:col-span-5">
              <div className="flex flex-1 flex-col justify-between bg-[#F7F7F7]/40 p-7 sm:p-8">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">Asset 05</span>
                    <span className="inline-flex items-center rounded bg-[#E5E5E5]/80 px-2 py-0.5 text-[11px] font-medium text-[#202020]">PDF Format</span>
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-[#202020] sm:text-[20px]">Pintree Brand Guidelines</h3>
                  <p className="mb-6 text-sm leading-relaxed text-[#666666]">
                    An overview of Pintree&apos;s visual identity, logo clearspace, color palettes, Aeonik typography scales, and co-branding presentation rules.
                  </p>
                </div>
                <div className="border-t border-[#E5E5E5] pt-4">
                  <a
                    href="mailto:press@pintree.co?subject=Pintree%20Brand%20Guidelines"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#202020] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-black"
                  >
                    Download Brand Guidelines →
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="platform" className="mx-auto max-w-[1280px] scroll-mt-24 border-b border-[#E5E5E5] py-16 md:py-24">
        <div className="mb-8 max-w-3xl md:mb-10">
          <span className="mb-3 block text-xs font-medium uppercase tracking-widest text-[#777777]">The Platform</span>
          <h2 className="font-aeonik-regular mb-4 text-3xl font-normal leading-[1.18] text-[#202020] sm:text-4xl md:text-[36px]">
            A different space for social connection.
          </h2>
          <p className="max-w-3xl text-lg font-normal leading-relaxed text-[#525252]">
            Pintree brings people, communities and conversations together in one connected social experience.
          </p>
        </div>
        <div className="mb-12 border-b border-[#E5E5E5] pb-12">
          <h3 className="font-aeonik-regular mb-4 text-[28px] font-normal leading-[1.2] text-[#202020]">
            More than a place to share.
          </h3>
          <div className="w-full space-y-4 text-[16px] leading-relaxed text-[#525252]">
            <p>
              Pintree brings together personal profiles, community spaces and focused conversations, giving people different ways to connect and participate. Whether connecting with individuals, joining communities or sharing ideas, every experience is built around people and their interests.
            </p>
            <p>
              From following people and building friendships to participating in community discussions and discovering new interests, Pintree creates a connected social environment that goes beyond the traditional feed.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-0 md:divide-x md:divide-[#E5E5E5]">
          {EXPERIENCES.map(([title, text], index) => (
            <div
              key={title}
              className={`space-y-2 ${
                index === 0
                  ? "md:pr-6"
                  : index === EXPERIENCES.length - 1
                    ? "border-t border-[#E5E5E5] pt-6 md:border-t-0 md:pl-6 md:pt-0"
                    : "border-t border-[#E5E5E5] pt-6 md:border-t-0 md:px-6 md:pt-0"
              }`}
            >
              <h4 className="text-lg font-medium text-[#202020] sm:text-[20px]">{title}</h4>
              <p className="text-sm leading-relaxed text-[#666666]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="enquiries" className="mx-auto max-w-[1280px] scroll-mt-24 pt-16 md:pt-24">
        <div className="rounded-2xl border border-[#E5E5E5] bg-[#F7F7F7] p-8 sm:p-12 md:p-16">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="space-y-4 lg:col-span-7">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#CAFFA6]" />
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#777777]">Media Enquiries</span>
              </div>
              <h2 className="font-aeonik-regular text-3xl font-normal leading-[1.2] text-[#202020] sm:text-4xl md:text-[36px]">
                Have a story about Pintree?
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-[#525252] sm:text-base">
                For press coverage, interviews, company information, media resources and other press-related enquiries, get in touch with our team.
              </p>
              <p className="pt-1 text-xs text-[#777777]">
                We welcome enquiries from journalists, publishers and media professionals.
              </p>
            </div>
            <div className="flex flex-col items-start justify-center gap-4 sm:flex-row lg:col-span-5 lg:flex-col lg:items-end">
              <a
                href="mailto:press@pintree.co?subject=Press%20Inquiry%20-%20Pintree"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#202020] px-6 py-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-black sm:w-auto"
              >
                Contact Media Team →
              </a>
              <div className="text-xs text-[#777777] lg:text-right">
                <span>Press email: </span>
                <a href="mailto:press@pintree.co" className="font-medium text-[#202020] hover:underline">
                  press@pintree.co
                </a>
                <span className="mt-0.5 block text-[11px] text-[#777777]">(Subject to confirmation)</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
