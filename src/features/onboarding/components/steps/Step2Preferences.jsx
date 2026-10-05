import React from "react";
import {
  GenderMale,
  GenderFemale,
  GenderTransgender,
  Heart,
  Users,
  Briefcase,
} from "@phosphor-icons/react";
import RadioPillGroup from "../RadioPillGroup";
import { Button } from "../../../../components/ui/button/Button";

const GENDER_OPTIONS = [
  { value: "male", label: "Nam", icon: GenderMale },
  { value: "female", label: "Nữ", icon: GenderFemale },
  { value: "other", label: "Khác", icon: GenderTransgender },
];

const MARITAL_STATUS_OPTIONS = [
  { value: "single", label: "Độc thân" },
  { value: "divorced", label: "Ly hôn" },
];

const PURPOSE_OPTIONS = [
  { value: "love", label: "Tìm tình yêu", icon: Heart },
  { value: "friends", label: "Kết bạn mới", icon: Users },
  { value: "networking", label: "Mở rộng kết nối", icon: Briefcase },
];

/**
 * Bước 2: Định hướng & Mối quan hệ
 * - Giới tính (gender)
 * - Tình trạng hôn nhân (maritalStatus)
 * - Mục đích tham gia (purpose)
 */
export default function Step2Preferences({
  formData,
  errors,
  touched,
  onChangeField,
  onNext,
  onBack,
  disabled = false,
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-black text-text-main tracking-tight">
          Định hướng & Mối quan hệ
        </h2>
        <p className="text-text-secondary text-xs sm:text-sm mt-1">
          Giúp thuật toán gợi ý những thành viên phù hợp nhất với mong muốn của bạn.
        </p>
      </div>

      <div className="space-y-5">
        <RadioPillGroup
          label="Giới tính của bạn *"
          options={GENDER_OPTIONS}
          value={formData.gender}
          onChange={(val) => onChangeField("gender", val)}
          error={touched.gender && errors.gender}
          disabled={disabled}
          columns={3}
        />

        <RadioPillGroup
          label="Tình trạng hôn nhân hiện tại *"
          options={MARITAL_STATUS_OPTIONS}
          value={formData.maritalStatus}
          onChange={(val) => onChangeField("maritalStatus", val)}
          error={touched.maritalStatus && errors.maritalStatus}
          disabled={disabled}
          columns={2}
        />

        <RadioPillGroup
          label="Mục đích chính khi bạn tham gia Connect *"
          options={PURPOSE_OPTIONS}
          value={formData.purpose}
          onChange={(val) => onChangeField("purpose", val)}
          error={touched.purpose && errors.purpose}
          disabled={disabled}
          columns={3}
        />
      </div>

      <div className="pt-2 flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="flex-1"
          disabled={disabled}
          onClick={onBack}
        >
          Quay lại
        </Button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          className="flex-1"
          disabled={disabled}
          onClick={onNext}
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  );
}
