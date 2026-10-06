import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "../../../components/ui/input/Input";
import { Button } from "../../../components/ui/button/Button";
import { Card } from "../../../components/ui/card/Card";

const CAREER_SUGGESTIONS = [
  "Kỹ sư phần mềm",
  "Thiết kế UI/UX",
  "Quản lý sản phẩm",
  "Chuyên viên dữ liệu",
  "Tiếp thị số (Digital Marketing)",
  "Sinh viên",
  "Nhà nghiên cứu",
  "Kinh doanh tự do (Freelancer)",
];

export function CareerEducationFlow({ profile, onSave, isLoading = false }) {
  const validationSchema = Yup.object({
    occupation: Yup.string()
      .trim()
      .max(100, "Nghề nghiệp / Chức danh tối đa 100 ký tự"),
  });

  const formik = useFormik({
    initialValues: {
      occupation: profile?.occupation || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      await onSave({
        occupation: values.occupation,
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <div>
        <h3 className="text-base font-bold text-text-main">Nghề nghiệp & Học vấn</h3>
        <p className="text-xs text-text-secondary mt-0.5">
          Cập nhật công việc hiện tại giúp bạn mở rộng mạng lưới quan hệ và tìm kiếm cơ hội hợp tác.
        </p>
      </div>

      {/* Occupation */}
      <Input
        label="Nghề nghiệp / Chức danh hiện tại"
        name="occupation"
        placeholder="Ví dụ: Kỹ sư phần mềm, Sinh viên ĐH Bách Khoa..."
        value={formik.values.occupation}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.occupation && formik.errors.occupation}
        disabled={isLoading}
      />

      {/* Quick Suggestions */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-text-secondary">Gợi ý nhanh</label>
        <div className="flex flex-wrap gap-2">
          {CAREER_SUGGESTIONS.map((item) => (
            <button
              key={item}
              type="button"
              disabled={isLoading}
              onClick={() => formik.setFieldValue("occupation", item)}
              className="px-3 py-1.5 text-xs font-medium rounded-xl border border-border-main bg-surface-main hover:bg-surface-subtle text-text-secondary hover:text-text-main transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Helpful Hint Card */}
      <Card className="p-4 bg-surface-subtle border-border-main">
        <h4 className="text-xs font-bold text-text-main mb-1">Mẹo mở rộng quan hệ</h4>
        <p className="text-xs text-text-secondary leading-relaxed">
          Ghi rõ lĩnh vực chuyên môn của bạn giúp thuật toán ConnectCG gợi ý những người bạn có cùng mối quan tâm hoặc đang tìm kiếm đối tác trong ngành.
        </p>
      </Card>

      {/* Action Footer */}
      <div className="pt-2 flex justify-end">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading || !formik.isValid}
        >
          Lưu nghề nghiệp
        </Button>
      </div>
    </form>
  );
}

export default CareerEducationFlow;
