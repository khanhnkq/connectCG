import React from "react";
import HobbiesSelector from "../HobbiesSelector";
import CityCombobox from "../CityCombobox";
import { Button } from "../../../../components/ui/button/Button";

/**
 * Bước 3: Sở thích & Vị trí sinh sống
 * - 12 sở thích đa lựa chọn (hobbies)
 * - Tỉnh / Thành phố sinh sống (city)
 */
export default function Step3InterestsLocation({
  formData,
  errors,
  touched,
  onChangeField,
  onSubmit,
  onBack,
  isSubmitting = false,
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-black text-text-main tracking-tight">
          Sở thích & Nơi sinh sống
        </h2>
        <p className="text-text-secondary text-xs sm:text-sm mt-1">
          Chọn những điều bạn yêu thích để dễ dàng bắt chuyện và tìm kiếm bạn bè gần bạn.
        </p>
      </div>

      <div className="space-y-5">
        <HobbiesSelector
          selectedHobbies={formData.hobbies}
          onChange={(newHobbies) => onChangeField("hobbies", newHobbies)}
          error={touched.hobbies && errors.hobbies}
          disabled={isSubmitting}
        />

        <CityCombobox
          label="Tỉnh / Thành phố bạn đang sinh sống"
          value={formData.city}
          onChange={(newCity) => onChangeField("city", newCity)}
          error={touched.city && errors.city}
          disabled={isSubmitting}
        />
      </div>

      <div className="pt-2 flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="flex-1"
          disabled={isSubmitting}
          onClick={onBack}
        >
          Quay lại
        </Button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          className="flex-1"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          loadingText="Đang hoàn tất..."
          onClick={onSubmit}
        >
          Hoàn tất hồ sơ
        </Button>
      </div>
    </div>
  );
}
