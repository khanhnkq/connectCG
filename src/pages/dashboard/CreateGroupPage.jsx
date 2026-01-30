import React, { useState, useRef } from "react";
import {
  ArrowLeft,
  Users,
  Pencil,
  AlertCircle,
  Lock,
  Globe,
  ShieldCheck,
  AlignLeft,
  Focus,
  RefreshCw,
  Image,
  Rocket,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

import { uploadGroupCover } from "../../utils/uploadImage";
import { addGroup } from "../../services/groups/GroupService.js";

const createGroupSchema = Yup.object().shape({
  group_name: Yup.string()
    .required("Tên nhóm không được để trống")
    .min(3, "Tên nhóm phải có ít nhất 3 ký tự")
    .max(50, "Tên nhóm quá dài"),
  privacy: Yup.string()
    .oneOf(["public", "private"])
    .required("Vui lòng chọn quyền riêng tư"),
  description: Yup.string().max(500, "Mô tả quá dài"),
  cover_image: Yup.mixed()
    .required("Vui lòng chọn ảnh bìa cho nhóm")
    .test(
      "fileType",
      "Chỉ nhận định dạng jpg/png",
      (value) => {
        if (!value || typeof value === "string") return true;
        return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
      }
    )

});

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
    const file = event.currentTarget.files[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Kích thước ảnh bìa nhóm không được vượt quá 2MB");
        return;
      }
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        toast.error("Chỉ chấp nhận ảnh JPG hoặc PNG", { theme: "dark" });
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
        name: values.group_name,
        privacy: values.privacy.toUpperCase(),
        description: values.description,
        image: imageUrl || "",
      };
      await addGroup(finalGroupData);
      toast.success(`Nhóm "${values.group_name}" đã sẵn sàng!`);
      setTimeout(() => {
        setSubmitting(false);
        navigate("/dashboard/groups");
      }, 1500);
    } catch (error) {
      toast.error(`Lỗi: ${error.message}`);
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Visual Background Decorations */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[5%] left-[-5%] w-[400px] h-[400px] bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-8 py-12 relative z-10">
        {/* Compact & Stylish Header */}
        <header className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-text-muted hover:text-primary transition-all mb-6 group"
          >
            <ArrowLeft
              className="group-hover:-translate-x-1 transition-transform"
              size={20}
            />
            <span className="text-xs font-black uppercase tracking-widest text-text-main group-hover:text-primary">
              Quay lại
            </span>
          </button>

          <div className="flex items-center gap-6">
            <div className="size-20 rounded-3xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-2xl shadow-primary/20 transform -rotate-3">
              <Users size={40} className="text-text-main" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight mb-1 text-text-main">
                Thiết lập{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                  Cộng đồng
                </span>
              </h1>
              <p className="text-text-main/80 text-sm font-medium">
                Khởi tạo không gian riêng của bạn chỉ trong vài giây.
              </p>
            </div>
          </div>
        </header>

        <Formik
          initialValues={initialValues}
          validationSchema={createGroupSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, setFieldValue, values }) => (
            <Form className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Controls - Left Section */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-surface-main border border-border-main rounded-[2.5rem] p-10 shadow-2xl space-y-8">
                  {/* Group Name Input */}
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
                        placeholder="Ví dụ: Hội yêu cây cảnh, Dev Hà Nội..."
                        className={`w-full bg-background-main border ${errors.group_name && touched.group_name
                          ? "border-red-500/50"
                          : "border-border-main group-focus-within:border-primary/50"
                          } rounded-2xl py-5 px-6 text-text-main text-base focus:outline-none transition-all shadow-inner placeholder:text-text-muted/20`}
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
                          value="public"
                          className="sr-only peer"
                        />
                        <div className="p-5 rounded-2xl bg-background-main border border-border-main transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:shadow-[0_0_20px_rgba(255,107,0,0.1)] hover:bg-surface-main">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="size-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                              <Globe size={18} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-text-main peer-checked:text-text-main">
                              Công khai
                            </span>
                          </div>
                          <p className="text-[10px] text-text-main leading-relaxed">
                            Ai cũng có thể tìm thấy nhóm và xem bài viết.
                          </p>
                        </div>
                        <div className="absolute top-4 right-4 size-4 rounded-full border-2 border-border-main peer-checked:border-primary peer-checked:after:content-[''] peer-checked:after:absolute peer-checked:after:inset-1 peer-checked:after:bg-primary peer-checked:after:rounded-full" />
                      </label>

                      <label className="relative cursor-pointer group">
                        <Field
                          type="radio"
                          name="privacy"
                          value="private"
                          className="sr-only peer"
                        />
                        <div className="p-5 rounded-2xl bg-background-main border border-border-main transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:shadow-[0_0_20px_rgba(255,107,0,0.1)] hover:bg-surface-main">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="size-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                              <ShieldCheck size={18} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-text-secondary peer-checked:text-text-main">
                              Riêng tư
                            </span>
                          </div>
                          <p className="text-[10px] text-text-main leading-relaxed">
                            Chỉ thành viên mới có thể xem nội dung bên trong.
                          </p>
                        </div>
                        <div className="absolute top-4 right-4 size-4 rounded-full border-2 border-border-main peer-checked:border-primary peer-checked:after:content-[''] peer-checked:after:absolute peer-checked:after:inset-1 peer-checked:after:bg-primary peer-checked:after:rounded-full" />
                      </label>
                    </div>
                  </div>

                  {/* Description TextArea */}
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
                      placeholder="Viết vài dòng giới thiệu về nét đặc trưng của nhóm..."
                      className="w-full bg-background-main border border-border-main focus:border-primary/50 rounded-2xl py-5 px-6 text-text-main text-sm h-32 focus:outline-none transition-all shadow-inner resize-none placeholder:text-text-muted/20"
                    />
                    <div className="flex justify-end pr-2">
                      <span
                        className={`text-[9px] font-bold tracking-widest uppercase ${values.description.length > 450
                          ? "text-orange-500"
                          : "text-text-muted"
                          }`}
                      >
                        {values.description.length} / 500
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Media Upload - Right Section */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-surface-main border border-border-main rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center">
                  <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] self-start mb-6 ml-2 flex items-center gap-2">
                    <Focus size={14} /> Ảnh bìa
                  </label>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-full aspect-[4/3] rounded-3xl border-2 border-dashed border-border-main hover:border-primary/50 transition-all cursor-pointer overflow-hidden group flex items-center justify-center bg-background-main shadow-2xl"
                  >
                    {previewUrl ? (
                      <>
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center backdrop-blur-[2px]">
                          <div className="size-14 rounded-full bg-white/10 flex items-center justify-center border border-white/20 mb-3 shadow-xl">
                            <RefreshCw
                              className="text-white animate-spin-slow"
                              size={24}
                            />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-main">
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
                          Tải ảnh bìa chuyên nghiệp
                        </p>
                        <p className="text-[10px] text-text-main/60 font-bold tracking-tighter italic">
                          Kích thước khuyên dùng 1200x600px
                        </p>
                      </div>
                    )}
                    {errors.cover_image && touched.cover_image && (
                      <div className="absolute top-2 right-2 bg-red-500/90 text-white text-[9px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 animate-bounce">
                        <AlertCircle size={10} /> {errors.cover_image}
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

                  {/* Status & Action */}
                  <div className="w-full mt-10 space-y-4">
                    <div className="p-5 rounded-2xl bg-orange-500/5 border border-primary/10 flex items-start gap-3">
                      <ShieldCheck className="text-primary mt-0.5" size={20} />
                      <p className="text-[10px] font-medium leading-[1.6] text-text-main">
                        Bạn sẽ trở thành <b>Quản trị viên</b> của nhóm này. Hãy
                        đảm bảo nội dung tuân thủ chính sách của ConnectCG.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-5 bg-gradient-to-r from-primary to-orange-600 text-text-main font-black rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 ${isSubmitting ? "opacity-70 cursor-wait" : ""
                        }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="size-4 border-2 border-text-main/20 border-t-text-main rounded-full animate-spin" />
                          <span>Đang xử lý...</span>
                        </>
                      ) : (
                        <>
                          <span>Xác nhận & Khởi tạo</span>
                          <Rocket size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
