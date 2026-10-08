import React from "react";
import { HOBBIES_LIST } from "../constants/hobbies";

/**
 * HobbiesSelector: Grid 12 sở thích đa lựa chọn
 * - 0px drop shadow, 0px blur
 * - Viền 1px, bo rounded-xl
 * - Hiển thị badge số lượng đã chọn
 */
export default function HobbiesSelector({
  selectedHobbies = [],
  onChange,
  error,
  disabled = false,
}) {
  const handleToggle = (hobbyId) => {
    if (disabled) return;
    if (selectedHobbies.includes(hobbyId)) {
      onChange?.(selectedHobbies.filter((id) => id !== hobbyId));
    } else {
      onChange?.([...selectedHobbies, hobbyId]);
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between select-none">
        <label className="block text-xs font-bold text-text-main">
          Sở thích của bạn <span className="text-danger">*</span>
        </label>
        <span className="text-[11px] font-semibold text-text-muted">
          {selectedHobbies.length > 0 ? (
            <span className="text-primary font-bold">
              Đã chọn: {selectedHobbies.length}
            </span>
          ) : (
            "Chọn ít nhất 1 sở thích"
          )}
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {HOBBIES_LIST.map((hobby) => {
          const isSelected = selectedHobbies.includes(hobby.id);
          const Icon = hobby.icon;

          return (
            <button
              key={hobby.id}
              type="button"
              disabled={disabled}
              onClick={() => handleToggle(hobby.id)}
              className={`p-2.5 rounded-xl border-0 text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer select-none h-18 ${
                isSelected
                  ? "bg-primary text-white font-bold shadow-sm"
                  : "bg-surface-subtle hover:bg-surface-subtle/80 text-text-secondary hover:text-text-main"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Icon
                size={22}
                className={`transition-colors shrink-0 ${
                  isSelected ? "text-white" : "text-text-muted"
                }`}
                weight={isSelected ? "bold" : "regular"}
              />
              <span className="text-[11px] font-semibold leading-tight line-clamp-1">
                {hobby.label}
              </span>
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
