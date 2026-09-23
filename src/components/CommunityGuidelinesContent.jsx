import content from "@/data/community-guidelines-content.json";
import {
  LastUpdatedLine,
  introDocumentTitleClass,
  introLastUpdatedClass,
  introPintreeClass,
  legalArticleClass,
} from "@/components/legalDocumentIntro";

const MAIN_SECTION_TITLES = new Set([
  "1. The Purpose of Pintree",
  "2. Our Community Values",
  "3. Content and Behavior That Are Not Allowed",
  "4. Politics and Public Affairs",
  "5. Religion, Faith and Belief",
  "6. Caste, Culture, Language and Community Identity",
  "7. Relationships, Friendship and Personal Discussions",
  "8. Personal Content and Everyday Sharing",
  "9. Communities and Community Administration",
  "10. Rooms and Discussions",
  "11. Events and Schedules",
  "12. Professional Accounts and Public-Facing Content",
  "13. Advertising, Promotion and Commercial Activity",
  "14. Copyright and Intellectual Property",
  "15. Spam and Manipulation",
  "16. Discovery, Keywords and Recommendations",
  "17. Comments, Reactions and Interactions",
  "18. Content Shared Through External Services",
  "19. Privacy and Personal Information",
  "20. Account Security and Authenticity",
  "21. Content That May Receive Additional Review",
  "22. Reporting Content and Accounts",
  "23. Moderation and Enforcement",
  "24. Community and Professional Account Responsibility",
  "25. Appeals and Review",
  "26. What We Expect From Everyone",
  "27. Our Approach to Differences",
  "28. Updates to These Guidelines",
  "29. Contact Us",
]);

const bodyBase =
  "text-[15px] sm:text-[16px] leading-[1.65] font-aeonik-regular text-[#000000] antialiased";
const bodyParagraph = `${bodyBase} pt-4`;
const headingBase =
  "text-[15px] sm:text-[16px] leading-[1.65] text-[#000000] font-aeonik-bold";

function RunText({ runs }) {
  if (!runs) return null;
  return runs.map((run, index) => {
    if (!run.text) return null;

    const weight = run.bold ? "font-aeonik-bold" : "font-aeonik-regular";
    const decoration = run.underline ? "underline underline-offset-[2px]" : "";

    if (run.text.includes("@") && run.text.includes(".")) {
      return (
        <a
          key={index}
          href={`mailto:${run.text.trim()}`}
          className={`${weight} ${decoration} text-[#000000]`.trim()}
        >
          {run.text}
        </a>
      );
    }

    return (
      <span key={index} className={`${weight} ${decoration}`.trim() || undefined}>
        {run.text}
      </span>
    );
  });
}

function isFullyBold(runs) {
  if (!runs) return false;
  const meaningful = runs.filter((run) => run.text.trim());
  return meaningful.length > 0 && meaningful.every((run) => run.bold);
}

function getHeadingSpacing(text) {
  if (/^\d+\.\d+/.test(text)) {
    return "pt-4 sm:pt-5";
  }

  if (/^[A-Z]\.\s/.test(text)) {
    return "pt-5 sm:pt-6";
  }

  if (MAIN_SECTION_TITLES.has(text)) {
    return "pt-8 sm:pt-10";
  }

  if (/^\d+\.\s/.test(text)) {
    return "pt-4 sm:pt-5";
  }

  return "pt-4";
}

function renderParagraph(block, index) {
  const { text, runs } = block;

  if (index === 0) {
    return (
      <p key={index} className={introPintreeClass}>
        Pintree
      </p>
    );
  }

  if (index === 1) {
    return (
      <p key={index} className={introDocumentTitleClass}>
        Community Guidelines
      </p>
    );
  }

  if (index === 2) {
    return (
      <p key={index} className={introLastUpdatedClass}>
        <LastUpdatedLine text={text} />
      </p>
    );
  }

  if (isFullyBold(runs)) {
    return (
      <p key={index} className={`${headingBase} ${getHeadingSpacing(text)}`}>
        <RunText runs={runs} />
      </p>
    );
  }

  return (
    <p key={index} className={bodyParagraph}>
      <RunText runs={runs} />
    </p>
  );
}

export default function CommunityGuidelinesContent() {
  const elements = [];
  let listBuffer = [];

  const flushList = (keyPrefix) => {
    if (!listBuffer.length) return;

    elements.push(
      <ul
        key={`${keyPrefix}-list`}
        className="mt-2 list-disc space-y-2 pl-5 ms-1 marker:text-[#000000]"
      >
        {listBuffer.map((item, itemIndex) => (
          <li
            key={`${keyPrefix}-item-${itemIndex}`}
            className={`${bodyBase} pl-0.5`}
          >
            <RunText runs={item.runs} />
          </li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  content.forEach((block, index) => {
    if (block.type === "blank") {
      flushList(index);
      elements.push(<div key={`spacer-${index}`} className="h-4" aria-hidden />);
      return;
    }

    if (block.type === "list") {
      listBuffer.push(block);
      return;
    }

    flushList(index);
    elements.push(renderParagraph(block, index));
  });

  flushList("final");

  return (
    <article className={legalArticleClass}>
      {elements}
    </article>
  );
}
