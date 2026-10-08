import React, { useState, useRef } from "react";
import { ArrowLeft, Users, Globe, Lock, ShieldCheck, Image, ArrowsClockwise } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

import { uploadGroupCover } from "../../utils/uploadImage";
import { addGroup } from "../../services/groups/GroupService";
import { Card } from "../../components/ui/card/Card";
import { Input, Textarea } from "../../components/ui/input/Input";
import { Button } from "../../components/ui/button/Button";

const createGroupSchema = Yup.object().shape({
  group_name: Yup.string()
    .required("Tên nhóm không được để trống")
    .min(3, "Tên nhóm phải có ít nhất 3 ký tự")
    .max(50, "Tên nhóm quá dài"),
  privacy: Yup.string()
    .oneOf(["public", "private"])
    .required("Vui lòng chọn quyền riêng tư"),
  description: Yup.string().max(500, "Mô tả không được vượt quá 500 ký tự"),
  cover_image: Yup.mixed()
    .required("Vui lòng chọn ảnh bìa cho nhóm")
    .test("fileType", "Chỉ nhận định dạng JPG hoặc PNG", (value) => {
      if (!value || typeof value === "string") return true;
      return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    }),
});

/**
 * Modern Flat CreateGroupPage
 * Standardized with Design System primitives (Input, Textarea, Card, Button).
 */
export default function CreateGroupPage() {
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const initialValues = {
    group_name: "",
    privacy: "public",
    description: "",
    cover_image: null,
  };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Kích thước ảnh bìa không được vượt quá 2MB");
        return;
      }
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        toast.error("Chỉ chấp nhận ảnh JPG hoặc PNG");
        return;
      }
      setFieldValue("cover_image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let imageUrl = null;
      if (values.cover_image && typeof values.cover_image !== "string") {
        imageUrl = await uploadGroupCover(values.cover_image);
      }

      const finalGroupData = {
        name: values.group_name.trim(),
        privacy: values.privacy.toUpperCase(),
        description: values.description.trim(),
        image: imageUrl || "",
      };

      await addGroup(finalGroupData);
      toast.success(`Nhóm "${values.group_name}" đã được tạo thành công!`);
      navigate("/dashboard/groups");
    } catch (error) {
      toast.error(error.response?.data?.message || `Lỗi: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-main py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-primary transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Quay lại</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
              <Users size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-main">Tạo nhóm mới</h1>
              <p className="text-xs text-text-secondary mt-0.5">
                Khởi tạo không gian riêng của bạn chỉ trong vài giây.
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <Formik
          initialValues={initialValues}
          validationSchema={createGroupSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, setFieldValue, values, handleChange }) => (
            <Form className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Group Details */}
              <div className="lg:col-span-7">
                <Card className="p-6 md:p-8 rounded-2xl border-0 bg-surface-main space-y-6">
                  {/* Group Name */}
                  <Input
                    id="group-name-input"
                    label="Tên nhóm *"
                    name="group_name"
                    placeholder="Ví dụ: Hội yêu cây cảnh, Dev Hà Nội..."
                    value={values.group_name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    error={touched.group_name && errors.group_name}
                  />

                  {/* Privacy Selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-text-main select-none">
                      Quyền riêng tư *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Public Option */}
                      <label
                        className={`p-4 rounded-xl border-0 cursor-pointer select-none transition-colors flex flex-col gap-1.5 ${
                          values.privacy === "public"
                            ? "bg-surface-subtle ring-1 ring-primary/40"
                            : "bg-surface-subtle/50 hover:bg-surface-subtle"
                        }`}
                      >
                        <input
                          type="radio"
                          name="privacy"
                          value="public"
                          checked={values.privacy === "public"}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-bold text-sm text-text-main">
                            <Globe size={18} className="text-primary" />
                            <span>Công khai</span>
                          </div>
                          <div
                            className={`size-4 rounded-full flex items-center justify-center ${
                              values.privacy === "public"
                                ? "bg-primary text-white"
                                : "bg-surface-main"
                            }`}
                          >
                            {values.privacy === "public" && (
                              <div className="size-2 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          Ai cũng có thể tìm kiếm và xem các bài viết trong nhóm.
                        </p>
                      </label>

                      {/* Private Option */}
                      <label
                        className={`p-4 rounded-xl border-0 cursor-pointer select-none transition-colors flex flex-col gap-1.5 ${
                          values.privacy === "private"
                            ? "bg-surface-subtle ring-1 ring-primary/40"
                            : "bg-surface-subtle/50 hover:bg-surface-subtle"
                        }`}
                      >
                        <input
                          type="radio"
                          name="privacy"
                          value="private"
                          checked={values.privacy === "private"}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-bold text-sm text-text-main">
                            <Lock size={18} className="text-primary" />
                            <span>Riêng tư</span>
                          </div>
                          <div
                            className={`size-4 rounded-full flex items-center justify-center ${
                              values.privacy === "private"
                                ? "bg-primary text-white"
                                : "bg-surface-main"
                            }`}
                          >
                            {values.privacy === "private" && (
                              <div className="size-2 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          Chỉ thành viên mới có thể xem nội dung bên trong nhóm.
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* Description */}
                  <Textarea
                    id="group-description-input"
                    label="Mô tả nhóm"
                    name="description"
                    placeholder="Viết vài dòng giới thiệu về tôn chỉ và nét đặc trưng của nhóm..."
                    rows={4}
                    value={values.description}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    error={touched.description && errors.description}
                    helperText={`${values.description.length} / 500 ký tự`}
                  />
                </Card>
              </div>

              {/* Right Column: Cover Image & Actions */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="p-6 md:p-8 rounded-2xl border-0 bg-surface-main space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-text-main select-none">
                      Ảnh bìa nhóm *
                    </label>
                    <p className="text-xs text-text-secondary">
                      Kích thước khuyến nghị 1200 x 600px (JPG/PNG, tối đa 2MB).
                    </p>
                  </div>

                  {/* Dropzone */}
                  <div
                    onClick={() => !isSubmitting && fileInputRef.current?.click()}
                    className={`relative w-full aspect-[16/9] rounded-xl transition-colors cursor-pointer overflow-hidden flex flex-col items-center justify-center bg-surface-subtle select-none hover:bg-surface-subtle/80 border-0 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {previewUrl ? (
                      <>
                        <img
                          src={previewUrl}
                          alt="Cover Preview"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white">
                          <ArrowsClockwise size={24} className="animate-spin-slow" />
                          <span className="text-xs font-bold uppercase tracking-wider">
                            Thay đổi ảnh
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-center p-4 text-text-muted gap-2">
                        <div className="size-12 rounded-xl bg-surface-main border-0 flex items-center justify-center text-text-muted shadow-sm">
                          <Image size={24} />
                        </div>
                        <span className="text-xs font-bold text-text-main">
                          Bấm để tải ảnh bìa
                        </span>
                        <span className="text-[11px] text-text-muted">
                          Hỗ trợ định dạng JPG, PNG
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/jpeg,image/png"
                      onChange={(e) => handleImageChange(e, setFieldValue)}
                    />
                  </div>
                  {touched.cover_image && errors.cover_image && (
                    <p className="text-xs text-danger font-medium leading-none">
                      {errors.cover_image}
                    </p>
                  )}

                  {/* Notice Box */}
                  <div className="p-3.5 rounded-xl bg-surface-subtle border-0 flex items-start gap-2.5">
                    <ShieldCheck className="text-primary size-5 mt-0.5 shrink-0" />
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Bạn sẽ trở thành <strong>Quản trị viên</strong> của nhóm này. Vui lòng đảm bảo nội dung phù hợp với tiêu chuẩn cộng đồng.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full rounded-xl font-bold"
                    isLoading={isSubmitting}
                    loadingText="Đang khởi tạo nhóm..."
                  >
                    Xác nhận & Khởi tạo
                  </Button>
                </Card>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
