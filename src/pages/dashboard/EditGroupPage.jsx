import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Settings,
  Pencil,
  AlertCircle,
  Lock,
  Globe,
  ShieldCheck,
  AlignLeft,
  Image,
  RefreshCw,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

import { uploadGroupCover } from "../../utils/uploadImage";
import {
  findById,
  updateGroup,
  deleteGroup,
} from "../../services/groups/GroupService";
import DeleteGroupModal from "../../components/groups/DeleteGroupModal";

const editGroupSchema = Yup.object().shape({
  group_name: Yup.string()
    .required("Tên nhóm không được để trống")
    .min(3, "Tên nhóm phải có ít nhất 3 ký tự")
    .max(50, "Tên nhóm quá dài"),
  privacy: Yup.string()
    .oneOf(["PUBLIC", "PRIVATE"])
    .required("Vui lòng chọn quyền riêng tư"),
  description: Yup.string().max(500, "Mô tả quá dài"),
  cover_image: Yup.mixed(),
});

export default function EditGroupPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [initialValues, setInitialValues] = useState({
    group_name: "",
    privacy: "PUBLIC",
    description: "",
    cover_image: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const data = await findById(id);
        setInitialValues({
          group_name: data.name,
          privacy: data.privacy.toUpperCase(),
          description: data.description || "",
          cover_image: data.image,
        });
        setPreviewUrl(data.image);
      } catch (error) {
        console.error("Fetch group failed:", error);
        toast.error("Không thể lấy thông tin nhóm.");
        navigate("/dashboard/groups");
      } finally {
        setIsLoading(false);
      }
    };
    fetchGroup();
  }, [id, navigate]);

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Kích thước ảnh bìa nhóm không được vượt quá 2MB");
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
        name: values.group_name,
        privacy: values.privacy,
        description: values.description,
        image: typeof imageUrl === "string" ? imageUrl : "",
      };

      await updateGroup(id, updatedGroupData);
      toast.success(`Cập nhật nhóm thành công!`);
      navigate("/dashboard/groups");
    } catch (error) {
      toast.error(`Lỗi cập nhật: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Visual Background Decorations - Dark Theme */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[5%] left-[-5%] w-[400px] h-[400px] bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-8 py-12 relative z-10">
        {/* Header */}
        <header className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-text-main hover:text-primary transition-all mb-6 group"
          >
            <ArrowLeft
              className="group-hover:-translate-x-1 transition-transform"
              size={20}
            />
            <span className="text-xs font-black uppercase tracking-widest text-text-main group-hover:text-primary">
              Hủy & Quay lại
            </span>
          </button>

          <div className="flex items-center gap-6">
            <div className="size-20 rounded-3xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-2xl shadow-primary/20 transform -rotate-3 text-text-main">
              <Settings size={40} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-1 text-text-main">
                Chỉnh sửa{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                  Cộng đồng
                </span>
              </h1>
              <p className="text-text-main text-sm font-medium">
                Thay đổi thông tin nhóm để phù hợp hơn với định hướng mới.
              </p>
            </div>
          </div>
        </header>

        <Formik
          initialValues={initialValues}
          validationSchema={editGroupSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ errors, touched, isSubmitting, setFieldValue, values }) => (
            <Form className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Controls - Left Section */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-surface-main border border-border-main rounded-[2.5rem] p-10 shadow-2xl space-y-8">
                  {/* Group Name */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center ml-2">
                      <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                        <Pencil size={14} /> Tên nhóm
                      </label>
                      <span className="text-[9px] font-bold text-red-500/60 uppercase tracking-tighter">
                        Bắt buộc
                      </span>
                    </div>
                    <div className="relative group">
                      <Field
                        name="group_name"
                        disabled={isSubmitting}
                        className={`w-full bg-background-main border ${errors.group_name && touched.group_name
                            ? "border-red-500/50"
                            : "border-border-main group-focus-within:border-primary/50"
                          } rounded-2xl py-5 px-6 text-text-main text-base focus:outline-none transition-all shadow-inner placeholder:text-text-muted/20 disabled:opacity-50 disabled:cursor-not-allowed`}
                      />
                      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/5 pointer-events-none group-focus-within:ring-primary/20 transition-all" />
                    </div>
                    {errors.group_name && touched.group_name && (
                      <p className="text-red-400 text-[10px] font-bold ml-2 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.group_name}
                      </p>
                    )}
                  </div>

                  {/* Privacy Selector */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                      <Lock size={14} /> Quyền riêng tư
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="relative cursor-pointer group">
                        <Field
                          type="radio"
                          name="privacy"
                          value="PUBLIC"
                          disabled={isSubmitting}
                          className="sr-only peer"
                        />
                        <div className={`p-5 rounded-2xl bg-background-main border border-border-main transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:shadow-[0_0_20px_rgba(255,107,0,0.1)] hover:bg-surface-main ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="size-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                              <Globe size={18} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-text-main peer-checked:text-text-main">
                              Công khai
                            </span>
                          </div>
                          <p className="text-[10px] text-text-main leading-relaxed">
                            Ai cũng có thể tìm thấy nhóm.
                          </p>
                        </div>
                        <div className="absolute top-4 right-4 size-4 rounded-full border-2 border-border-main peer-checked:border-primary peer-checked:after:content-[''] peer-checked:after:absolute peer-checked:after:inset-1 peer-checked:after:bg-primary peer-checked:after:rounded-full" />
                      </label>
                      <label className="relative cursor-pointer group">
                        <Field
                          type="radio"
                          name="privacy"
                          value="PRIVATE"
                          disabled={isSubmitting}
                          className="sr-only peer"
                        />
                        <div className={`p-5 rounded-2xl bg-[#120a05] border border-[#2d1f14] transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:shadow-[0_0_20px_rgba(255,107,0,0.1)] hover:bg-[#1a120b] ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="size-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                              <ShieldCheck size={18} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-text-main peer-checked:text-white">
                              Riêng tư
                            </span>
                          </div>
                          <p className="text-[10px] text-text-main leading-relaxed">
                            Chỉ thành viên mới xem được.
                          </p>
                        </div>
                        <div className="absolute top-4 right-4 size-4 rounded-full border-2 border-[#2d1f14] peer-checked:border-primary peer-checked:after:content-[''] peer-checked:after:absolute peer-checked:after:inset-1 peer-checked:after:bg-primary peer-checked:after:rounded-full" />
                      </label>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center ml-2">
                      <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                        <AlignLeft size={14} /> Mô tả
                      </label>
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-tighter italic">
                        Tùy chọn
                      </span>
                    </div>
                    <Field
                      as="textarea"
                      name="description"
                      disabled={isSubmitting}
                      className="w-full bg-background-main border border-border-main focus:border-primary/50 rounded-2xl py-5 px-6 text-text-main text-sm h-32 focus:outline-none transition-all shadow-inner resize-none placeholder:text-text-muted/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="flex justify-end pr-2">
                      <span
                        className={`text-[9px] font-bold tracking-widest uppercase ${values.description
                            ? values.description.length > 450
                              ? "text-orange-500"
                              : "text-text-muted"
                            : "text-text-muted"
                          }`}
                      >
                        {values.description?.length || 0} / 500
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Image & Actions */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-surface-main border border-border-main rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center">
                  <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] self-start mb-6 ml-2 flex items-center gap-2">
                    <Image size={14} /> Ảnh bìa
                  </label>

                  <div
                    onClick={() => !isSubmitting && fileInputRef.current?.click()}
                    className={`relative w-full aspect-video rounded-3xl border-2 border-dashed border-border-main hover:border-primary/50 transition-all cursor-pointer overflow-hidden group flex items-center justify-center bg-background-main ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {previewUrl ? (
                      <>
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center backdrop-blur-sm">
                          <div className="size-14 rounded-full bg-white/10 flex items-center justify-center border border-white/20 mb-3 shadow-xl">
                            <RefreshCw
                              className="text-white animate-spin-slow"
                              size={24}
                            />
                          </div>
                          <span className="text-[10px] font-black uppercase text-white tracking-widest">
                            Thay đổi ảnh
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-center p-8">
                        <div className="size-20 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center text-primary/40 mb-6 group-hover:scale-110 transition-transform duration-500 ring-1 ring-primary/5 shadow-inner">
                          <Image size={48} />
                        </div>
                        <p className="text-sm font-bold text-text-main mb-2 uppercase tracking-wide">
                          Tải ảnh bìa mới
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setFieldValue)}
                    />
                  </div>

                  <div className="w-full mt-6 space-y-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-gradient-to-r from-primary to-orange-600 text-text-main font-black rounded-xl shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isSubmitting ? "Đang lưu..." : "Lưu Thay đổi"}
                    </button>

                    <div className="pt-4 border-t border-border-main space-y-2">
                      <div className="flex items-center gap-2 justify-center text-red-500/80">
                        <AlertTriangle size={20} />
                        <span className="text-sm font-bold uppercase tracking-wide">
                          Chú ý khu vực nguy hiểm
                        </span>
                      </div>
                      <p className="text-sm text-text-main text-center leading-relaxed px-2">
                        Khi xóa nhóm, toàn bộ dữ liệu bài viết và thành viên sẽ
                        bị mất vĩnh viễn và không thể khôi phục.
                      </p>
                      <button
                        type="button"
                        onClick={() => !isSubmitting && setShowDeleteModal(true)}
                        disabled={isSubmitting}
                        className="w-full py-3 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 font-bold rounded-xl transition-all uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={16} />
                        Xóa Nhóm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>

        <DeleteGroupModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          groupName={initialValues.group_name}
          onConfirm={async () => {
            try {
              await deleteGroup(id);
              toast.success("Đã xóa nhóm thành công");
              navigate("/dashboard/groups");
            } catch (error) {
              console.error("Failed to delete group:", error);
              toast.error(error.response?.data || "Không thể xóa nhóm");
              setShowDeleteModal(false);
            }
          }}
        />
      </div>
    </div>
  );
}
