"use client";

import { useEffect, useRef } from "react";

const APP_IMAGE = "/about/app.jpg";

const CARDS = [
  {
    title: "Personal Profiles",
    body: "Identity, expression and meaningful connections.",
    icon: "person",
    className: "bg-[#CAFFA6] border border-[#CAFFA6] text-[#204654]",
    iconWrap: "bg-[#204654]/10 text-[#204654]",
    titleClass: "text-[#204654]",
    bodyClass: "text-[#204654]/85",
  },
  {
    title: "Discovery",
    body: "Find people, posts and communities beyond your network.",
    icon: "explore",
    className: "border border-[#bfe4d8]",
    style: { backgroundColor: "#d9f0e8" },
    iconWrap: "text-[#204654]",
    iconStyle: { backgroundColor: "rgba(32, 70, 84, 0.12)" },
    titleClass: "text-[#204654]",
    bodyClass: "text-[#2D5B57]",
  },
  {
    title: "Personal Chat",
    body: "Private conversations and direct connections.",
    icon: "forum",
    className: "border border-[#E5E5E5] bg-[#F7F7F7]",
    iconWrap: "border border-[#E5E5E5] bg-[#204654]/10 text-[#204654]",
    titleClass: "font-semibold text-[#202020]",
    bodyClass: "text-[#525252]",
    dot: "bg-[#CAFFA6]",
  },
  {
    title: "Professionals",
    body: "Access a trusted, gated space to discover and consult verified professionals quickly",
    icon: "badge",
    className: "border border-[#c8c2ee]",
    style: { backgroundColor: "#dcd8f5" },
    iconWrap: "text-[#2E2254]",
    iconStyle: { backgroundColor: "rgba(46, 34, 84, 0.12)" },
    titleClass: "text-[#2E2254]",
    bodyClass: "text-[#4D436D]",
  },
  {
    title: "News & Content",
    body: "Discover trusted insights, news and engaging content from publishers and media platforms.",
    icon: "newspaper",
    className: "border border-[#f5d3b8]",
    style: { backgroundColor: "#fce8d5" },
    iconWrap: "text-[#3D2314]",
    iconStyle: { backgroundColor: "rgba(61, 35, 20, 0.12)" },
    titleClass: "text-[#3D2314]",
    bodyClass: "text-[#5A3E2F]",
  },
  {
    title: "Communities",
    body: "Shared interests and welcoming spaces to belong.",
    icon: "groups",
    className: "border border-[#A9E0F1] bg-[#A9E0F1]",
    iconWrap: "text-[#204654]",
    iconStyle: { backgroundColor: "rgba(32, 70, 84, 0.12)" },
    titleClass: "text-[#204654]",
    bodyClass: "text-[#204654]/90",
  },
  {
    title: "Rooms",
    body: "Focused conversations within communities.",
    icon: "graphic_eq",
    className: "border border-white/10 bg-[#204654] text-white",
    iconWrap: "bg-white/10 text-[#CAFFA6]",
    titleClass: "font-semibold text-white",
    bodyClass: "text-[#CAFFA6]",
  },
  {
    title: "Marketplace & Jobs",
    body: "Discover products, services and job opportunities shared by businesses on Pintree.",
    icon: "storefront",
    className: "border border-[#e6dcb0]",
    style: { backgroundColor: "#f5edc9" },
    iconWrap: "text-[#3D3512]",
    iconStyle: { backgroundColor: "rgba(61, 53, 18, 0.12)" },
    titleClass: "text-[#2E2609]",
    bodyClass: "text-[#594D1F]",
    dot: "bg-[#3D3512]",
  },
  {
    title: "Business",
    body: "Explore brand pages and connect with opportunities.",
    icon: "business",
    className: "border border-[#d0d8f0]",
    style: { backgroundColor: "#e5eaf8" },
    iconWrap: "text-[#1E2B4D]",
    iconStyle: { backgroundColor: "rgba(30, 43, 77, 0.12)" },
    titleClass: "text-[#1E2B4D]",
    bodyClass: "text-[#48567A]",
  },
  {
    title: "Public Figures",
    body: "Build presence and connect with engaged audiences.",
    icon: "verified",
    className: "border border-[#e6becd]",
    style: { backgroundColor: "#f5dce8" },
    iconWrap: "text-[#5C2D44]",
    iconStyle: { backgroundColor: "rgba(92, 45, 68, 0.12)" },
    titleClass: "text-[#5C2D44]",
    bodyClass: "text-[#6E4057]",
  },
];

const LEFT_OUTER = [0, 1];
const LEFT_INNER = [2, 3, 4];
const RIGHT_INNER = [5, 6, 7];
const RIGHT_OUTER = [8, 9];

const MILESTONES = [
  {
    date: "2025 AUG",
    title: "The Idea",
    body: "The concept of Pintree takes shape, driven by a different perspective on social connection and communities.",
    flip: false,
    stem: "bg-[#204654]/30",
    dot: "bg-[#204654]",
    ring: "#204654",
    dash: "120 40",
    rotate: "-rotate-45",
    node: "bg-[#204654] text-[#A9E0F1]",
    icon: "idea",
  },
  {
    date: "2026 JAN",
    title: "Development Begins",
    body: "The initial concept moves into product development with core architectural and design sprints.",
    flip: true,
    stem: "bg-[#202020]/30",
    dot: "bg-[#202020]",
    ring: "#202020",
    dash: "110 50",
    rotate: "rotate-45",
    node: "bg-[#202020] text-white",
    icon: "launch",
  },
  {
    date: "2026 JUN",
    title: "MVP Ready",
    body: "The first working version brings Pintree's core social experiences together for early alpha feedback.",
    flip: false,
    stem: "bg-[#3f6372]/30",
    dot: "bg-[#3f6372]",
    ring: "#3f6372",
    dash: "115 45",
    rotate: "-rotate-90",
    node: "bg-[#3f6372] text-[#A9E0F1]",
    icon: "layers",
  },
  {
    date: "2026 DEC",
    title: "Public Launch",
    body: "Pintree prepares to welcome its first wider community, unlocking invite-based onboarding and open discovery.",
    flip: true,
    badge: "Upcoming",
    dateClass:
      "rounded-full border border-[#CAFFA6]/60 bg-[#CAFFA6]/30 px-2.5 py-0.5 text-sm font-bold tracking-wide text-[#204654]",
    stem: "bg-[#204654]/40",
    dot: "bg-[#204654]",
    ring: "#CAFFA6",
    dash: "130 35",
    ringWidth: 3,
    rotate: "rotate-90",
    node: "border-2 border-[#CAFFA6] bg-[#204654] text-[#CAFFA6] ring-4 ring-[#CAFFA6]/30",
    icon: "globe",
  },
];

function Symbol({ name, className = "" }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden>
      {name}
    </span>
  );
}

function FeatureCard({ card }) {
  return (
    <div
      className={`flex flex-col rounded-2xl p-4 text-left shadow-sm transition-transform duration-200 hover:-translate-y-1 ${card.className}`}
      style={card.style}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-lg ${card.iconWrap}`}
            style={card.iconStyle}
          >
            {card.icon === "business" ? (
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            ) : (
              <Symbol name={card.icon} className="text-[18px]" />
            )}
          </span>
          {card.dot ? <span className={`h-2 w-2 rounded-full ${card.dot}`} /> : null}
        </span>
      </div>
      <span className={`text-[15px] font-bold tracking-tight ${card.titleClass}`}>{card.title}</span>
      <p className={`mt-1 text-xs leading-snug ${card.bodyClass}`}>{card.body}</p>
    </div>
  );
}

function MilestoneIcon({ name }) {
  const common = {
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };
  if (name === "idea") {
    return (
      <svg {...common}>
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
      </svg>
    );
  }
  if (name === "launch") {
    return (
      <svg {...common}>
        <line x1="22" x2="11" y1="2" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    );
  }
  if (name === "layers") {
    return (
      <svg {...common}>
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="10" />
      <line x1="22" x2="2" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function Milestone({ item }) {
  const date = (
    <span className={item.dateClass || "text-sm font-bold tracking-wide text-[#777777]"}>{item.date}</span>
  );
  const copy = (
    <div className="text-center">
      <div className="inline-flex items-center gap-1.5">
        <h3 className="font-aeonik-regular text-base font-bold tracking-tight text-[#202020]">{item.title}</h3>
        {item.badge ? (
          <span className="rounded-full bg-[#CAFFA6] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#204654]">
            {item.badge}
          </span>
        ) : null}
      </div>
      <p className="mx-auto mt-1.5 max-w-[220px] text-xs leading-relaxed text-[#666666]">{item.body}</p>
    </div>
  );
  const stem = (
    <div className={`relative h-6 w-[2px] ${item.stem}`}>
      <div className={`absolute -bottom-1 -left-[2px] h-1.5 w-1.5 rounded-full ${item.dot}`} />
    </div>
  );

  return (
    <div className="relative z-10 flex w-[300px] shrink-0 flex-col items-center px-4 text-center sm:w-[320px]">
      <div className="flex h-[140px] flex-col items-center justify-end pb-1">
        {item.flip ? (
          <>
            {copy}
            <div className="mt-3">{stem}</div>
          </>
        ) : (
          <div className="pb-5">{date}</div>
        )}
      </div>
      <div className="group/node relative my-2 flex h-14 w-14 shrink-0 items-center justify-center">
        <svg className={`absolute inset-0 h-full w-full ${item.rotate}`} viewBox="0 0 56 56" fill="none" aria-hidden>
          <circle cx="28" cy="28" r="26" stroke={item.ring} strokeWidth={item.ringWidth || 2} strokeLinecap="round" strokeDasharray={item.dash} />
        </svg>
        <div className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-transform duration-200 group-hover/node:scale-110 ${item.node}`}>
          <MilestoneIcon name={item.icon} />
        </div>
      </div>
      <div className="flex h-[170px] flex-col items-center pt-1">
        {item.flip ? <div className="pt-5">{date}</div> : (
          <>
            <div className="mb-3">{stem}</div>
            {copy}
          </>
        )}
      </div>
    </div>
  );
}

function Timeline() {
  const scrollerRef = useRef(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let paused = false;
    let resumeTimer;
    let frame;
    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    const speed = 0.55;
    const stepSize = 320;

    const pause = (ms) => {
      paused = true;
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        paused = false;
      }, ms);
    };

    const tick = () => {
      if (!paused) {
        scroller.scrollLeft += speed;
        const half = scroller.scrollWidth / 2;
        if (scroller.scrollLeft >= half) scroller.scrollLeft -= half;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const onEnter = () => {
      paused = true;
    };
    const onLeave = () => {
      dragging = false;
      paused = false;
    };
    const onTouchStart = () => {
      paused = true;
    };
    const onTouchEnd = () => pause(1200);
    const onPrev = () => {
      pause(2500);
      const half = scroller.scrollWidth / 2;
      if (scroller.scrollLeft <= 5) scroller.scrollLeft += half;
      scroller.scrollBy({ left: -stepSize, behavior: "smooth" });
    };
    const onNext = () => {
      pause(2500);
      const half = scroller.scrollWidth / 2;
      if (scroller.scrollLeft >= half - 5) scroller.scrollLeft -= half;
      scroller.scrollBy({ left: stepSize, behavior: "smooth" });
    };
    const onDown = (event) => {
      dragging = true;
      paused = true;
      startX = event.pageX - scroller.offsetLeft;
      startScroll = scroller.scrollLeft;
    };
    const onUp = () => {
      dragging = false;
      pause(1500);
    };
    const onMove = (event) => {
      if (!dragging) return;
      event.preventDefault();
      const x = event.pageX - scroller.offsetLeft;
      scroller.scrollLeft = startScroll - (x - startX) * 1.5;
    };

    scroller.addEventListener("mouseenter", onEnter);
    scroller.addEventListener("mouseleave", onLeave);
    scroller.addEventListener("touchstart", onTouchStart, { passive: true });
    scroller.addEventListener("touchend", onTouchEnd);
    scroller.addEventListener("mousedown", onDown);
    scroller.addEventListener("mouseup", onUp);
    scroller.addEventListener("mousemove", onMove);
    const prev = document.getElementById("timeline-prev");
    const next = document.getElementById("timeline-next");
    prev?.addEventListener("click", onPrev);
    next?.addEventListener("click", onNext);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(resumeTimer);
      scroller.removeEventListener("mouseenter", onEnter);
      scroller.removeEventListener("mouseleave", onLeave);
      scroller.removeEventListener("touchstart", onTouchStart);
      scroller.removeEventListener("touchend", onTouchEnd);
      scroller.removeEventListener("mousedown", onDown);
      scroller.removeEventListener("mouseup", onUp);
      scroller.removeEventListener("mousemove", onMove);
      prev?.removeEventListener("click", onPrev);
      next?.removeEventListener("click", onNext);
    };
  }, []);

  return (
    <section className="w-full border-t border-[#E5E5E5] pt-10">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#204654]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">Our Journey</span>
          </div>
          <h2 className="font-aeonik-regular text-[28px] font-normal leading-tight tracking-tight text-[#202020]">
            From an idea to a new social experience.
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-end pb-1 sm:self-auto">
          <button
            id="timeline-prev"
            type="button"
            aria-label="Previous milestone"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E5E5] bg-white text-[#202020] shadow-sm transition-all hover:border-[#204654] hover:bg-[#F7F7F7] active:scale-95"
          >
            <Symbol name="chevron_left" className="text-[18px]" />
          </button>
          <button
            id="timeline-next"
            type="button"
            aria-label="Next milestone"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E5E5] bg-white text-[#202020] shadow-sm transition-all hover:border-[#204654] hover:bg-[#F7F7F7] active:scale-95"
          >
            <Symbol name="chevron_right" className="text-[18px]" />
          </button>
        </div>
      </div>
      <div className="relative w-full">
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-12 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-12 bg-gradient-to-l from-white to-transparent" />
        <div
          id="timeline-scroller"
          ref={scrollerRef}
          className="no-scrollbar w-full cursor-grab select-none overflow-x-auto scroll-smooth py-6 active:cursor-grabbing"
        >
          <div className="relative flex min-w-max items-center">
            <div className="pointer-events-none absolute left-0 right-0 top-1/2 z-0 h-[2px] -translate-y-1/2 bg-[#E5E5E5]" />
            <div className="flex shrink-0 items-center">
              {MILESTONES.map((item) => (
                <Milestone key={item.date} item={item} />
              ))}
            </div>
            <div className="flex shrink-0 items-center" aria-hidden>
              {MILESTONES.map((item) => (
                <Milestone key={`${item.date}-loop`} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FACTS = [
  ["Product", "Pintree"],
  ["A product of", "MCABEE DIGITAL"],
  ["Platform", "Social Networking"],
  ["Core Focus", "Social platform for people and communities"],
  ["Location", "Kerala, India"],
];

export default function AboutView() {
  return (
    <main className="mx-auto w-full max-w-[1536px] px-4 py-16 font-jakarta sm:px-8 md:py-24 xl:px-0">
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 20;
          display: inline-block;
          vertical-align: middle;
          line-height: 1;
          user-select: none;
        }
      `}</style>
      <div className="mx-auto w-full max-w-[1280px] space-y-24 md:space-y-32">
        <section className="relative w-full text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-[#F7F7F7] px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-[#204654]" />
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#204654]">About Pintree</span>
          </div>
          <h1 className="font-aeonik-regular mx-auto max-w-3xl text-[32px] font-normal leading-[40px] tracking-tight text-[#202020] md:text-[48px] md:leading-[56px]">
            A social space built around people, communities and possibilities.
          </h1>
          <p className="mx-auto mb-16 mt-4 max-w-2xl text-sm leading-relaxed text-[#525252] sm:text-base">
            Pintree brings people together through personal connections, shared interests and meaningful conversations. Explore communities, connect with others and discover experiences beyond your immediate network.
          </p>

          <div className="relative mx-auto flex w-full max-w-[1240px] select-none flex-col items-center justify-center gap-8 pt-4 pb-8 lg:min-h-[740px] xl:gap-12">
            <div className="pointer-events-none absolute inset-0 hidden items-center justify-center overflow-hidden lg:flex">
              <svg className="h-full min-w-[1000px] max-w-[1300px] w-full" viewBox="0 0 1200 760" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden>
                <ellipse cx="600" cy="380" rx="560" ry="260" stroke="#204654" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="3 9" />
                <ellipse cx="600" cy="380" rx="430" ry="190" stroke="#456978" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="4 6" />
                <ellipse cx="600" cy="380" rx="290" ry="130" stroke="#619044" strokeOpacity="0.4" strokeWidth="1.5" />
                <path d="M 130 250 L 320 180 L 460 260 M 320 380 L 460 400 M 130 510 L 320 580 L 460 520" stroke="#204654" strokeOpacity="0.3" strokeWidth="1.2" strokeDasharray="4 4" />
                <path d="M 1070 250 L 880 180 L 740 260 M 880 380 L 740 400 M 1070 510 L 880 580 L 740 520" stroke="#204654" strokeOpacity="0.3" strokeWidth="1.2" strokeDasharray="4 4" />
                <path d="M 460 260 Q 600 200 740 260 M 460 520 Q 600 580 740 520" stroke="#619044" strokeOpacity="0.4" strokeWidth="1.2" strokeDasharray="2 6" />
                {[
                  [130, 250, "#A9E0F1"],
                  [320, 180, "#CAFFA6"],
                  [320, 380, "#A9E0F1"],
                  [320, 580, "#CAFFA6"],
                  [130, 510, "#A9E0F1"],
                  [1070, 250, "#CAFFA6"],
                  [880, 180, "#A9E0F1"],
                  [880, 380, "#CAFFA6"],
                  [880, 580, "#A9E0F1"],
                  [1070, 510, "#CAFFA6"],
                ].map(([cx, cy, fill]) => (
                  <g key={`${cx}-${cy}`}>
                    <circle cx={cx} cy={cy} r="8" fill={fill} fillOpacity="0.55" />
                    <circle cx={cx} cy={cy} r="4" fill="#204654" />
                  </g>
                ))}
              </svg>
            </div>
            <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
              <div className="h-[560px] w-[560px] rounded-full bg-gradient-to-tr from-[#CAFFA6]/20 via-[#A9E0F1]/20 to-transparent opacity-60 blur-3xl" />
            </div>

            <div className="z-10 hidden w-full items-center justify-center gap-4 lg:flex xl:gap-5">
              <div className="flex h-[660px] w-[210px] shrink-0 flex-col justify-around xl:w-[225px]">
                {LEFT_OUTER.map((index) => (
                  <FeatureCard key={CARDS[index].title} card={CARDS[index]} />
                ))}
              </div>
              <div className="flex h-[680px] w-[210px] shrink-0 flex-col justify-between xl:w-[225px]">
                {LEFT_INNER.map((index) => (
                  <FeatureCard key={CARDS[index].title} card={CARDS[index]} />
                ))}
              </div>
              <div className="relative z-20 flex w-[260px] shrink-0 items-center justify-center xl:w-[280px]">
                <div className="overflow-hidden rounded-[2.75rem] shadow-xl ring-1 ring-black/10">
                  <img
                    src={APP_IMAGE}
                    alt="Pintree App Interface"
                    className="pointer-events-none block h-auto max-h-[640px] w-full select-none object-cover"
                  />
                </div>
              </div>
              <div className="flex h-[680px] w-[210px] shrink-0 flex-col justify-between xl:w-[225px]">
                {RIGHT_INNER.map((index) => (
                  <FeatureCard key={CARDS[index].title} card={CARDS[index]} />
                ))}
              </div>
              <div className="flex h-[660px] w-[210px] shrink-0 flex-col justify-around xl:w-[225px]">
                {RIGHT_OUTER.map((index) => (
                  <FeatureCard key={CARDS[index].title} card={CARDS[index]} />
                ))}
              </div>
            </div>

            <div className="z-10 flex w-full max-w-2xl flex-col items-center gap-8 lg:hidden">
              <div className="w-full max-w-[260px] overflow-hidden rounded-[2.75rem] shadow-xl ring-1 ring-black/10">
                <img src={APP_IMAGE} alt="Pintree App Interface" className="block h-auto w-full object-cover" />
              </div>
              <div className="grid w-full grid-cols-1 gap-3 text-left sm:grid-cols-2">
                {CARDS.map((card) => (
                  <FeatureCard key={card.title} card={card} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <Timeline />

        <section className="w-full border-t border-[#E5E5E5] pt-10">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="space-y-6 lg:col-span-6">
              <div className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#204654]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#777777]">The Company</span>
              </div>
              <h2 className="font-aeonik-regular text-[28px] font-normal leading-tight tracking-tight text-[#202020]">
                Behind Pintree.
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-[#525252]">
                Pintree is developed, owned and managed by <strong className="font-semibold text-[#202020]">MCABEE DIGITAL</strong>, a technology company focused on building digital products and connected experiences.
              </p>
              <p className="max-w-xl text-sm leading-relaxed text-[#666666]">
                We build with deliberate craftsmanship, treating privacy, calm interfaces, and human agency as core architectural principles rather than peripheral features.
              </p>
              <div className="mt-6 space-y-3 border-t border-[#E5E5E5]/80 pt-4">
                <h3 className="font-aeonik-medium text-[20px] font-medium tracking-tight text-[#202020]">Get in Touch.</h3>
                <p className="max-w-xl text-sm leading-relaxed text-[#525252]">
                  Have a question about Pintree, business enquiries or partnership opportunities? We&apos;d be happy to hear from you.
                </p>
                <a href="mailto:hello@pintree.co" className="inline-flex items-center gap-2 text-sm font-semibold text-[#204654] hover:underline">
                  <Symbol name="mail" className="text-[18px]" />
                  Contact Us (hello@pintree.co)
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-[#E5E5E5] bg-[#F7F7F7] p-6 sm:p-8">
                <div className="mb-2 flex items-center justify-between border-b border-[#E5E5E5] pb-4">
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-[#666666]">Company & Product Facts</span>
                  <Symbol name="corporate_fare" className="text-[18px] text-[#777777]" />
                </div>
                <div className="divide-y divide-[#E5E5E5] text-sm">
                  {FACTS.map(([label, value]) => (
                    <div key={label} className="flex items-start justify-between gap-4 py-3.5">
                      <span className="shrink-0 text-[#777777]">{label}</span>
                      <span className={`text-right text-[#202020] ${label === "A product of" ? "font-semibold" : "font-medium"}`}>{value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between gap-4 py-3.5">
                    <span className="text-[#777777]">Website</span>
                    <a href="https://www.mcabee.in/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-right font-medium text-[#202020] hover:underline">
                      www.mcabee.in
                      <Symbol name="north_east" className="text-[14px]" />
                    </a>
                  </div>
                  <div className="flex items-start justify-between gap-4 pt-3.5">
                    <span className="shrink-0 text-[#777777]">Recognition</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#CAFFA6] bg-[#CAFFA6]/30 px-2.5 py-1 text-right text-xs font-semibold text-[#204654]">
                      <Symbol name="verified" className="text-[14px]" />
                      Startup India – DPIIT Recognised
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
