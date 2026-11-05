const AUTHOR_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAd-M9VIRpFx1-cPl3w6Mp71Y4hbomr1Mp9lIe5qY5A2IvDd4C_J5t8gq9r3gNLt3L2wtgUxQKxbsHM6rDlIyO49kjXO2hIghyXZzO43lHb1Js4j7pfTIkuOU3aWkdRgfDjfsBvnAVeOR_tZ10Qw9GaJ_j5rb-M5mVV-dyYtlv-n9fwAC35H6D6Cw71pEpgVdjYopvkwz8wGVzIIw8TEqJnsBwGbVSZ3KUTu65eSd1dMWA7e2CkdJsO";

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const FLAGSHIP = {
  slug: "introducing-a-new-space",
  category: "Announcements",
  date: "October 28, 2026",
  dateTime: "2026-10-28",
  title:
    "Introducing a New Space for People, Communities and Conversations",
  summary:
    "Discover how Pintree brings people together through shared interests, meaningful connections and community-driven conversations.",
  excerpt:
    "Discover how Pintree brings people together through shared interests, meaningful connections and community-driven conversations.",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBfCHQE-fzqe-93hnrm9Hmd_lj7nO40Hzk-_nRVBYv-3y02uFPJZid3xLf1YWqsj4zY-tWvJ0xBWLWGyFREWOtRXn-wUXcyxhgH8AfyghHm-XL0eRPc26BYB2wKFwYe9JPmeBrk_uk4EBbzs6Ytg2q74jw8kGtnq-F_ps5ckj3RPZ16moyzRVHzEK7U4nZ73FZzTIB1p5rrzA0MmL6173cfMITKgd6D0hWS32XrU8awA2TPv8XnyS5RRIghXfv4L-Q_",
  imageAlt:
    "Editorial studio and community workshop at Pintree HQ exploring intentional social spaces",
  caption:
    "Editorial studio and community workshop at Pintree HQ exploring intentional social spaces.",
  readTime: "5 min read",
  author: "Pintree Editorial Team",
  authorImage: AUTHOR_IMAGE,
  lead: "Pintree is designed around the idea that social interaction can be more meaningful when people have spaces to connect through shared interests and conversations.",
  paragraphs: [
    "In an era defined by endless recommendation feeds and algorithmic broadcast loops, digital conversation often loses its human pace. At Pintree, we set out to build an intentional alternative—a calm, participatory platform where depth replaces outrage, and community cohesion replaces fleeting vanity metrics.",
  ],
  sections: [
    {
      heading: "A space built around meaningful connections",
      paragraphs: [
        "Real connection doesn't happen through algorithmic pressure or superficial engagement counts. It happens when individuals feel safe sharing who they are, finding peers with shared curiosity, and engaging in conversations where every voice carries intent.",
        "By shifting the focus from individual performance to shared spaces, Pintree creates room for thoughtful dialogue. Whether you are an independent publisher, a civic collective, a local maker, or someone seeking genuine camaraderie, Pintree offers a calm architecture that respects your attention.",
      ],
    },
    {
      type: "quote",
      text: "Digital social spaces should inspire presence rather than extraction. When communities have sovereign, focused rooms, conversation returns to its natural human rhythm.",
      cite: "Marcus Vance, Head of Design & Community Architecture at Pintree",
    },
    {
      heading: "Bringing people and communities together",
      paragraphs: [
        "From personal profiles to shared community spaces, Pintree brings different ways of connecting into one experience. People can build relationships, participate in communities and explore conversations that extend beyond their immediate network.",
        "Rather than flattening every interaction into a single noisy timeline, Pintree organizes social life into natural, contextual tiers. Your personal connections remain distinct, while your community passions flourish in dedicated, focused hubs.",
      ],
    },
    {
      type: "figure",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDQXQDisEBzhEzufneBDE_sU89p9p6fvTwbuNJcQ1CHh6C5kVTeCUez5LopJXtQ2vmO5AMjku9i-6CAnBHSC_w9ABx1z1TLs5UQjmB8ekBrT8etkYCgYI3sbwHFB5Mcghzm_2SI8y6a-zjL7KNzBTGB2RliImdRfJpcM9Qjduhryqnb_XW4kJiNC5oP8kbPl2H7x6kLo6x8A9hvGDqUdHAfLZyG0E25SN4uoVoC8C58VSOX0gHKiYga9-unAepJ_3pf",
      imageAlt:
        "Community-driven spaces allow participants to connect across common interests without performative pressure",
      caption:
        "Community-driven spaces allow participants to connect across common interests without performative pressure.",
    },
    {
      type: "list",
      heading: "Five connected experiences",
      intro:
        "Pintree brings together five core experiences that work harmoniously across desktop and mobile devices:",
      items: [
        {
          title: "People",
          text: "Personal profiles and authentic identity that express who you are with granular audience tiers.",
        },
        {
          title: "Communities",
          text: "Dedicated spaces built around shared interests, creative collectives, and organizations.",
        },
        {
          title: "Discovery",
          text: "Exploring people, posts, and communities beyond your existing circle through human curation.",
        },
        {
          title: "Rooms",
          text: "Focused, low-stimulus conversation spaces within communities that give structure to discussion.",
        },
        {
          title: "Connections",
          text: "Building reciprocal relationships, following thinkers, and staying connected with your inner circle.",
        },
      ],
    },
    {
      heading: "A more participatory social experience",
      paragraphs: [
        "Pintree aims to create an environment where people can participate, exchange ideas and develop meaningful connections around the things that matter to them.",
        "As we roll out the new platform to global communities, our team remains committed to the principle that digital technology should serve human dignity, quiet craftsmanship, and democratic interaction. We invite you to join us in shaping this space together.",
      ],
    },
  ],
  relatedSlugs: [
    "our-2026-transparency-report",
    "expanding-community-sovereignty",
    "pintree-for-ios-and-android",
  ],
};

const RELATED = [
  {
    slug: "our-2026-transparency-report",
    category: "Announcements",
    date: "Apr 9, 2026",
    dateTime: "2026-04-09",
    title:
      "Our 2026 Transparency Report: Trust, user safety and algorithmic intentionality",
    summary:
      "A comprehensive review of Pintree's content moderation architecture, privacy protocols, and community safeguards.",
    excerpt:
      "A comprehensive review of Pintree's content moderation architecture, privacy protocols, and community safeguards.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCi4LXlwpnMpzyWCEoDTJbz2DknqhQuAHhtHMUVPRNSwxRDt0_U1xutGHx-rEUFUvSXDZAteJIAiyATCtm0X7n4FiJ-CkUppk885zU1GltSCkhPEgLTZgkhhAlVwSkUHlvYnLOmZFUTYGou0CRRjsloR1YVUr0cYBHX5ZQwvMaBNtASiK1fnUOoueu9B9w6aiBCC6ihitlVTP3gzN_h6SWwJCIXIwTvpAm8J36pukZUDDEFi04FaQd_H0EwpKITs2Fa",
    imageAlt: "Our 2026 Transparency Report",
    caption: "Our 2026 Transparency Report.",
  },
  {
    slug: "expanding-community-sovereignty",
    category: "Announcements",
    date: "Jan 14, 2026",
    dateTime: "2026-01-14",
    title:
      "Expanding Community Sovereignty: Introducing decentralized room protocols",
    summary:
      "How independent groups can now govern their own discussion spaces, member permissions, and archival policies.",
    excerpt:
      "How independent groups can now govern their own discussion spaces, member permissions, and archival policies.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAwmqN1nqe5yBermDTDE2ZZ4GEPVe_MqO9Mm6zp-UWuM6bMyO5aB6hwPEAxS4tiU06ODujgoPXZACGLwDU_Q-4KRRxlzCnG5gu6hMwbsroYCmhZo2yC_duQgbumAeTtJv1mnG8uFKg9K_EwC8GqMBtt8QPlNFI6i47uoI2v4mSuGa1rGtxTKieDKXstZt01cOj3c56LxVD17GUBAGX7dxHtgW_Oz1uZR1opq52bOs9bAeDVa4QHITLtLpY6TJOX0r_0",
    imageAlt: "Expanding Community Sovereignty",
    caption: "Expanding Community Sovereignty.",
  },
  {
    slug: "pintree-for-ios-and-android",
    category: "Announcements",
    date: "Nov 18, 2025",
    dateTime: "2025-11-18",
    title:
      "Pintree for iOS and Android: A quiet mobile social client built for deep conversation",
    summary:
      "Native applications designed with calm typography, zero autoplay triggers, and thoughtful thread navigation.",
    excerpt:
      "Native applications designed with calm typography, zero autoplay triggers, and thoughtful thread navigation.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD7HGUk8MSavj0hrKC8j9zXwFfz4jwK-xcjofUm4ed6TBINEZyqLG1toSqQcE0ubTn92vY3btsxQv8aYWgj8B4PhGlO952Z0ieWPFOo-FYvU63sqZdZ4itUfNKTTA7rABFli40U1p44bwW-d50f4C7Ezf-ZaECTJsINnSRnqig7Qn8ZftY1tLfgPNoJ5ZMo0y158JvShzZMXMukfvKA-D8sYyGYXXIrtP91cS4M1lNNaA7fab7IfUtNCVkWIwku5Twn",
    imageAlt: "Pintree for iOS and Android",
    caption: "Pintree for iOS and Android.",
  },
];

function withDefaults(article) {
  return {
    ...FLAGSHIP,
    ...article,
    slug: article.slug,
    readTime: FLAGSHIP.readTime,
    author: FLAGSHIP.author,
    authorImage: FLAGSHIP.authorImage,
    lead: FLAGSHIP.lead,
    paragraphs: FLAGSHIP.paragraphs,
    sections: FLAGSHIP.sections,
    image: article.image || FLAGSHIP.image,
    imageAlt: article.imageAlt || FLAGSHIP.imageAlt,
    caption: article.caption || FLAGSHIP.caption,
    summary: article.summary || article.excerpt || FLAGSHIP.summary,
    relatedSlugs: FLAGSHIP.relatedSlugs,
  };
}

export const FEATURED = {
  category: FLAGSHIP.category,
  date: FLAGSHIP.date,
  dateTime: FLAGSHIP.dateTime,
  title: FLAGSHIP.title,
  excerpt: FLAGSHIP.excerpt,
  image: FLAGSHIP.image,
  imageAlt: FLAGSHIP.imageAlt,
  slug: FLAGSHIP.slug,
};

export const UPDATES = [
  {
    category: "Product Updates",
    date: "May 10, 2025",
    dateTime: "2025-05-10",
    title:
      "Introducing Focused Rooms: Intimate topic spaces within larger communities",
    excerpt:
      "Focused Rooms give communities a quieter place for a single topic, with a calmer pace than the wider feed.",
  },
  {
    category: "Company News",
    date: "May 2, 2025",
    dateTime: "2025-05-02",
    title:
      "Pintree appoints Elena Rostova as Vice President of Community Integrity",
    excerpt:
      "Elena Rostova joins Pintree to lead community integrity, trust, and the standards that keep conversations civil.",
  },
  {
    category: "Stories",
    date: "Apr 26, 2025",
    dateTime: "2025-04-26",
    title:
      "How independent book clubs and creative collectives found a new home on Pintree",
    excerpt:
      "Independent book clubs and creative collectives describe how Pintree became a home for slower, shared conversation.",
  },
  {
    category: "Product Updates",
    date: "Apr 18, 2025",
    dateTime: "2025-04-18",
    title:
      "Enhanced privacy controls: Granular audience tiers for personal profiles",
    excerpt:
      "Audience tiers let people choose who can see each part of a profile, from a close circle to a public community.",
  },
  {
    category: "Announcements",
    date: "Apr 9, 2025",
    dateTime: "2025-04-09",
    title:
      "Our 2025 Transparency Report: Trust, user safety and algorithmic intentionality",
    excerpt:
      "The 2025 Transparency Report covers trust, user safety, and how Pintree approaches algorithmic intentionality.",
  },
].map((item) => ({ ...item, slug: slugify(item.title) }));

export const MORE = [
  {
    category: "Announcements",
    date: "May 14, 2025",
    dateTime: "2025-05-14",
    title:
      "Pintree 2.0: Reimagining community spaces with purposeful human connection",
    excerpt:
      "Today we are unveiling a fundamental evolution of Pintree. With native Rooms, quiet conversation spaces, and verified interest communities, we are building a digital town square designed for depth, civility, and genuine belonging.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA4LWIbN6O0N3UV4ueZOQMll_YXMYeDd1zwQLQ-c1ypURTEW8hihQsIdU89we_XgXLrbEE9jftPsRuIA_DjTWiy0AEinSchvM7Y1GpG18gcWW3wfyQhPGe-yuq590JS8XScadXwsIQ3Hx7ug0sXlFMFttV42UvHlGDklexZBiwDiMccRRn0ZM5nX36lES7weKk3yrCVc_HOkovYddueg2CUmdw2fuw0OqgmQvEYLk3KrmxQZYmRZsXdSgOrGJcQXcpO",
    imageAlt: "Pintree creative community collaboration",
  },
  {
    category: "Product Updates",
    date: "Mar 28, 2025",
    dateTime: "2025-03-28",
    title:
      "Designed for calm: Why we removed infinite video autoplay and engagement counters",
    excerpt:
      "An inside look into our product philosophy and the conscious choice to prioritize conversational retention over dopamine-driven scrolling mechanics.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB81C4nZpGFKZm93pSBbi65CVtpTc0yau4GIPsZ2Dlul-LX1E6gPVEmknPeTQm07PMimFeK1_RUpY2OtoWzcZz_JjzeC5Q1e-lgpn5niMu7PgO0QI0b09rXWCq8Nuqu7eHeAbCUanuqHm2Qdt5COIUsM_oXQB8OGrqXW3EYH2X0iKmhJKhhX3IHzZT7HZcQRuqDA85e6LqIzkjzg-UjqYU-4wCu563FE_Uev5cMUu-RsPPa_tng3Bb28i4pWnpLotxo",
    imageAlt: "Pintree mobile community threads interface",
  },
  {
    category: "Stories",
    date: "Mar 14, 2025",
    dateTime: "2025-03-14",
    title:
      "Building offline solidarity through local neighborhood hubs and micro-spaces",
    excerpt:
      "Community organizers share how Pintree’s geographical discovery tools helped bridge online organization into physical community gardens and community dinners.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAWPuLlCzWooM5LYBIlDgtHrQw4CjxpBngm2T6nXoEM75-zM0wcagENIIA7-PGThlujVsjGYlooqRourK2s4lKzNYYAFFUWjFCHfmcJhznrXHh_-3FOPUZFwpi5a4IPAoFaMwrHVgvYB_Sxxco4ZaKNNNui08LVdSUQhOZjlH9u5_xMpkSMyT8cvCyrjQTSQI2ygDQtNz2JKxg9tMTAH9x0sCmvIpAPi896taVVSns",
    imageAlt: "Friends conversing in a library cafe",
  },
  {
    category: "Company News",
    date: "Feb 27, 2025",
    dateTime: "2025-02-27",
    title:
      "The Craft of Pintree: Our open-source design system and editorial principles",
    excerpt:
      "Head of Design Marcus Vance outlines our typography guidelines, spacing rhythms, and why digital social software deserves the quiet craft of print publishing.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCITOR1MkUh07cPrOuC8LiWl8frBfU1dr-VbogicLEm93qs5kP2MaQ0iGM1jx3LtP-x5EPaDuFBdW5CUGVWMEtnbxHGRXJeQY7Rl5lObm2JMvhIoAGGu-e58MQOAV7-m6W9EU3p7gZVEvYLatBGZMNLuQlRhVmu_x24PFLVjInWT3uOPHNLhyWXnJPR0UsHUUKwmqsYNDSPAk4Z1zcFCXoQL3xKZHpLyAZeYhsHZLE",
    imageAlt: "Design craft studio workbench",
  },
].map((item) => ({ ...item, slug: slugify(item.title) }));

const ARTICLES = [
  FLAGSHIP,
  ...RELATED.map(withDefaults),
  ...UPDATES.map(withDefaults),
  ...MORE.map(withDefaults),
];

const BY_SLUG = new Map(ARTICLES.map((article) => [article.slug, article]));

export function getArticle(slug) {
  return BY_SLUG.get(slug) || null;
}

export function getAllSlugs() {
  return ARTICLES.map((article) => article.slug);
}

export function getRelated(article) {
  const cards = FLAGSHIP.relatedSlugs
    .map((slug) => BY_SLUG.get(slug))
    .filter(Boolean);

  if (!cards.some((item) => item.slug === article.slug)) return cards;

  return [BY_SLUG.get(FLAGSHIP.slug), ...cards.filter((item) => item.slug !== article.slug)].slice(0, 3);
}

export function monthYear(date) {
  const parts = date.split(" ");
  if (parts.length < 3) return date;
  return `${parts[0]} ${parts[2]}`;
}
