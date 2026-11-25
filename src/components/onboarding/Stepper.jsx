"use client";

import Icon from "./Icon";

const STEPS = [
  {
    stepNumber: 1,
    label: "STEP 01",
    title: "Organisation Information",
    subtitle: "Media & establishment specs",
  },
  {
    stepNumber: 2,
    label: "STEP 02",
    title: "Founder & Owner",
    subtitle: "Key leadership credentials",
  },
  {
    stepNumber: 3,
    label: "STEP 03",
    title: "Verification Documents",
    subtitle: "Registry & press accreditation",
  },
  {
    stepNumber: 4,
    label: "STEP 04",
    title: "Review & Submit",
    subtitle: "Final validation and audit",
  },
  {
    stepNumber: 5,
    label: "STEP 05",
    title: "Account Credentials",
    subtitle: "Access & security setup",
  },
];

export default function Stepper({ currentStep = 1, onStepClick = null }) {
  return (
    <div className="w-full mb-12">
      <nav aria-label="Registration Progress" className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative">
          {STEPS.map((step, idx) => {
            const isCompleted = currentStep > step.stepNumber;
            const isActive = currentStep === step.stepNumber;
            const isUpcoming = currentStep < step.stepNumber;
            const isLast = idx === STEPS.length - 1;

            return (
              <div
                key={step.stepNumber}
                onClick={() => {
                  if (onStepClick && isCompleted) onStepClick(step.stepNumber);
                }}
                className={`flex items-center md:flex-col md:items-start gap-4 relative group ${
                  onStepClick && isCompleted ? "cursor-pointer hover:opacity-90" : ""
                } ${isUpcoming ? "opacity-60" : ""}`}
              >
                <div className="flex items-center gap-3 w-full">
                  {isCompleted ? (
                    <div className="w-9 h-9 rounded-xl bg-secondary text-on-secondary flex items-center justify-center font-label-md text-label-md font-semibold shrink-0 shadow-sm">
                      <Icon name="check" className="text-[18px]" />
                    </div>
                  ) : isActive ? (
                    <div className="w-9 h-9 rounded-xl bg-secondary text-on-secondary flex items-center justify-center font-label-md text-label-md font-semibold shrink-0 shadow-sm ring-4 ring-secondary-container">
                      {step.stepNumber}
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-label-md text-label-md font-medium shrink-0">
                      {step.stepNumber}
                    </div>
                  )}
                  {!isLast && (
                    <div
                      className={`hidden md:block w-full h-[2px] ${
                        isCompleted ? "bg-secondary" : "bg-surface-container-highest"
                      }`}
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-label-sm text-label-sm uppercase tracking-wider mb-0.5 ${
                      isActive || isCompleted
                        ? "text-secondary font-semibold"
                        : "text-on-surface-variant font-medium"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span
                    className={`font-title-md text-title-md leading-tight ${
                      isActive || isCompleted
                        ? "text-primary font-semibold"
                        : "text-on-surface font-medium"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant hidden md:block mt-0.5">
                    {step.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
