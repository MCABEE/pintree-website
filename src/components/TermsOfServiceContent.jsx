import React from "react";
import content from "@/data/terms-content.json";
import { legalArticleClass } from "@/components/legalDocumentIntro";

const MAIN_SECTION_TITLES = new Set([
  "1. About Pintree and Your Relationship with Us",
  "2. Eligibility and Age Requirements",
  "3. Account Registration and Real Identity",
  "4. Account Types and Verification",
  "5. Communities, Rooms, Events, and Schedules",
  "6. Discover, Recommendations, and Content Discovery",
  "7. Content You Share",
  "8. License to User Content",
  "9. Content Visibility and Privacy",
  "10. Acceptable Use of Pintree",
  "11. Intellectual Property",
  "12. Moderation, Reporting, and Enforcement",
  "13. Safety and Our Responsibility",
  "14. User Content and Third-Party Conduct",
  "15. Account Suspension and Termination",
  "16. Third-Party Services and Links",
  "17. Platform Changes and Availability",
  "18. Monetization, Advertising, and Paid Features",
  "19. Disclaimers",
  "20. Limitation of Liability",
  "21. Indemnification",
  "22. Changes to These Terms",
  "23. Governing Law and Dispute Resolution",
  "24. General Legal Terms",
  "25. Contact Us",
  "Related Policies",
]);

const bodyBase =
  "text-[15px] sm:text-[16px] leading-[1.6] font-aeonik-regular text-[#000000] antialiased";
const bodyParagraph = `${bodyBase} pt-[10px]`;
const headingBase =
  "text-[15px] sm:text-[16px] leading-[1.6] text-[#000000] font-aeonik-bold";

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
    return "pt-3 sm:pt-4";
  }

  if (/^[A-Z]\.\s/.test(text)) {
    return "pt-4 sm:pt-5";
  }

  if (MAIN_SECTION_TITLES.has(text) || text === "Related Policies") {
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

  if (index === 0) {
    return (
      <p key={index} className="text-[15px] sm:text-[16px] font-aeonik-bold text-[#000000] leading-tight">
        Pintree
      </p>
    );
  }

  if (index === 1) {
    return (
      <p key={index} className="text-[15px] sm:text-[16px] font-aeonik-bold text-[#000000] leading-tight pt-1.5 sm:pt-2">
        Terms of Use
      </p>
    );
  }

  if (index === 2) {
    return (
      <p key={index} className="text-[15px] sm:text-[16px] font-aeonik-regular text-[#000000] leading-tight pt-3 sm:pt-4 pb-2 sm:pb-3">
        Last Updated: 1 October 2026
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

const TermsOfServiceContent = () => {
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
};

export default TermsOfServiceContent;
