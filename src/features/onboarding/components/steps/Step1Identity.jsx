import React from "react";
import AvatarUploadField from "../AvatarUploadField";
import { Input } from "../../../../components/ui/input/Input";
import { Button } from "../../../../components/ui/button/Button";

/**
 * Bước 1: Diện mạo & Danh tính
 * - Tải ảnh đại diện (avatar)
 * - Họ và tên (fullName)
 * - Ngày sinh (dateOfBirth)
 * - Nghề nghiệp (occupation)
 */
export default function Step1Identity({
  formData,
  errors,
  touched,
  avatarPreview,
  onAvatarChange,
  onChangeField,
  onNext,
  disabled = false,
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-black text-text-main tracking-tight">
          Diện mạo & Thông tin cơ bản
        </h2>
        <p className="text-text-secondary text-xs sm:text-sm mt-1">
          Hãy tải lên một tấm ảnh chân dung rõ nét và cho mọi người biết tên bạn.
        </p>
      </div>

      {/* Avatar Dropzone */}
      <AvatarUploadField
        avatarPreview={avatarPreview}
        onChange={onAvatarChange}
        error={touched.avatar && errors.avatar}
        disabled={disabled}
      />

      <div className="space-y-4">
        <Input
          id="onboard-fullName"
          name="fullName"
          label="Họ và tên"
          placeholder="VD: Nguyễn Văn A"
          value={formData.fullName}
          onChange={(e) => onChangeField("fullName", e.target.value)}
          error={touched.fullName && errors.fullName}
          disabled={disabled}
        />

        <Input
          id="onboard-dateOfBirth"
          name="dateOfBirth"
          type="date"
          label="Ngày sinh (từ 16 tuổi trở lên)"
          value={formData.dateOfBirth}
          onChange={(e) => onChangeField("dateOfBirth", e.target.value)}
          error={touched.dateOfBirth && errors.dateOfBirth}
          disabled={disabled}
        />

        <Input
          id="onboard-occupation"
          name="occupation"
          label="Nghề nghiệp / Lĩnh vực"
          placeholder="VD: Nhà thiết kế, Kỹ sư phần mềm, Giáo viên..."
          value={formData.occupation}
          onChange={(e) => onChangeField("occupation", e.target.value)}
          error={touched.occupation && errors.occupation}
          disabled={disabled}
        />
      </div>

      <div className="pt-2">
        <Button
          type="button"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={disabled}
          onClick={onNext}
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  );
}
