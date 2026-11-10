import Link from "next/link";

const PORTRAIT = {
  center: "/product/center.jpg",
  midLeft: "/product/mid-left.jpg",
  farLeft: "/product/far-left.jpg",
  topLeft: "/product/top-left.jpg",
  midRight: "/product/mid-right.jpg",
  bottomRight: "/product/bottom-right.jpg",
  farRight: "/product/far-right.jpg",
  profile: "/product/profile.jpg",
  communityBanner: "/product/community-banner.jpg",
  communityAvatar: "/product/community-avatar.jpg",
  benPhilip: "/product/ben-philip.jpg",
  anandAbhiram: "/product/anand-abhiram.jpg",
  newsPublisher: "/product/news-publisher.jpg",
  newsCover: "/product/news-cover.jpg",
  playstoreQr: "/product/playstore-qr.jpeg",
};

const FRIENDS = [
  "/product/friend-1.jpg",
  "/product/friend-2.jpg",
  "/product/friend-3.jpg",
  "/product/friend-4.jpg",
];

const ANCHORS = [
  { href: "#profiles", label: "Personal Profiles", active: true },
  { href: "#communities", label: "Communities & Rooms" },
  { href: "#editorial", label: "News & Media", bold: true },
  { href: "#upcoming", label: "Upcoming Ecosystem", accent: true },
];

const PROFILE_POINTS = [
  "Personal profiles with posts, photos and personal information.",
  "Follow people and build meaningful connections.",
  "Share updates with friends, followers or selected circles.",
  "Discover people and conversations beyond your network.",
  "Personal chat and private interactions.",
];

const COMMUNITY_POINTS = [
  "Create or join interest-based and organisation-based communities.",
  "Dedicated community profiles, posts and member spaces.",
  "Public and private community options.",
  "Focused discussion rooms within communities.",
  "Different room formats for different types of participation.",
];

const EDITORIAL_POINTS = [
  { text: "Dedicated presence for publishers and media platforms." },
  { text: "Organised news feeds and topic-based content." },
  {
    isSeries: true,
    text: "Allows publishers to group related stories into connected episodes or instalments.",
  },
  { text: "Better content discovery and sustained reader engagement." },
  { text: "Opportunities for exclusive, curated, and professional journalism." },
];

const UPCOMING = [
  {
    title: "Public Figures & Celebrities",
    body: "Dedicated spaces for public personalities to connect with audiences through verified interactions, AMA sessions, and exclusive broadcast channels.",
    foot: "Verified Broadcasts & AMAs",
    card: "bg-[#f0f9fb] border-[#d6eff6] hover:border-[#204654]",
    rule: "border-[#e2f3f8]",
    footClass: "text-[#204654]",
    badge: "bg-white text-[#204654] border-[#d6eff6]",
    iconWrap: "bg-[#204654] text-[#A9E0F1]",
    icon: "verified",
  },
  {
    title: "Creators & Influencers",
    body: "Tools to build an audience and share original content. Monetize specialized circles, host premium audio lounges, and co-create with followers.",
    foot: "Audience Building & Series",
    card: "bg-[#f3fbf2] border-[#d9f5d6] hover:border-[#204654]",
    rule: "border-[#e2f7df]",
    footClass: "text-[#204654]",
    badge: "bg-white text-[#204654] border-[#d9f5d6]",
    iconWrap: "bg-[#CAFFA6] text-[#204654]",
    icon: "auto_awesome",
  },
  {
    title: "Licensed Professionals",
    body: "Verified professional profiles and consultation experiences for doctors, lawyers, certified advisers, and industry specialists.",
    foot: "Credential Verification & Advisory",
    card: "bg-[#f5f5f9] border-[#e3e3ed] hover:border-[#202020]",
    rule: "border-[#ebebf3]",
    footClass: "text-[#202020]",
    badge: "bg-white text-[#525252] border-[#e3e3ed]",
    iconWrap: "bg-[#202020] text-white",
    icon: "workspace_premium",
  },
  {
    title: "Businesses & Brands",
    body: "Comprehensive business presence, showcase products, manage customer relations, publish career opportunities, and run verified organizational spaces.",
    foot: "Catalogues, Jobs & Brand Rooms",
    card: "bg-[#faf8f4] border-[#ede7dc] hover:border-[#202020]",
    rule: "border-[#f4f0e9]",
    footClass: "text-[#202020]",
    badge: "bg-white text-[#525252] border-[#ede7dc]",
    iconWrap: "bg-[#456978] text-white",
    icon: "storefront",
  },
];

function Symbol({ name, className = "" }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden>
      {name}
    </span>
  );
}

function Spark({ className, color }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={color} aria-hidden>
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}

function Squircle({ src, className = "" }) {
  return (
    <div
      className={`overflow-hidden border-2 border-white ${className}`}
      style={{ filter: "grayscale(100%) contrast(108%)", borderRadius: "44%" }}>
      <img src={src} alt="" className="h-full w-full object-cover" />
    </div>
  );
}

function CheckList({ items, gap = "gap-6" }) {
  return (
    <ul className={`flex flex-col ${gap}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3.5">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#202020] text-white">
            <Symbol name="check" className="text-[14px]" />
          </span>
          <span className="font-jakarta text-[16px] leading-snug text-[#202020]">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Divider() {
  return <hr className="w-full border-t border-[#E5E5E5]" />;
}

function HeroCluster() {
  return (
    <div className="relative mx-auto mb-8 h-[220px] w-full max-w-[840px] select-none sm:h-[250px] md:h-[270px]">
      {/* Center Main Feature Squircle Avatar */}
      <Squircle
        src={PORTRAIT.center}
        className="absolute left-1/2 top-1/2 z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 shadow-xl sm:h-28 sm:w-28 md:h-[136px] md:w-[136px]"
      />
      <span className="pointer-events-auto absolute left-1/2 top-1/2 z-20 flex h-6 w-6 translate-x-7 translate-y-5 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#204654] text-[11px] text-white shadow-sm md:h-7 md:w-7 md:translate-x-10 md:translate-y-7 md:text-[13px]">
        <Symbol name="add" className="text-[13px] md:text-[15px]" />
      </span>

      {/* Top Pill: New connections */}
      <div className="pointer-events-auto absolute left-1 top-1 z-20 flex items-center gap-1.5 rounded-full border border-[#EAEAEA] bg-white/95 px-2.5 py-1 shadow-md backdrop-blur-sm sm:left-[22%] sm:px-3 sm:py-1.5 md:left-[32%] md:gap-2 md:px-3.5">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#CAFFA6] text-[#204654] md:h-5 md:w-5">
          <Symbol name="group_add" className="text-[11px] md:text-[13px]" />
        </span>
        <div className="text-left leading-none">
          <span className="block font-jakarta text-[10px] font-semibold text-[#202020] md:text-[11px]">
            New connections
          </span>
          <span className="text-[8px] font-medium text-gray-500 md:text-[9px]">
            +24 joined today
          </span>
        </div>
      </div>

      {/* Mid-Left Secondary Squircle Avatar */}
      <Squircle
        src={PORTRAIT.midLeft}
        className="absolute left-[10%] top-1/2 z-0 h-[72px] w-[72px] -translate-y-6 shadow-lg sm:left-[16%] sm:h-[90px] sm:w-[90px] md:left-[21%] md:h-[108px] md:w-[108px] md:-translate-y-8"
      />
      <span className="pointer-events-auto absolute left-[10%] top-1/2 z-20 flex h-5 w-5 translate-x-11 translate-y-4 cursor-pointer items-center justify-center rounded-full border border-white bg-[#CAFFA6] text-[10px] text-[#204654] shadow-sm sm:left-[16%] sm:translate-x-14 md:left-[21%] md:h-6 md:w-6 md:translate-x-16 md:translate-y-7 md:text-[11px]">
        <Symbol name="add" className="text-[11px] md:text-[13px]" />
      </span>

      {/* Bottom-Left Pill: Shared interests */}
      <div className="pointer-events-auto absolute bottom-1 left-1 z-20 flex items-center gap-1.5 rounded-full border border-[#EAEAEA] bg-white/95 px-2.5 py-1 shadow-md backdrop-blur-sm sm:left-[8%] sm:px-3 sm:py-1.5 md:bottom-2 md:left-[17%] md:gap-2 md:px-3.5">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#204654] text-[#CAFFA6] md:h-5 md:w-5">
          <Symbol name="forum" className="text-[11px] md:text-[13px]" />
        </span>
        <span className="font-jakarta text-[10px] font-semibold text-[#202020] md:text-[11px]">
          Shared interests
        </span>
      </div>

      {/* Far-Left Medium Squircle Avatar */}
      <Squircle
        src={PORTRAIT.farLeft}
        className="absolute bottom-6 left-[3%] z-0 hidden h-[84px] w-[84px] shadow-md sm:block md:left-[6%]"
      />

      {/* Top-Far-Left Small Accent Squircle Avatar */}
      <Squircle
        src={PORTRAIT.topLeft}
        className="absolute left-[0%] top-3 z-0 hidden h-[72px] w-[72px] opacity-90 shadow-sm sm:block md:left-[2%]"
      />

      {/* Mid-Right Secondary Squircle Avatar */}
      <Squircle
        src={PORTRAIT.midRight}
        className="absolute right-[12%] top-3 z-0 h-[76px] w-[76px] shadow-lg sm:right-[18%] sm:top-4 sm:h-[94px] sm:w-[94px] md:right-[22%] md:top-5 md:h-[112px] md:w-[112px]"
      />

      {/* Bottom-Right Squircle Avatar */}
      <Squircle
        src={PORTRAIT.bottomRight}
        className="absolute bottom-2 right-[4%] z-10 h-[70px] w-[70px] shadow-lg sm:bottom-4 sm:right-[8%] sm:h-[86px] sm:w-[86px] md:bottom-5 md:right-[13%] md:h-[102px] md:w-[102px]"
      />

      {/* Bottom-Right Pill: Growing communities */}
      <div className="pointer-events-auto absolute bottom-1 right-1 z-20 flex items-center gap-1.5 rounded-full border border-[#EAEAEA] bg-white/95 px-2.5 py-1 shadow-md backdrop-blur-sm sm:right-[1%] sm:px-3 sm:py-1.5 md:bottom-2 md:right-[2%] md:gap-2 md:px-3.5">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#CAFFA6] text-[#204654] md:h-5 md:w-5">
          <Symbol name="hub" className="text-[11px] md:text-[13px]" />
        </span>
        <div className="text-left leading-none">
          <span className="block font-jakarta text-[10px] font-semibold text-[#202020] md:text-[11px]">
            Growing communities
          </span>
          <span className="text-[8px] font-medium text-[#204654] md:text-[9px]">
            12k+ rooms active
          </span>
        </div>
      </div>

      {/* Far-Right Accent Squircle Avatar */}
      <Squircle
        src={PORTRAIT.farRight}
        className="absolute right-[2%] top-4 z-0 hidden h-[80px] w-[80px] opacity-85 shadow-sm sm:block md:right-[4%]"
      />

      {/* Floating Sparkles, Chat Badges & Reaction Elements */}
      <div className="pointer-events-none absolute left-[16%] top-1 z-10 hidden animate-pulse sm:block md:left-[19%]">
        <Spark className="h-4 w-4 text-[#F9C74F] drop-shadow-sm" color="#F9C74F" />
      </div>
      <div className="pointer-events-auto absolute left-[22%] top-6 z-20 hidden shadow-sm transition-transform hover:scale-110 sm:left-[26%] sm:top-7 sm:block md:left-[27%]">
        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-[#FFE5D9] text-[11px] shadow-sm md:h-7 md:w-7 md:text-[12px]">
          <Symbol name="favorite" className="text-[12px] text-[#E07A5F] md:text-[14px]" />
        </div>
      </div>
      <div className="pointer-events-auto absolute bottom-7 left-[16%] z-20 hidden transition-transform hover:scale-110 sm:bottom-8 sm:left-[23%] sm:flex md:left-[25%]">
        <div className="flex items-center gap-1 rounded-full border border-white bg-[#EDE7F6] px-2 py-0.5 text-[10px] text-[#673AB7] shadow-sm md:text-[11px]">
          <Symbol name="chat_bubble" className="text-[11px] md:text-[13px]" />
          <span className="text-[9px] font-semibold md:text-[10px]">Hey!</span>
        </div>
      </div>
      <div className="pointer-events-none absolute left-[13%] top-[48%] z-10 hidden sm:block md:left-[15%]">
        <Spark className="h-3.5 w-3.5 text-[#A9E0F1] drop-shadow-sm" color="#A9E0F1" />
      </div>
      <div className="pointer-events-auto absolute bottom-1 left-[32%] z-20 hidden transition-transform hover:scale-110 lg:left-[35%] lg:flex">
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#EAEAEA] bg-white/95 text-[13px] shadow-md">
          ✨
        </div>
      </div>
      <div className="pointer-events-auto absolute left-[58%] top-3 z-20 hidden -translate-x-1/2 transition-transform hover:scale-110 lg:left-[57%] lg:flex">
        <div className="flex items-center gap-1 rounded-full border border-white bg-[#E8F5E9] px-2 py-0.5 text-[11px] text-[#2E7D32] shadow-sm">
          <span>🌿</span>
          <span className="text-[10px] font-semibold text-[#204654]">design</span>
        </div>
      </div>
      <div className="pointer-events-none absolute left-[38%] top-1/2 z-10 hidden -translate-y-8 sm:block md:left-[39%]">
        <Spark className="h-3 w-3 text-[#FF9E80] drop-shadow-sm" color="#FF9E80" />
      </div>
      <div className="pointer-events-auto absolute bottom-3 left-[46%] z-20 hidden -translate-x-1/2 transition-transform hover:scale-110 lg:left-[48%] lg:flex">
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white bg-[#FFF9C4] text-[13px] shadow-sm">
          💡
        </div>
      </div>
      <div className="pointer-events-auto absolute right-1 top-2 z-20 transition-transform hover:scale-110 sm:right-[10%] sm:top-3 md:right-[35%] md:top-[38%]">
        <div className="flex items-center gap-1 rounded-full border border-[#EAEAEA] bg-white/95 px-2 py-0.5 text-[9px] font-medium text-[#204654] shadow-sm md:text-[10px]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
          <span>Live News</span>
        </div>
      </div>
      <div className="pointer-events-none absolute left-[68%] top-0 z-20 hidden animate-pulse md:left-[67%] md:block">
        <Spark className="h-4 w-4 text-[#D8B4E2] drop-shadow-sm" color="#D8B4E2" />
      </div>
      <div className="pointer-events-auto absolute bottom-8 right-[18%] z-20 hidden transition-transform hover:scale-110 sm:bottom-10 sm:right-[25%] sm:flex md:right-[27%]">
        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-[#E0F4FA] text-[#204654] shadow-sm md:h-7 md:w-7">
          <Symbol name="mic" className="text-[12px] md:text-[14px]" />
        </div>
      </div>
      <div className="pointer-events-auto absolute right-[15%] top-1/2 z-20 hidden -translate-y-12 transition-transform hover:scale-110 md:right-[17%] md:flex">
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white bg-[#FFF3E0] text-[13px] shadow-sm">
          👋
        </div>
      </div>
      <div className="pointer-events-none absolute right-[7%] top-[52%] z-10 hidden sm:block md:right-[9%]">
        <Spark className="h-3.5 w-3.5 text-[#CAFFA6] drop-shadow-sm" color="#CAFFA6" />
      </div>
      <div className="pointer-events-none absolute bottom-2 right-[20%] z-10 hidden sm:block md:right-[21%]">
        <Spark className="h-3 w-3 text-[#FFD166] drop-shadow-sm" color="#FFD166" />
      </div>
      <div className="pointer-events-auto absolute right-[10%] top-0 z-20 hidden transition-transform hover:scale-110 sm:block md:right-[12%]">
        <div className="flex items-center gap-1 rounded-full border border-white bg-[#FCE4EC] px-2 py-0.5 text-[10px] text-[#C2185B] shadow-sm">
          <Symbol name="thumb_up" className="text-[12px]" />
          <span className="text-[10px] font-semibold">+88</span>
        </div>
      </div>
    </div>
  );
}

function ProfileMock() {
  return (
    <div className="relative flex w-full max-w-[480px] select-none flex-col font-sans">
      <div className="pointer-events-none absolute -inset-x-8 -inset-y-6 z-0 overflow-hidden select-none">
        <svg
          className="h-full w-full opacity-60"
          viewBox="0 0 540 540"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden>
          <path
            d="M-20 90C90 70 170 140 210 230C250 320 340 370 450 350C510 340 550 310 570 280"
            stroke="#204654"
            strokeOpacity="0.08"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <path
            d="M20 30C130 10 230 80 290 180C340 260 410 320 530 310"
            stroke="#A9E0F1"
            strokeOpacity="0.35"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M-40 210C60 210 140 280 180 370C210 440 280 490 390 500"
            stroke="#204654"
            strokeOpacity="0.06"
            strokeWidth="1.5"
          />
          <path
            d="M110 40C200 40 300 120 360 220C410 300 460 380 560 410"
            stroke="#CAFFA6"
            strokeOpacity="0.4"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <circle cx="290" cy="180" r="3" fill="#A9E0F1" fillOpacity="0.5" />
          <circle cx="210" cy="230" r="2.5" fill="#204654" fillOpacity="0.2" />
          <circle cx="360" cy="220" r="3" fill="#CAFFA6" fillOpacity="0.6" />
        </svg>
      </div>

      <div className="relative z-10 flex items-center gap-4 sm:gap-5">
        <div className="h-[120px] w-[120px] min-h-[120px] min-w-[120px] shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md sm:h-[150px] sm:w-[150px] sm:min-h-[150px] sm:min-w-[150px] md:h-[160px] md:w-[160px] md:min-h-[160px] md:min-w-[160px]">
          <img
            src={PORTRAIT.profile}
            alt="Merlin Jaise"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-jakarta text-[20px] font-semibold tracking-tight text-[#1b1c1c] sm:text-[24px]">
              Merlin Jaise
            </h3>
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1D9BF0] text-white">
              <Symbol name="check" className="text-[13px] font-bold" />
            </span>
          </div>
          <span className="mb-2 font-jakarta text-[15px] font-semibold text-[#1D9BF0] sm:mb-3 sm:text-[16px]">
            @merlin_jaise99
          </span>
          <div className="inline-flex max-w-full items-center gap-1 rounded-full bg-[#f5f3f3] px-2.5 py-1 text-[10px] text-[#4c4546] sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[12px]">
            <span className="font-semibold text-[#1b1c1c] whitespace-nowrap">87 Posts</span>
            <span className="text-gray-400">·</span>
            <Symbol name="lock" className="text-[12px] text-gray-500 shrink-0 sm:text-[13px]" />
            <span className="flex items-center gap-1 whitespace-nowrap overflow-hidden">
              <span className="hidden sm:inline">Visible to </span>
              <strong className="truncate font-semibold text-[#1b1c1c]">
                My School Friends
              </strong>
            </span>
            <Symbol
              name="unfold_more"
              className="ml-0.5 shrink-0 cursor-pointer text-[13px] text-gray-500 hover:text-[#1b1c1c] sm:text-[14px]"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-2.5 pt-1">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 overflow-hidden">
            {FRIENDS.map((src, i) => (
              <img
                key={src}
                className="inline-block h-8 w-8 shrink-0 rounded-full border-2 border-white object-cover shadow-sm"
                src={src}
                alt={`Friend ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[14px] font-bold leading-tight text-[#1b1c1c]">
              1,240 Friends
            </span>
            <span className="text-[11px] text-gray-500">Across 7 circles</span>
          </div>
        </div>
        <div className="flex cursor-pointer items-center gap-1 rounded-full bg-[#E0F4FA] px-3 py-1 text-[11px] font-medium text-[#204654] transition-colors hover:bg-[#A9E0F1]">
          <span className="font-semibold text-[#007A8D]">
            3 Communities founded
          </span>
          <Symbol name="chevron_right" className="text-[13px] text-[#007A8D]" />
        </div>
      </div>

      <div className="relative z-10 mt-6 grid grid-cols-2 gap-y-3 gap-x-2 border-y border-gray-100 py-3 sm:grid-cols-4 sm:gap-1.5">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E0F4FA] text-[#204654] sm:h-9 sm:w-9 sm:rounded-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-[#204654]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div className="min-w-0 text-left leading-none">
            <span className="block text-[13px] font-bold text-[#1b1c1c] sm:text-[14px]">
              241
            </span>
            <span className="mt-0.5 block text-[10px] font-medium text-gray-500 whitespace-nowrap sm:text-[11px]">
              Posts
            </span>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFE5D9] text-[#E07A5F] sm:h-9 sm:w-9 sm:rounded-xl">
            <Symbol name="favorite" className="text-[16px] text-[#EA580C] sm:text-[18px]" />
          </div>
          <div className="min-w-0 text-left leading-none">
            <span className="block text-[13px] font-bold text-[#1b1c1c] sm:text-[14px]">
              14.8k
            </span>
            <span className="mt-0.5 block text-[10px] font-medium text-gray-500 whitespace-nowrap sm:text-[11px]">
              Likes
            </span>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E0F2FE] text-[#0284C7] sm:h-9 sm:w-9 sm:rounded-xl">
            <Symbol name="chat_bubble" className="text-[16px] text-[#0284C7] sm:text-[18px]" />
          </div>
          <div className="min-w-0 text-left leading-none">
            <span className="block text-[13px] font-bold text-[#1b1c1c] sm:text-[14px]">
              2.4k
            </span>
            <span className="mt-0.5 block text-[10px] font-medium text-gray-500 whitespace-nowrap sm:text-[11px]">
              Comments
            </span>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EDE7F6] text-[#673AB7] sm:h-9 sm:w-9 sm:rounded-xl">
            <Symbol name="bookmark" className="text-[16px] text-[#9333EA] sm:text-[18px]" />
          </div>
          <div className="min-w-0 text-left leading-none">
            <span className="block text-[13px] font-bold text-[#1b1c1c] sm:text-[14px]">
              980
            </span>
            <span className="mt-0.5 block text-[10px] font-medium text-gray-500 whitespace-nowrap sm:text-[11px]">
              Saved
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-5 grid grid-cols-2 gap-3.5">
        <div className="relative flex flex-col justify-between rounded-2xl border border-[#d6eff6] bg-[#f0f9fb] p-4 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[#4c4546]">
              Profile Views
            </span>
            <span className="rounded-md bg-[#CAFFA6] px-2 py-0.5 text-[10px] font-bold text-[#092100]">
              +18%
            </span>
          </div>
          <div className="mt-2">
            <span className="block text-[24px] font-bold leading-none text-[#1b1c1c]">
              28.4k
            </span>
            <span className="mt-1 block text-[11px] font-normal text-gray-400">
              past 30 days
            </span>
          </div>
        </div>

        <div className="relative flex flex-col justify-between rounded-2xl border border-[#d9f5d6] bg-[#f3fbf2] p-4 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[#4c4546]">
              Interactions
            </span>
            <span className="rounded-md bg-[#CAFFA6] px-2 py-0.5 text-[10px] font-bold text-[#092100]">
              +12%
            </span>
          </div>
          <div className="mt-2">
            <span className="block text-[24px] font-bold leading-none text-[#1b1c1c]">
              6.2k
            </span>
            <span className="mt-1 block text-[11px] font-normal text-gray-400">
              this week
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-3.5 grid grid-cols-2 items-center gap-4 rounded-2xl border border-[#EAEAEA] bg-[#f5f3f3] p-3">
        <div className="group flex cursor-pointer items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#CAFFA6] text-[#204654]">
              <Symbol name="hub" className="text-[20px] text-[#092100]" />
            </div>
            <div className="text-left leading-none">
              <span className="block text-[15px] font-bold text-[#1b1c1c]">
                12
              </span>
              <span className="mt-0.5 block text-[11px] font-medium text-gray-500">
                Communities Joined
              </span>
            </div>
          </div>
          <Symbol
            name="arrow_forward"
            className="text-[16px] text-gray-400 transition-colors group-hover:text-[#1b1c1c]"
          />
        </div>

        <div className="group flex cursor-pointer items-center justify-between border-l border-[#EAEAEA] pl-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#204654] text-white">
              <Symbol name="nature" className="text-[19px] text-[#A9E0F1]" />
            </div>
            <div className="text-left leading-none">
              <span className="block text-[15px] font-bold text-[#1b1c1c]">
                44
              </span>
              <span className="mt-0.5 block text-[11px] font-medium text-gray-500">
                Participated Rooms
              </span>
            </div>
          </div>
          <Symbol
            name="arrow_forward"
            className="text-[16px] text-gray-400 transition-colors group-hover:text-[#1b1c1c]"
          />
        </div>
      </div>
    </div>
  );
}

function CommunityMock() {
  return (
    <div className="flex w-full max-w-[480px] select-none flex-col font-sans">
      {/* 1. Community cover banner */}
      <div className="relative h-36 w-full overflow-hidden rounded-2xl shadow-sm md:h-44">
        <img
          src={PORTRAIT.communityBanner}
          alt="Community Craft Workshop Banner"
          className="h-full w-full object-cover"
        />
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#CAFFA6]" />
          <span>Public Community</span>
        </div>
      </div>

      {/* 2. Community identity (overlapping banner) */}
      <div className="relative z-10 -mt-8 flex flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto mb-2.5 h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-white bg-[#e4e2e2] shadow-md">
          <img
            src={PORTRAIT.communityAvatar}
            alt="Startup Entrepreneurs Circle"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <h3 className="font-aeonik-medium truncate text-[18px] font-bold leading-tight tracking-tight text-[#202020] md:text-[20px]">
            Startup Entrepreuners Circle
          </h3>
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#204654] text-white">
            <Symbol name="check" className="text-[11px] font-bold" />
          </span>
        </div>
        <span className="mb-3 mt-0.5 font-jakarta text-[12px] font-semibold text-[#525252]">
          12.4K members
        </span>
        <button className="mx-auto flex items-center justify-center gap-1 rounded-full bg-[#202020] px-5 py-2 text-[12px] font-medium text-white shadow-sm transition-colors hover:bg-black md:text-[13px]">
          <span>Join Community</span>
        </button>
      </div>

      {/* 3. Community statistics */}
      <div className="mt-5 flex items-center justify-around border-y border-[#E5E5E5] py-3 text-center">
        <div className="flex flex-1 flex-col items-center">
          <span className="font-aeonik-medium text-[20px] font-bold leading-none text-[#202020]">
            486
          </span>
          <span className="mt-1 text-[11px] font-medium text-[#525252]">
            Posts
          </span>
        </div>
        <span className="h-8 w-px bg-[#E5E5E5]" />
        <div className="flex flex-1 flex-col items-center">
          <span className="font-aeonik-medium text-[20px] font-bold leading-none text-[#202020]">
            12.4K
          </span>
          <span className="mt-1 text-[11px] font-medium text-[#525252]">
            Members
          </span>
        </div>
        <span className="h-8 w-px bg-[#E5E5E5]" />
        <div className="flex flex-1 flex-col items-center">
          <span className="font-aeonik-medium text-[20px] font-bold leading-none text-[#202020]">
            18
          </span>
          <span className="mt-1 text-[11px] font-medium text-[#525252]">
            Rooms
          </span>
        </div>
      </div>

      {/* 4. Community conversations preview list */}
      <div className="mt-4 flex flex-col gap-3 text-left">
        {/* Conversation 1 */}
        <div className="flex flex-col gap-2 rounded-2xl border border-[#ede7dc] bg-[#faf8f4] p-3.5 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white shadow-sm">
                <img
                  src={PORTRAIT.benPhilip}
                  alt="Ben Philip"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div className="flex flex-col leading-none">
                <div className="flex items-center gap-1">
                  <span className="text-[13px] font-bold text-[#1b1c1c]">
                    Ben Philip
                  </span>
                  <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#1D9BF0] text-white">
                    <Symbol name="check" className="text-[9px] font-bold" />
                  </span>
                </div>
                <span className="mt-0.5 text-[11px] text-gray-500">
                  @benphilip99 · 2h ago
                </span>
              </div>
            </div>
            <Symbol
              name="more_horiz"
              className="cursor-pointer text-[16px] text-gray-400 hover:text-[#1b1c1c]"
            />
          </div>
          <p className="pl-1 text-[13px] leading-relaxed text-[#202020]">
            Excited to host our weekend design sprint in Kochi! Drop your portfolios in the room if you&apos;d like feedback from the team.
          </p>
          <div className="flex items-center justify-between border-t border-[#ede7dc]/60 pt-1 text-[11px] text-[#525252]">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 transition-colors hover:text-[#204654]">
                <Symbol name="favorite" className="text-[14px] text-[#EA580C]" />
                <span className="font-medium text-[#1b1c1c]">248</span>
              </button>
              <button className="flex items-center gap-1 transition-colors hover:text-[#204654]">
                <Symbol name="chat_bubble" className="text-[14px] text-[#0284C7]" />
                <span className="font-medium text-[#1b1c1c]">36 replies</span>
              </button>
            </div>
          </div>
          <div className="mt-1 flex flex-col gap-2 border-t border-[#ede7dc]/60 pt-2">
            <div className="flex flex-col gap-1.5 rounded-xl border border-[#ede7dc] bg-white p-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full border border-white">
                    <img
                      src={PORTRAIT.profile}
                      alt="Merlin Jaise"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="text-[12px] font-bold text-[#1b1c1c]">
                      Merlin Jaise
                    </span>
                    <span className="text-[10px] text-gray-500">
                      @merlin_jaise · 45m ago
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#525252]">
                  <Symbol name="favorite" className="text-[12px] text-[#EA580C]" />
                  <span className="font-medium text-[#1b1c1c]">14</span>
                </div>
              </div>
              <p className="pl-8 text-[12px] leading-relaxed text-[#202020]">
                Just shared my portfolio link in the room! Looking forward to the review.
              </p>
            </div>
            <button className="inline-flex cursor-pointer items-center gap-1 py-0.5 pl-1 text-[11px] font-semibold text-[#204654] transition-colors hover:text-[#092100]">
              <Symbol name="expand_more" className="text-[14px]" />
              <span>View 35 more replies</span>
            </button>
          </div>
        </div>

        {/* Conversation 2 */}
        <div className="flex flex-col gap-2 rounded-2xl border border-[#d6eff6] bg-[#f0f9fb] p-3.5 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white shadow-sm">
                <img
                  src={PORTRAIT.anandAbhiram}
                  alt="Anand Abhiram"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[13px] font-bold text-[#1b1c1c]">
                  Anand Abhiram
                </span>
                <span className="mt-0.5 text-[11px] text-gray-500">
                  @anand__abhi · 4h ago
                </span>
              </div>
            </div>
            <Symbol
              name="more_horiz"
              className="cursor-pointer text-[16px] text-gray-400 hover:text-[#1b1c1c]"
            />
          </div>
          <div className="flex flex-col gap-2.5 pl-1">
            <p className="text-[13px] leading-relaxed text-[#202020]">
              Our creator grant application guidelines and criteria are officially published. Review the details below:
            </p>
            <div className="group flex cursor-pointer items-center justify-between rounded-xl border border-[#E5E5E5] bg-white p-2.5 shadow-sm transition-all hover:border-[#204654]">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FCE4EC] text-[#C2185B]">
                  <Symbol name="picture_as_pdf" className="text-[20px]" />
                </div>
                <div className="flex min-w-0 flex-col text-left leading-none">
                  <span className="truncate text-[13px] font-semibold text-[#1b1c1c] transition-colors group-hover:text-[#204654]">
                    Creator_Grant_Guidelines_2026.pdf
                  </span>
                  <span className="mt-1 text-[11px] font-normal text-gray-500">
                    2.4 MB · 14 pages
                  </span>
                </div>
              </div>
              <div className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#f5f3f3] px-2.5 py-1 text-[11px] font-semibold text-[#204654] transition-colors group-hover:bg-[#E0F4FA]">
                <Symbol name="download" className="text-[14px]" />
                <span>Download</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-[#d6eff6]/60 pt-1 text-[11px] text-[#525252]">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 transition-colors hover:text-[#204654]">
                <Symbol name="favorite" className="text-[14px] text-[#EA580C]" />
                <span className="font-medium text-[#1b1c1c]">192</span>
              </button>
              <button className="flex items-center gap-1 transition-colors hover:text-[#204654]">
                <Symbol name="chat_bubble" className="text-[14px] text-[#0284C7]" />
                <span className="font-medium text-[#1b1c1c]">18 replies</span>
              </button>
            </div>
            <button className="flex items-center gap-1 text-[11px] font-medium text-[#204654] transition-colors hover:text-black">
              <Symbol name="share" className="text-[14px]" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewsEditorialMock() {
  return (
    <div className="relative flex w-full max-w-[500px] select-none flex-col gap-4 font-sans">
      {/* Main News Publishing Article Card */}
      <div className="relative z-10 flex flex-col gap-3 rounded-2xl border border-[#E5E5E5] bg-white p-4 text-left shadow-sm sm:p-5">
        {/* Publisher Header Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={PORTRAIT.newsPublisher}
              alt="Standard Business News"
              className="h-8 w-8 shrink-0 rounded-full border border-black/5 object-cover"
            />
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1">
                <span className="text-[13px] font-bold text-[#1b1c1c]">
                  Standard Business News
                </span>
                <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#1D9BF0] text-white">
                  <Symbol name="check" className="text-[9px] font-bold" />
                </span>
              </div>
              <span className="mt-1 text-[11px] text-gray-500">
                Published Oct 24 · 6 min read
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <button className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-[#F7F7F7] hover:text-[#204654]">
              <Symbol name="bookmark_border" className="text-[16px]" />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-[#F7F7F7] hover:text-[#204654]">
              <Symbol name="share" className="text-[16px]" />
            </button>
          </div>
        </div>

        {/* Editorial Cover Photo */}
        <div className="group relative h-44 w-full overflow-hidden rounded-xl border border-[#E5E5E5]/60 shadow-inner">
          <img
            src={PORTRAIT.newsCover}
            alt="SEMICON India 2026"
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute left-2.5 top-2.5 rounded border border-white/10 bg-black/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#CAFFA6] backdrop-blur-sm">
            Deep Investigation
          </div>
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#204654] shadow-sm backdrop-blur-sm">
            <Symbol name="volume_up" className="text-[14px]" />
            <span>Listen (8m)</span>
          </div>
        </div>

        {/* Headline & Excerpt */}
        <div className="flex flex-col gap-1.5">
          <h3 className="font-aeonik-medium text-[18px] font-bold leading-snug tracking-tight text-[#1b1c1c] md:text-[20px]">
            Centre Approves ₹1.27 Lakh Crore Semiconductor Programme&nbsp;to Expand India&apos;s Chip Industry.
          </h3>
          <p className="text-[12px] leading-relaxed text-[#525252] sm:text-[13px]">
            India has taken another major step towards developing its semiconductor industry, with the Union Cabinet approving Semicon 2.0, a programme with a total budget outlay of ₹1,27,500 crore.
          </p>
          <div className="mt-1 flex items-center justify-between border-t border-[#E5E5E5] pt-2.5 text-[11px] text-[#525252]">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 transition-colors hover:text-[#204654]">
                <Symbol name="favorite" className="text-[14px] text-[#EA580C]" />
                <span className="font-medium text-[#1b1c1c]">1.2K</span>
              </button>
              <button className="flex items-center gap-1 transition-colors hover:text-[#204654]">
                <Symbol name="chat_bubble" className="text-[14px] text-[#0284C7]" />
                <span className="font-medium text-[#1b1c1c]">148</span>
              </button>
              <button className="flex items-center gap-1 transition-colors hover:text-[#204654]">
                <Symbol name="bookmark" className="text-[14px] text-[#673AB7]" />
                <span className="font-medium text-[#1b1c1c]">320</span>
              </button>
            </div>
            <button className="flex items-center gap-1 text-[11px] font-medium text-[#204654] transition-colors hover:text-black">
              <Symbol name="share" className="text-[14px]" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Connected News Series Component */}
      <div className="relative z-10 flex flex-col gap-3 rounded-2xl border border-[#E5E5E5] bg-[#F7F7F7] p-4 text-left">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="rounded bg-[#CAFFA6] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#204654]">
                EDITORIAL SERIES
              </span>
              <span className="text-[11px] font-bold text-gray-500">
                3 Episodes
              </span>
            </div>
            <h4 className="mt-1 text-[14px] font-bold text-[#1b1c1c]">
              India&apos;s Semiconductor Revolution
            </h4>
          </div>
          <div className="text-right leading-none">
            <span className="text-[11px] font-bold text-[#204654]">
              Episode 2 of 3
            </span>
            <span className="mt-0.5 block text-[10px] text-gray-500">
              68% completed
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
          <div className="h-1.5 w-2/3 rounded-full bg-[#204654]" />
        </div>

        {/* 3 Connected Episodes */}
        <div className="mt-1 flex flex-col gap-2">
          {/* Episode 1: Completed */}
          <div className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-white p-2.5 shadow-sm">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#204654] text-[10px] font-bold text-[#CAFFA6]">
                03
              </div>
              <div className="truncate leading-none">
                <span className="block truncate text-[12px] font-medium text-[#1b1c1c]">
                  Part 03: Five Semiconductor Plants Begin Production
                </span>
                <span className="mt-0.5 block text-[10px] text-gray-400">
                  India&apos;s chip manufacturing ecosystem reaches a major milestone.
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-[11px] font-medium text-gray-500">
                Nov 07
              </span>
              <span className="px-2 text-[10px] font-semibold text-gray-400">
                Read
              </span>
            </div>
          </div>

          {/* Episode 2: Active */}
          <div className="flex items-center justify-between rounded-xl border-2 border-[#204654] bg-white p-2.5 shadow-sm">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#204654] text-[10px] font-bold text-[#CAFFA6]">
                02
              </div>
              <div className="truncate leading-none">
                <span className="block truncate text-[12px] font-bold text-[#1b1c1c]">
                  Part 02: Centre Approves ₹1.27 Lakh Crore Semicon..
                </span>
                <span className="mt-0.5 block text-[10px] font-medium text-[#204654]">
                  Semicon 2.0 aims to strengthen India&apos;s chip industry.
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-[11px] font-medium text-[#204654]">
                Oct 24
              </span>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#CAFFA6] text-[#204654]">
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13.25 4.75L6 12L2.75 8.75"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* Episode 3: Locked */}
          <div className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-white/70 p-2.5 opacity-80 shadow-sm">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E5E5E5] text-[10px] font-bold text-gray-500">
                01
              </div>
              <div className="truncate leading-none">
                <span className="block truncate text-[12px] font-medium text-gray-600">
                  Part 01: India Launches Semiconductor Mission 2.0
                </span>
                <span className="mt-0.5 block text-[10px] text-gray-400">
                  Budget 2026 boosts domestic chip design and manufacturing.
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="text-[11px] font-medium text-gray-400">
                Sep 29
              </span>
              <Symbol
                name="lock"
                className="px-1 text-[14px] text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Publisher Analytics Widget */}
      <div className="relative z-10 mt-1 flex flex-col gap-3 rounded-2xl border border-[#E5E5E5] bg-white p-3.5 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#204654] text-[#CAFFA6]">
            <Symbol name="monitoring" className="text-[16px]" />
          </div>
          <div className="text-left leading-none">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1b1c1c]">
                Publisher Analytics
              </span>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22c55e]" />
            </div>
            <span className="mt-0.5 block text-[10px] font-medium text-gray-400">
              Live audience metrics
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-[#E5E5E5]/70" />

        {/* Metric Sections */}
        <div className="flex items-start justify-between gap-4 text-left">
          {/* Metric 1: Impressions */}
          <div className="flex flex-col items-start min-w-0">
            <div className="flex h-5 items-center gap-1.5">
              <span className="text-[13px] font-bold leading-none text-[#1b1c1c]">
                24.8K
              </span>
              <span className="inline-flex items-center rounded bg-[#CAFFA6] px-1 py-0.5 text-[9px] font-bold leading-none text-[#204654]">
                +18.4%
              </span>
            </div>
            <span className="mt-1 block text-[9.5px] font-normal leading-none text-gray-500 whitespace-nowrap">
              Impressions
            </span>
          </div>

          {/* Metric 2: Read-through */}
          <div className="flex flex-col items-start min-w-0">
            <div className="flex h-5 items-center">
              <span className="text-[13px] font-bold leading-none text-[#1b1c1c]">
                8.6K
              </span>
            </div>
            <span className="mt-1 block text-[9.5px] font-normal leading-none text-gray-500 whitespace-nowrap">
              74% read-through
            </span>
          </div>

          {/* Metric 3: Reactions */}
          <div className="flex flex-col items-start min-w-0">
            <div className="flex h-5 items-center gap-1">
              <span className="text-[13px] font-bold leading-none text-[#1b1c1c]">
                642
              </span>
              <svg
                className="h-3.5 w-3.5 shrink-0 text-[#e11d48]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <span className="mt-1 block text-[9.5px] font-normal leading-none text-gray-500 whitespace-nowrap">
              Reactions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductView() {
  return (
    <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-24 px-6 py-12 md:gap-32 md:px-12 md:py-20 lg:px-10">
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
          display: inline-block;
          vertical-align: middle;
          line-height: 1;
        }
      `}</style>

      {/* 1. HERO SECTION */}
      <section className="mx-auto flex max-w-3xl flex-col items-center pb-2 pt-6 text-center">
        {/* Eyebrow Tag */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-[#F7F7F7] px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-[#204654]" />
          <span className="font-jakarta text-[12px] font-semibold uppercase tracking-wider text-[#204654]">
            Products
          </span>
        </div>

        {/* Hero Cluster */}
        <HeroCluster />

        {/* Main Headline */}
        <h1 className="font-aeonik-medium mb-6 text-[32px] font-medium leading-[40px] tracking-tight text-[#202020] md:text-[48px] md:leading-[56px] md:tracking-[-0.02em]">
          One platform. Multiple ways to connect.
        </h1>

        {/* Supporting Text */}
        <p className="max-w-2xl font-jakarta text-[16px] leading-[26px] text-[#525252]">
          Explore the products and experiences that make Pintree a space for people, communities, publishers and businesses.
        </p>

        {/* Sub-navigation anchor row */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {ANCHORS.map((anchor) => (
            <a
              key={anchor.href}
              href={anchor.href}
              className={`rounded-full px-4 py-2 font-jakarta text-[14px] leading-5 transition-colors ${
                anchor.active
                  ? "bg-[#202020] text-white hover:bg-black"
                  : anchor.accent
                    ? "bg-[#CAFFA6] text-[#204654] hover:bg-[#bbf393]"
                    : `border border-[#E5E5E5] bg-[#F7F7F7] text-[#202020] hover:border-[#202020] ${
                        anchor.bold ? "font-semibold" : ""
                      }`
              }`}>
              {anchor.label}
            </a>
          ))}
        </div>
      </section>

      {/* Hairline Divider */}
      <Divider />

      {/* 2. PRODUCT SECTION 01 — USER PROFILES */}
      <section
        id="profiles"
        className="grid scroll-mt-24 grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left Column: Copy & Features */}
        <div className="flex flex-col justify-center lg:col-span-6">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#E5E5E5] bg-[#F7F7F7] px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-[#204654]" />
            <span className="font-jakarta text-[12px] font-semibold uppercase tracking-wider text-[#204654]">
              Personal Profile
            </span>
          </div>
          <h2 className="font-aeonik-regular mb-5 text-[32px] font-normal leading-[40px] tracking-tight text-[#202020] md:text-[38px] md:leading-[46px]">
            Your profile. Your social space.
          </h2>
          <p className="mb-8 font-jakarta text-[16px] leading-[26px] text-[#525252]">
            More than a personal profile, Pintree gives every user multiple ways to express themselves, connect and participate.
          </p>
          <ul className="flex flex-col gap-6">
            {PROFILE_POINTS.map((pt) => (
              <li key={pt} className="flex items-start gap-3.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#202020] text-white">
                  <Symbol name="check" className="text-[14px]" />
                </span>
                <span className="font-jakarta text-[16px] leading-snug text-[#202020]">
                  {pt}
                </span>
              </li>
            ))}
            <li className="flex items-center pt-2">
              <Link
                href="/support"
                className="group inline-flex items-center gap-1.5 font-jakarta text-[16px] font-semibold text-[#204654] transition-colors hover:text-[#092100]">
                <span>Know more about profile features</span>
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Column: Profile Mockup */}
        <div className="flex justify-center lg:col-span-6 lg:justify-end">
          <ProfileMock />
        </div>
      </section>

      {/* Hairline Divider */}
      <Divider />

      {/* 3. PRODUCT SECTION 02 — COMMUNITIES & ROOMS */}
      <section
        id="communities"
        className="grid scroll-mt-24 grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left Column: Realistic Community UI Mockup */}
        <div className="order-2 flex justify-center lg:order-1 lg:col-span-6 lg:justify-start">
          <CommunityMock />
        </div>

        {/* Right Column: Text & Features */}
        <div className="order-1 flex flex-col justify-center lg:order-2 lg:col-span-6">
          <div className="mb-4">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#E5E5E5] bg-[#F7F7F7] px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-[#204654]" />
              <span className="font-jakarta text-[12px] font-semibold uppercase tracking-wider text-[#204654]">
                Communities &amp; Rooms
              </span>
            </div>
          </div>
          <h2 className="font-aeonik-regular mb-5 text-[32px] font-normal leading-[40px] tracking-tight text-[#202020] md:text-[38px] md:leading-[46px]">
            Bring people together around shared interests.
          </h2>
          <p className="mb-8 font-jakarta text-[16px] leading-[26px] text-[#525252]">
            Communities give people a place to belong, while Rooms make conversations more focused and organised.
          </p>
          <ul className="flex flex-col gap-6">
            {COMMUNITY_POINTS.map((pt) => (
              <li key={pt} className="flex items-start gap-3.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#202020] text-white">
                  <Symbol name="check" className="text-[14px]" />
                </span>
                <span className="font-jakarta text-[16px] leading-relaxed text-[#202020]">
                  {pt}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/support"
            className="group mt-6 inline-flex items-center gap-2 font-jakarta text-[16px] font-semibold text-[#204654] transition-opacity hover:opacity-80">
            <span>Know more about communities</span>
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 12L10 8L6 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <div className="mt-8 flex flex-col items-start gap-3 pt-1 font-jakarta">
            {[
              "How to Create a Community?",
              "Communities for Organizations",
              "Interest-Based Communities",
              "More about Rooms",
            ].map((btnLabel) => (
              <Link
                key={btnLabel}
                href="/support"
                className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-[#F7F7F7] px-3.5 py-1.5 text-[16px] font-medium text-[#525252] transition-colors hover:border-[#202020] hover:text-[#202020]">
                <span>{btnLabel}</span>
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hairline Divider */}
      <Divider />

      {/* 4. PRODUCT SECTION 03 — NEWS & MEDIA */}
      <section
        id="editorial"
        className="grid scroll-mt-24 grid-cols-1 items-center gap-12 font-jakarta lg:grid-cols-12 lg:gap-16">
        {/* Left Column: Copy & Features */}
        <div className="flex flex-col justify-center lg:col-span-6">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#E5E5E5] bg-[#F7F7F7] px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-[#204654]" />
            <span className="font-jakarta text-[12px] font-semibold uppercase tracking-wider text-[#204654]">
              NEWS &amp; MEDIA
            </span>
          </div>
          <h2 className="font-aeonik-regular mb-5 text-[32px] font-normal leading-[40px] tracking-tight text-[#202020] md:text-[38px] md:leading-[46px]">
            A better way to discover and read the news.
          </h2>
          <p className="mb-8 font-jakarta text-[16px] leading-relaxed text-[#525252]">
            A dedicated experience for publishers and media platforms to distribute content, build readership and organise news into structured reading experiences.
          </p>
          <ul className="flex flex-col gap-6">
            {EDITORIAL_POINTS.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-3.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#202020] text-white">
                  <Symbol name="check" className="text-[14px]" />
                </span>
                <span className="font-jakarta text-[16px] leading-relaxed text-[#202020]">
                  {pt.isSeries ? (
                    <>
                      <strong className="font-semibold">Series-based reading:</strong>{" "}
                      {pt.text}
                    </>
                  ) : (
                    pt.text
                  )}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/support"
            className="group mt-6 inline-flex items-center gap-2 font-jakarta text-[16px] font-semibold text-[#204654] transition-opacity hover:opacity-80">
            <span>Learn more about News &amp; Media</span>
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 12L10 8L6 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <div className="mt-8 flex flex-col items-start gap-3 pt-1 font-jakarta">
            {[
              "Create News & Media account",
              "How to become a verified publisher?",
            ].map((btnLabel) => (
              <Link
                key={btnLabel}
                href="/support"
                className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-[#F7F7F7] px-3.5 py-1.5 text-[16px] font-medium text-[#525252] transition-colors hover:border-[#202020] hover:text-[#202020]">
                <span>{btnLabel}</span>
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column: Series-Based Reading & Publishing Mockup */}
        <div className="flex justify-center lg:col-span-6 lg:justify-end">
          <NewsEditorialMock />
        </div>
      </section>

      {/* Hairline Divider */}
      <Divider />

      {/* 5. UPCOMING EXPERIENCES */}
      <section id="upcoming" className="flex scroll-mt-24 flex-col items-center">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#CAFFA6] bg-[#CAFFA6]/30 px-3 py-1">
            <span className="font-jakarta text-[12px] font-semibold uppercase tracking-wider text-[#204654]">
              Coming to Pintree
            </span>
            <span className="rounded bg-[#CAFFA6] px-1.5 py-0.5 text-[10px] font-medium text-[#204654]">
              UPCOMING
            </span>
          </div>
          <h2 className="font-aeonik-regular mb-4 text-[32px] font-normal leading-[40px] tracking-tight text-[#202020] md:text-[38px] md:leading-[46px]">
            More possibilities. One growing platform.
          </h2>
          <p className="font-jakarta text-[16px] leading-relaxed text-[#525252]">
            We&apos;re building new ways for public figures, creators, professionals and businesses to connect with their audiences and communities.
          </p>
        </div>

        {/* 2x2 Grid with Soft Pastel Accent Backgrounds */}
        <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {UPCOMING.map((card) => (
            <div
              key={card.title}
              className={`flex flex-col justify-between rounded-2xl border p-8 transition-all duration-200 ${card.card}`}>
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconWrap}`}>
                    <Symbol name={card.icon} className="text-[24px]" />
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${card.badge}`}>
                    Upcoming
                  </span>
                </div>
                <h3 className="mb-2 text-[20px] font-semibold text-[#202020]">
                  {card.title}
                </h3>
                <p className="font-jakarta text-[14px] leading-relaxed text-[#525252]">
                  {card.body}
                </p>
              </div>
              <div
                className={`mt-8 flex items-center justify-between border-t pt-4 text-[13px] font-medium ${card.rule} ${card.footClass}`}>
                <span>{card.foot}</span>
                <Symbol name="arrow_forward" className="text-[16px]" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA & Store Download Section */}
        <div className="mx-auto mb-0 mt-14 max-w-xl px-4 text-center">
          <h3 className="font-aeonik-medium text-center text-2xl font-medium tracking-tight text-[#202020] md:text-3xl">
            Be part of what&apos;s growing.
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-center font-jakarta text-sm leading-relaxed text-[#525252] md:text-base">
            Join Pintree today and discover new ways to connect, share ideas and build meaningful communities.
          </p>
        </div>

        <div className="mt-14 mb-4 grid w-full max-w-5xl select-none grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            href="/signup"
            className="group flex h-14 items-center justify-between rounded-xl bg-[#202020] px-5 text-white shadow-sm transition-all hover:bg-black">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <Symbol name="person_add" className="text-[17px] text-[#CAFFA6]" />
              </span>
              <span className="truncate font-jakarta text-[14px] font-medium tracking-tight">
                Create Public / Pro Account
              </span>
            </div>
            <Symbol
              name="arrow_forward"
              className="ml-1 shrink-0 text-[18px] text-gray-400 transition-all group-hover:translate-x-0.5 group-hover:text-white"
            />
          </Link>

          <Link
            href="/download"
            className="group flex h-14 items-center justify-center gap-3 rounded-xl border border-[#E5E5E5] bg-white px-5 text-[#202020] shadow-sm transition-all hover:border-[#204654] hover:bg-[#F7F7F7]">
            <svg
              className="h-5 w-5 shrink-0 fill-current text-[#202020]"
              viewBox="0 0 170 170"
              aria-hidden>
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.66-7.85-11.89-14.42-6-9.33-10.8-19.86-14.41-31.59-3.61-11.73-5.42-23.01-5.42-33.84 0-15.11 3.8-27.56 11.41-37.36 7.6-9.8 17.1-14.81 28.49-15.02 5.09 0 10.63 1.34 16.63 4.02 6 2.68 10.05 4.08 12.16 4.19 1.7.1 5.92-1.34 12.67-4.3 6.74-2.97 12.61-4.25 17.6-3.84 13.57.8 24.3 5.41 32.2 13.84-11.85 7.18-17.65 17.06-17.38 29.62.27 10.12 4.15 18.57 11.64 25.33 7.48 6.77 16.35 10.57 26.6 11.41-2.22 6.64-4.87 13.26-7.95 19.86zM119.22 33.15c0-7.38 2.66-14.28 7.97-20.7 5.31-6.42 11.86-10.74 19.65-12.96.22 1.3.33 2.53.33 3.69 0 7.39-2.79 14.44-8.37 21.16-5.59 6.72-12.28 10.89-20.08 12.51-.57-1.3-.9-2.53-.9-3.7z" />
            </svg>
            <div className="flex flex-col text-left leading-none">
              <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                Download on the
              </span>
              <span className="mt-0.5 font-jakarta text-[14px] font-bold text-[#1b1c1c]">
                App Store
              </span>
            </div>
          </Link>

          <div className="group/play relative">
            <a
              href="https://play.google.com/store/apps/details?id=com.mcabee.pintree&pcampaignid=web_share"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-[#E5E5E5] bg-white px-5 text-[#204654] shadow-sm transition-all hover:border-[#204654] hover:bg-[#F7F7F7]">
              <svg
                className="h-5 w-5 shrink-0"
                viewBox="0 0 512 512"
                aria-hidden>
                <path
                  fill="#EA4335"
                  d="M59.31 38.65c-6.84 7.22-10.81 18.42-10.81 32.61v370.48c0 14.19 3.97 25.39 10.81 32.61l3.52 3.32L270.6 269.9v-5.8L62.83 35.33l-3.52 3.32z"
                />
                <path
                  fill="#FBBC04"
                  d="M339.9 339.2l-69.3-69.3v-5.8l69.3-69.3 1.57.89 82.16 46.68c23.46 13.33 23.46 35.21 0 48.54l-82.16 46.68-1.57 1.31z"
                />
                <path
                  fill="#4285F4"
                  d="M341.47 337.89L270.6 267 62.83 474.77c7.76 8.24 20.57 9.25 34.99 1.05l243.65-137.93z"
                />
                <path
                  fill="#34A853"
                  d="M341.47 174.11L97.82 36.18C83.4 27.98 70.59 28.99 62.83 37.23L270.6 245l70.87-70.89z"
                />
              </svg>
              <div className="flex flex-col text-left leading-none">
                <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                  Get it on
                </span>
                <span className="mt-0.5 font-jakarta text-[14px] font-bold text-[#1b1c1c]">
                  Google Play
                </span>
              </div>
            </a>

            {/* Google Play QR Code Popover */}
            <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 -translate-x-1/2 opacity-0 transition-all duration-200 group-hover/play:pointer-events-auto group-hover/play:opacity-100">
              <div className="flex w-44 flex-col items-center rounded-2xl border border-[#E5E5E5] bg-white p-3 text-center shadow-xl">
                <img
                  src={PORTRAIT.playstoreQr}
                  alt="Google Play QR Code"
                  className="h-32 w-32 rounded-lg object-contain"
                />
                <span className="mt-2 font-jakarta text-[11px] font-semibold text-[#1b1c1c]">
                  Scan to Install
                </span>
                <span className="text-[10px] text-gray-500">
                  Google Play Store
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
