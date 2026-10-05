import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Gear, Globe, Lock, Warning, Image, ArrowsClockwise } from "@phosphor-icons/react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

import { uploadGroupCover } from "../../utils/uploadImage";
import { findById, updateGroup, deleteGroup } from "../../services/groups/GroupService";
import { Card } from "../../components/ui/card/Card";
import { Input, Textarea } from "../../components/ui/input/Input";
import { Button } from "../../components/ui/button/Button";
import { DeleteGroupModal } from "../../features/groups/components/DeleteGroupModal";

const editGroupSchema = Yup.object().shape({
  group_name: Yup.string()
    .required("Tên nhóm không được để trống")
    .min(3, "Tên nhóm phải có ít nhất 3 ký tự")
    .max(50, "Tên nhóm quá dài"),
  privacy: Yup.string()
    .oneOf(["PUBLIC", "PRIVATE"])
    .required("Vui lòng chọn quyền riêng tư"),
  description: Yup.string().max(500, "Mô tả không được vượt quá 500 ký tự"),
  cover_image: Yup.mixed(),
});

/**
 * Modern Flat EditGroupPage
 * Standardized with Design System primitives (Input, Textarea, Card, Button, DeleteGroupModal).
 */
export default function EditGroupPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [initialValues, setInitialValues] = useState({
    group_name: "",
    privacy: "PUBLIC",
    description: "",
    cover_image: null,
  });

  useEffect(() => {
    let isMounted = true;
    const fetchGroup = async () => {
      try {
        const data = await findById(id);
        if (isMounted) {
          setInitialValues({
            group_name: data.name || "",
            privacy: (data.privacy || "PUBLIC").toUpperCase(),
            description: data.description || "",
            cover_image: data.image || null,
          });
          setPreviewUrl(data.image || null);
        }
      } catch (error) {
        console.error("Fetch group failed:", error);
        toast.error("Không thể lấy thông tin nhóm.");
        navigate("/dashboard/groups");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchGroup();
    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

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
      let imageUrl = values.cover_image;
      if (values.cover_image && typeof values.cover_image !== "string") {
        imageUrl = await uploadGroupCover(values.cover_image);
      }

      const updatedGroupData = {
        name: values.group_name.trim(),
        privacy: values.privacy,
        description: values.description.trim(),
        image: typeof imageUrl === "string" ? imageUrl : "",
      };

      await updateGroup(id, updatedGroupData);
      toast.success("Cập nhật thông tin nhóm thành công!");
      navigate(`/dashboard/groups/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || `Lỗi cập nhật: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      setIsDeleting(true);
      await deleteGroup(id);
      toast.success("Đã xóa nhóm thành công");
      setShowDeleteModal(false);
      navigate("/dashboard/groups");
    } catch (error) {
      console.error("Failed to delete group:", error);
      toast.error(error.response?.data?.message || "Không thể xóa nhóm");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-main">
        <div className="size-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

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
            <span>Hủy & Quay lại</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-surface-subtle border border-border-main text-primary flex items-center justify-center shrink-0">
              <Gear size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-main">Cài đặt nhóm</h1>
              <p className="text-xs text-text-secondary mt-0.5">
                Thay đổi thông tin nhóm để phù hợp hơn với định hướng mới.
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={editGroupSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, setFieldValue, values, handleChange }) => (
            <Form className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Group Details */}
              <div className="lg:col-span-7">
                <Card className="p-6 md:p-8 rounded-2xl border border-border-main bg-surface-main space-y-6">
                  {/* Group Name */}
                  <Input
                    id="edit-group-name-input"
                    label="Tên nhóm *"
                    name="group_name"
                    placeholder="Tên nhóm..."
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
                        className={`p-4 rounded-xl border cursor-pointer select-none transition-colors flex flex-col gap-1.5 ${
                          values.privacy === "PUBLIC"
                            ? "border-primary bg-surface-subtle"
                            : "border-border-main bg-surface-main hover:border-border-strong"
                        }`}
                      >
                        <input
                          type="radio"
                          name="privacy"
                          value="PUBLIC"
                          checked={values.privacy === "PUBLIC"}
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
                            className={`size-4 rounded-full border-2 flex items-center justify-center ${
                              values.privacy === "PUBLIC"
                                ? "border-primary"
                                : "border-border-main"
                            }`}
                          >
                            {values.privacy === "PUBLIC" && (
                              <div className="size-2 rounded-full bg-primary" />
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          Ai cũng có thể tìm kiếm và xem các bài viết trong nhóm.
                        </p>
                      </label>

                      {/* Private Option */}
                      <label
                        className={`p-4 rounded-xl border cursor-pointer select-none transition-colors flex flex-col gap-1.5 ${
                          values.privacy === "PRIVATE"
                            ? "border-primary bg-surface-subtle"
                            : "border-border-main bg-surface-main hover:border-border-strong"
                        }`}
                      >
                        <input
                          type="radio"
                          name="privacy"
                          value="PRIVATE"
                          checked={values.privacy === "PRIVATE"}
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
                            className={`size-4 rounded-full border-2 flex items-center justify-center ${
                              values.privacy === "PRIVATE"
                                ? "border-primary"
                                : "border-border-main"
                            }`}
                          >
                            {values.privacy === "PRIVATE" && (
                              <div className="size-2 rounded-full bg-primary" />
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
                    id="edit-group-description-input"
                    label="Mô tả nhóm"
                    name="description"
                    placeholder="Mô tả nét đặc trưng của nhóm..."
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
                <Card className="p-6 md:p-8 rounded-2xl border border-border-main bg-surface-main space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-text-main select-none">
                      Ảnh bìa nhóm
                    </label>
                    <p className="text-xs text-text-secondary">
                      Hỗ trợ định dạng JPG, PNG (tối đa 2MB).
                    </p>
                  </div>

                  {/* Dropzone */}
                  <div
                    onClick={() => !isSubmitting && fileInputRef.current?.click()}
                    className={`relative w-full aspect-[16/9] rounded-xl border-2 border-dashed transition-colors cursor-pointer overflow-hidden flex flex-col items-center justify-center bg-surface-subtle select-none ${
                      touched.cover_image && errors.cover_image
                        ? "border-danger"
                        : "border-border-main hover:border-primary"
                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
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
                        <div className="size-12 rounded-xl bg-surface-main border border-border-main flex items-center justify-center text-text-muted">
                          <Image size={24} />
                        </div>
                        <span className="text-xs font-bold text-text-main">
                          Bấm để tải ảnh bìa
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

                  {/* Save Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full rounded-xl font-bold"
                    isLoading={isSubmitting}
                    loadingText="Đang lưu thay đổi..."
                  >
                    Lưu thay đổi
                  </Button>

                  {/* Danger Zone */}
                  <div className="pt-4 border-t border-border-main space-y-3">
                    <div className="flex items-center gap-2 text-danger font-bold text-xs uppercase tracking-wider">
                      <Warning size={16} />
                      <span>Khu vực nguy hiểm</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Khi xóa nhóm, toàn bộ dữ liệu bài viết và thành viên sẽ bị mất vĩnh viễn và không thể khôi phục.
                    </p>
                    <Button
                      type="button"
                      variant="danger"
                      size="md"
                      className="w-full rounded-xl font-bold"
                      onClick={() => !isSubmitting && setShowDeleteModal(true)}
                      disabled={isSubmitting}
                    >
                      Xóa nhóm
                    </Button>
                  </div>
                </Card>
              </div>
            </Form>
          )}
        </Formik>

        {/* Delete Confirmation Modal */}
        <DeleteGroupModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          groupName={initialValues.group_name}
          onConfirm={handleDeleteGroup}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
