"use client";

import Icon from "./Icon";

export default function OnboardingBottomBar({
  currentStep = 1,
  totalSteps = 5,
  onBack,
  onNext,
  onSaveDraft,
  isSavingDraft = false,
  isSubmitting = false,
  nextDisabled = false,
  nextLabel = "Continue",
  showBack = true,
  isDraftSaved = false,
  isSubmitType = false,
  className = "",
}) {
  return (
    <footer className={`mt-10 sm:mt-12 pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E5E5E5] w-full ${className}`}>
      <div>
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSavingDraft}
          className="px-5 py-2.5 rounded-lg bg-[#f0eded] hover:bg-[#e4e2e2] text-on-surface text-[14px] font-medium transition-colors cursor-pointer disabled:opacity-50"
        >
          {isSavingDraft ? "Saving..." : isDraftSaved ? "Saved to Drafts" : "Save as Draft"}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
        {/* Step indicator + Progress Bar */}
        <div className="flex items-center gap-3">
          <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">
            Step {currentStep} of {totalSteps}
          </span>
          <div className="w-20 sm:w-24 h-1.5 bg-[#e4e2e2] rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(10, (currentStep / totalSteps) * 100))}%` }}
            />
          </div>
        </div>

        {/* Action Buttons: Back + Continue */}
        <div className="flex items-center gap-3">
          {showBack && onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 rounded-lg bg-[#f0eded] hover:bg-[#e4e2e2] text-on-surface text-[14px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>← Back</span>
            </button>
          )}

          <button
            type={isSubmitType ? "submit" : "button"}
            onClick={isSubmitType ? undefined : onNext}
            disabled={nextDisabled || isSubmitting}
            className={`px-6 py-2.5 rounded-lg font-label-md text-label-md font-medium transition-all flex items-center gap-2 cursor-pointer ${
              nextDisabled || isSubmitting
                ? "bg-[#e4e2e2] text-[#8e8e8e] cursor-not-allowed shadow-none"
                : "bg-black hover:bg-neutral-800 text-white shadow-sm cursor-pointer"
            }`}
          >
            {isSubmitting && <Icon name="progress_activity" className="animate-spin text-[16px]" />}
            <span>{isSubmitting ? "Processing..." : nextLabel}</span>
            {!isSubmitting && <Icon name="arrow_forward" className="text-[16px]" />}
          </button>
        </div>
      </div>
    </footer>
  );
}
