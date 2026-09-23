import content from "@/data/privacy-policy-content.json";
import { legalArticleClass } from "@/components/legalDocumentIntro";

const MAIN_SECTION_TITLES = new Set([
  "1. Information We Collect",
  "2. Information We Receive from Other Sources",
  "3. Information Collected Automatically",
  "4. Device Permissions",
  "5. How We Use Your Information",
  "6. Legal Bases for Processing",
  "7. How We Share Your Information",
  "8. Public Content and Visibility",
  "9. Information About Other People",
  "10. Your Privacy Rights and Choices",
  "11. Data Retention",
  "12. Data Security",
  "13. International Data Transfers",
  "14. Children's and Minors' Privacy",
  "15. Third-Party Services and Links",
  "16. Advertising and Monetization",
  "17. Data from Professional and Business Accounts",
  "18. Automated Processing and Personalization",
  "19. Your Responsibilities Regarding Privacy",
  "20. Changes to This Privacy Policy",
  "21. Contact Us",
]);

const bodyBase =
  "text-[12px] sm:text-[12px] leading-[1.6] font-aeonik-regular text-[#000000] antialiased max-sm:text-[13px] max-sm:leading-[1.6]";
const bodyParagraph = `${bodyBase} pt-[10px]`;
const headingBase =
  "text-[12px] sm:text-[12px] leading-[1.6] text-[#000000] font-aeonik-bold max-sm:text-[13px]";

function RunText({ runs }) {
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
  const meaningful = runs.filter((run) => run.text.trim());
  return meaningful.length > 0 && meaningful.every((run) => run.bold);
}

function getHeadingSpacing(text) {
  if (/^\d+\.\d+/.test(text)) {
    return "pt-3 sm:pt-4";
  }

  if (/^[A-Z]\.\s/.test(text)) {
    return "pt-4 sm:pt-5";
  }

  if (MAIN_SECTION_TITLES.has(text) || text === "Summary") {
    return "pt-6 sm:pt-7";
  }

  if (/^\d+\.\s/.test(text)) {
    return "pt-3 sm:pt-4";
  }

  return "pt-3";
}

function renderParagraph(block, index) {
  const { text, runs } = block;

  if (text.startsWith("MCABEE DIGITAL715A") || text.startsWith("MCABEE DIGITAL715")) {
    return (
      <p key={index} className={bodyParagraph}>
        <span className="block font-aeonik-bold">MCABEE DIGITAL</span>
        <span className="block font-aeonik-regular">715A, Spencer Plaza, Mount Road, Anna Salai,</span>
        <span className="block font-aeonik-regular">Chennai – 600002, India</span>
      </p>
    );
  }

  if (text.startsWith("Privacy Contact:")) {
    return (
      <div key={index} className={bodyParagraph}>
        <p className="font-aeonik-bold">Privacy Contact:</p>
        <p className="pt-2 font-aeonik-regular">
          <span className="font-aeonik-bold">Email:</span>{" "}
          <a
            href="mailto:contact@pintree.co"
            className="font-aeonik-bold underline underline-offset-[2px] text-[#000000]"
          >
            contact@pintree.co
          </a>
        </p>
      </div>
    );
  }

  if (index <= 2) {
    return (
      <p
        key={index}
        className={`${bodyBase} ${index === 0 ? "pt-0" : "pt-0 leading-[1.5]"}`}
      >
        <RunText runs={runs} />
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

export default function PrivacyPolicyContent() {
  const elements = [];
  let listBuffer = [];

  const flushList = (keyPrefix) => {
    if (!listBuffer.length) return;

    elements.push(
      <ul
        key={`${keyPrefix}-list`}
        className="mt-[10px] list-disc space-y-[10px] pl-5 ms-1 marker:text-[#000000]"
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
      elements.push(<div key={`spacer-${index}`} className="h-3" aria-hidden />);
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
