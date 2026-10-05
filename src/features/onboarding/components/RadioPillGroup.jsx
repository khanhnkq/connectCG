import React from "react";

/**
 * RadioPillGroup: Thẻ chọn đơn phẳng tái sử dụng
 * - Dùng cho Giới tính, Tình trạng hôn nhân, Mục đích tham gia
 * - 0px drop shadow, 0px blur
 * - Viền 1px crisp, bo rounded-xl
 * - Hiệu ứng active cam Tangerine
 */
export default function RadioPillGroup({
  label,
  options = [],
  value,
  onChange,
  error,
  disabled = false,
  columns = 3,
}) {
  const gridColsClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 3
      ? "grid-cols-3"
      : "grid-cols-1 sm:grid-cols-3";

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-xs font-bold text-text-main select-none">
          {label}
        </label>
      )}

      <div className={`grid ${gridColsClass} gap-2.5`}>
        {options.map((option) => {
          const isSelected = value === option.value;
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange?.(option.value)}
              className={`p-3.5 rounded-xl border text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer select-none ${
                isSelected
                  ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                  : "border-border-main bg-surface-main hover:bg-surface-subtle text-text-secondary hover:text-text-main"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {Icon && (
                <Icon
                  size={24}
                  className={`transition-colors shrink-0 ${
                    isSelected ? "text-primary" : "text-text-muted"
                  }`}
                  weight={isSelected ? "bold" : "regular"}
                />
              )}
              <span className="text-xs font-bold leading-tight">
                {option.label}
              </span>
              {option.description && (
                <span className="text-[10px] text-text-muted leading-none">
                  {option.description}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-xs text-danger font-medium leading-none">{error}</p>
      )}
    </div>
  );
}
