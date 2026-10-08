import React from "react";
import { Check } from "@phosphor-icons/react";

const STEPS = [
  { id: 1, title: "Danh tính", subtitle: "Ảnh & Thông tin" },
  { id: 2, title: "Định hướng", subtitle: "Mục đích kết nối" },
  { id: 3, title: "Sở thích", subtitle: "Đam mê & Khu vực" },
];

/**
 * Modern Flat Onboarding Stepper
 * - Thanh tiến trình phẳng 1px border
 * - 0px drop shadow, 0px blur
 * - Hiển thị bước hiện tại, bước đã xong, % hoàn thành
 */
export default function OnboardingStepper({ activeStep }) {
  const progressPercent = Math.round((activeStep / STEPS.length) * 100);

  return (
    <div className="w-full mb-8">
      {/* Step Numbers & Titles */}
      <div className="flex items-center justify-between gap-2 mb-3">
        {STEPS.map((step) => {
          const isCompleted = activeStep > step.id;
          const isCurrent = activeStep === step.id;

          return (
            <div
              key={step.id}
              className={`flex-1 flex items-center gap-2.5 transition-colors ${
                isCurrent
                  ? "text-primary"
                  : isCompleted
                  ? "text-text-main"
                  : "text-text-muted"
              }`}
            >
              <div
                className={`size-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors border-0 ${
                  isCompleted
                    ? "bg-primary text-white"
                    : isCurrent
                    ? "bg-primary/10 text-primary"
                    : "bg-surface-subtle text-text-muted"
                }`}
              >
                {isCompleted ? <Check size={14} weight="bold" /> : step.id}
              </div>

              <div className="hidden sm:block text-left truncate">
                <p className="text-xs font-bold leading-none truncate">
                  {step.title}
                </p>
                <p className="text-[10px] text-text-muted mt-0.5 truncate">
                  {step.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-1.5 bg-surface-subtle border-0 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
