export const legalArticleClass =
  "mx-auto w-full max-w-[830px] pl-6 sm:pl-[52px] pr-6 sm:pr-8 pb-[80px] sm:pb-[96px] pt-[18px] sm:pt-[20px]";

export const introPintreeClass =
  "text-[16px] leading-[24px] tracking-[-0.0125em] font-aeonik-medium text-[#000000] antialiased";

export const introDocumentTitleClass =
  "text-[16px] leading-[24px] tracking-[-0.0125em] font-aeonik-regular text-[#000000] antialiased mt-[25px]";

export const introLastUpdatedClass =
  "text-[16px] leading-[24px] tracking-[-0.0125em] antialiased mt-[25px] mb-2 sm:mb-3";

export function LastUpdatedLine({ text }) {
  const match = text.match(/^Last Updated:\s*(.+)$/i);

  if (!match) {
    return (
      <span className="font-aeonik-regular text-[#333333]">{text}</span>
    );
  }

  return (
    <>
      <span className="font-aeonik-regular text-[#333333]">Last Updated: </span>
      <span className="font-aeonik-medium text-[#1A1A1A]">{match[1]}</span>
    </>
  );
}
