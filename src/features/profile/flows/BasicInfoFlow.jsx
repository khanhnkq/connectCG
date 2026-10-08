import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Textarea } from "../../../components/ui/input/Input";
import { Button } from "../../../components/ui/button/Button";

const MARITAL_STATUS_OPTIONS = [
  { value: "SINGLE", label: "Độc thân" },
  { value: "MARRIED", label: "Đã kết hôn" },
  { value: "DIVORCED", label: "Đã ly hôn" },
  { value: "WIDOWED", label: "Góa" },
];

const GENDER_OPTIONS = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
  { value: "OTHER", label: "Khác" },
];

export function BasicInfoFlow({ profile, onSave, isLoading = false }) {
  const validationSchema = Yup.object({
    fullName: Yup.string().trim().required("Họ và tên không được để trống"),
    bio: Yup.string().max(255, "Tiểu sử tối đa 255 ký tự"),
    gender: Yup.string().oneOf(["MALE", "FEMALE", "OTHER"], "Giới tính không hợp lệ"),
    maritalStatus: Yup.string().oneOf(
      ["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"],
      "Tình trạng mối quan hệ không hợp lệ"
    ),
    dateOfBirth: Yup.date().max(new Date(), "Ngày sinh không được ở tương lai"),
  });

  const formik = useFormik({
    initialValues: {
      fullName: profile?.fullName || "",
      bio: profile?.bio || "",
      gender: profile?.gender || "MALE",
      maritalStatus: profile?.maritalStatus || "SINGLE",
      dateOfBirth: profile?.dateOfBirth ? String(profile.dateOfBirth).split("T")[0] : "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      await onSave({
        ...values,
        dateOfBirth: values.dateOfBirth || null,
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <div>
        <h3 className="text-base font-bold text-text-main">Thông tin cơ bản</h3>
        <p className="text-xs text-text-secondary mt-0.5">
          Quản lý diện mạo danh tính, ngày sinh và tiểu sử ngắn của bạn.
        </p>
      </div>

      {/* Full Name */}
      <Input
        label="Họ và tên *"
        name="fullName"
        placeholder="Nhập họ và tên đầy đủ"
        value={formik.values.fullName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.fullName && formik.errors.fullName}
        disabled={isLoading}
      />

      {/* Date of Birth & Gender Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          type="date"
          label="Ngày sinh"
          name="dateOfBirth"
          value={formik.values.dateOfBirth}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
          disabled={isLoading}
        />

        {/* Gender Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-secondary">Giới tính</label>
          <div className="grid grid-cols-3 gap-2">
            {GENDER_OPTIONS.map((g) => {
              const isSelected = formik.values.gender === g.value;
              return (
                <button
                  key={g.value}
                  type="button"
                  disabled={isLoading}
                  onClick={() => formik.setFieldValue("gender", g.value)}
                  className={`py-2 text-xs font-semibold rounded-xl border-0 transition-colors ${
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-surface-subtle text-text-main hover:bg-surface-subtle/80"
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
          {formik.touched.gender && formik.errors.gender && (
            <p className="text-xs text-danger">{formik.errors.gender}</p>
          )}
        </div>
      </div>

      {/* Marital Status */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-text-secondary">Tình trạng mối quan hệ</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MARITAL_STATUS_OPTIONS.map((opt) => {
            const isSelected = formik.values.maritalStatus === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                disabled={isLoading}
                onClick={() => formik.setFieldValue("maritalStatus", opt.value)}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border-0 transition-colors ${
                  isSelected
                    ? "bg-primary text-white"
                    : "bg-surface-subtle text-text-main hover:bg-surface-subtle/80"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bio */}
      <Textarea
        label="Tiểu sử ngắn"
        name="bio"
        rows={3}
        placeholder="Chia sẻ đôi điều về bản thân bạn..."
        value={formik.values.bio}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.bio && formik.errors.bio}
        disabled={isLoading}
      />
      <div className="text-right">
        <span className="text-[11px] text-text-muted">
          {formik.values.bio.length} / 255 ký tự
        </span>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex justify-end">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading || !formik.isValid}
        >
          Lưu thông tin cơ bản
        </Button>
      </div>
    </form>
  );
}

export default BasicInfoFlow;
