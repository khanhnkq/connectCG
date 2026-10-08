import React, { useState } from "react";
import { Button } from "../../../components/ui/button/Button";
import CityCombobox from "../../onboarding/components/CityCombobox";

const LOOKING_FOR_OPTIONS = [
  { value: "FRIENDS", label: "Kết bạn mới", desc: "Mở rộng quan hệ xã hội thông thường" },
  { value: "NETWORKING", label: "Giao lưu nghề nghiệp", desc: "Kết nối đồng nghiệp, chuyên gia cùng ngành" },
  { value: "DATING", label: "Tìm hiểu hẹn hò", desc: "Tìm kiếm người tâm đầu ý hợp" },
  { value: "COLLABORATION", label: "Tìm đối tác hợp tác", desc: "Hợp tác dự án, khởi nghiệp" },
];

export function SocialLocationFlow({ profile, onSave, isLoading = false }) {
  const [city, setCity] = useState(
    profile?.cityCode
      ? { code: profile.cityCode, name: profile.cityName }
      : profile?.city || null
  );
  const [lookingFor, setLookingFor] = useState(profile?.lookingFor || "FRIENDS");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave({
      cityCode: city?.code || null,
      cityName: city?.name || null,
      lookingFor,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h3 className="text-base font-bold text-text-main">Vị trí & Định hướng kết nối</h3>
        <p className="text-xs text-text-secondary mt-0.5">
          Tùy chỉnh khu vực sinh sống và mục tiêu kết nối của bạn trên ConnectCG.
        </p>
      </div>

      {/* City Combobox */}
      <div className="space-y-1.5">
        <CityCombobox
          label="Tỉnh / Thành phố sinh sống"
          value={city}
          onChange={(newCity) => setCity(newCity)}
          disabled={isLoading}
        />
      </div>

      {/* Looking For Goal Options */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-text-secondary">
          Mục đích tham gia cộng đồng
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LOOKING_FOR_OPTIONS.map((opt) => {
            const isSelected = lookingFor === opt.value;
            return (
              <div
                key={opt.value}
                onClick={() => !isLoading && setLookingFor(opt.value)}
                className={`p-3.5 rounded-2xl border-0 cursor-pointer transition-all ${
                  isSelected
                    ? "bg-primary/10"
                    : "bg-surface-subtle hover:bg-surface-subtle/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-main">{opt.label}</span>
                  <div
                    className={`size-4 rounded-full flex items-center justify-center ${
                      isSelected
                        ? "bg-primary"
                        : "bg-surface-main"
                    }`}
                  >
                    {isSelected && <div className="size-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <p className="text-[11px] text-text-secondary mt-1">{opt.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex justify-end">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Lưu vị trí & định hướng
        </Button>
      </div>
    </form>
  );
}

export default SocialLocationFlow;
