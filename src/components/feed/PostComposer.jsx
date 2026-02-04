import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Image,
  Video,
  Globe,
  Users,
  Lock,
  ChevronDown,
  X,
  AlertTriangle,
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import postService from "../../services/PostService";
import { uploadImage } from "../../utils/uploadImage"; // Import hàm uploadImage gốc từ utils
import toast from "react-hot-toast";

// --- CẤU HÌNH VALIDATION ---
const FILE_SIZE = 50 * 1024 * 1024; // 50MB (Cho phép video)
const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
];

const validationSchema = Yup.object({
  content: Yup.string().trim().required("Vui lòng viết gì đó trước khi đăng!"),
  visibility: Yup.string().oneOf(["PUBLIC", "FRIENDS", "PRIVATE"]).required(),
  media: Yup.array()
    .of(
      Yup.mixed()
        .test("fileSize", "File quá lớn (tối đa 50MB)", (value) => {
          if (!value) return true;
          return value.size <= FILE_SIZE;
        })
        .test("fileType", "Định dạng không được hỗ trợ", (value) => {
          if (!value) return true;
          return SUPPORTED_FORMATS.includes(value.type);
        }),
    )
    .max(4, "Bạn chỉ có thể tải lên tối đa 4 tệp."),
});

export default function PostComposer({ userAvatar, onPostCreated, groupId }) {
  const { profile: userProfile } = useSelector((state) => state.user);
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);

  // Refs cho input file ẩn
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      content: "",
      visibility: "PUBLIC",
      media: [], // Mảng chứa File object
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      console.log("PostComposer: Submitting post...", values);
      try {
        setSubmitting(true);

        // 1. Upload file lên Cloudinary
        // Lưu ý: Đảm bảo file src/utils/uploadImage.js của bạn đã cho phép upload Video như hướng dẫn trước
        let mediaUrls = [];
        if (values.media.length > 0) {
          const uploadPromises = values.media.map((file) =>
            // Tham số thứ 2 là folder trên Cloudinary
            uploadImage(file, "posts"),
          );
          mediaUrls = await Promise.all(uploadPromises);
        }

        // 2. Gọi API Backend để tạo bài viết
        // Payload gửi đi là JSON
        const payload = {
          content: values.content,
          visibility: values.visibility,
          mediaUrls: mediaUrls, // Mảng các đường dẫn URL ảnh/video
          groupId: groupId || null, // Thêm groupId nếu có
        };

        const response = await postService.createPost(payload);
        const createdPost = response.data;

        // 3. Xử lý phản hồi
        if (createdPost.status !== "PENDING") {
          // Chỉ hiện alert nếu KHÔNG phải là post trong group (vì GroupDetailPage sẽ handle toast riêng)
          if (!onPostCreated) {
            toast.success("Đã đăng bài viết!");
          }
        }

        // Gọi callback để parent xử lý (cập nhật UI list post)
        if (onPostCreated) {
          onPostCreated(createdPost);
        }

        // 4. Reset form
        resetForm();
        if (imageInputRef.current) imageInputRef.current.value = "";
        if (videoInputRef.current) videoInputRef.current.value = "";
      } catch (error) {
        console.error("Error creating post:", error);
        toast.error(error.message || "Đăng bài viết thất bại.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Xử lý khi chọn file
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Thêm file vào mảng media hiện tại
      formik.setFieldValue("media", [...formik.values.media, file]);
      // Reset input để chọn lại file giống nhau nếu muốn
      e.target.value = "";
    }
  };

  // Xử lý xóa file khỏi preview
  const removeMedia = (index) => {
    const newMedia = formik.values.media.filter((_, i) => i !== index);
    formik.setFieldValue("media", newMedia);
  };

  const visibilityIcons = {
    PUBLIC: Globe,
    FRIENDS: Users,
    PRIVATE: Lock,
  };

  const visibilityLabels = {
    PUBLIC: "Công khai",
    FRIENDS: "Bạn bè",
    PRIVATE: "Riêng tư",
  };

  return (
    <div className="bg-surface-main p-5 md:p-8 rounded-[2rem] border border-border-main shadow-sm transition-all duration-300 hover:shadow-md mb-4 md:mb-5 relative group/composer">
      {formik.isSubmitting && (
        <div className="absolute inset-0 bg-white/50 dark:bg-black/50 z-20 rounded-lg flex items-center justify-center backdrop-blur-[1px]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* --- INPUT AREA --- */}
      <div className="flex gap-4 md:gap-5 mb-4 md:mb-5">
        <div
          className="hidden md:block bg-center bg-no-repeat bg-cover rounded-full size-14 shrink-0 border border-border-main shadow-sm"
          style={{
            backgroundImage: `url("${
              userProfile?.currentAvatarUrl ||
              userAvatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }")`,
          }}
        ></div>
        <div className="flex-1 pt-1">
          <textarea
            name="content"
            rows={formik.values.content ? 4 : 1}
            className="w-full bg-transparent border-none focus:ring-0 text-text-main placeholder:text-text-secondary/60 text-lg md:text-xl p-0 resize-none leading-relaxed transition-all duration-200"
            placeholder={`Bạn đang nghĩ gì?`}
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
            style={{ minHeight: "2.5rem" }}
          ></textarea>
          {formik.touched.content && formik.errors.content && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              {formik.errors.content}
            </p>
          )}
        </div>
      </div>

      {/* --- MEDIA PREVIEW AREA --- */}
      {formik.values.media.length > 0 && (
        <div className="mb-4 animate-in fade-in zoom-in duration-200">
          <div
            className={`grid gap-2 ${
              formik.values.media.length === 1 ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {formik.values.media.map((file, index) => (
              <div
                key={index}
                className={`relative rounded-md overflow-hidden border border-border-main group/media bg-black/5 ${
                  formik.values.media.length === 3 && index === 0
                    ? "col-span-2 aspect-[2/1]"
                    : "aspect-video"
                }`}
              >
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(file)}
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeMedia(index)}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white rounded-md p-1.5 backdrop-blur-sm transition-all shadow-sm md:opacity-0 group-hover/media:opacity-100 scale-90 group-hover/media:scale-100"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {formik.errors.media && typeof formik.errors.media === "string" && (
        <p className="text-red-500 text-xs mb-3 px-1">{formik.errors.media}</p>
      )}

      {/* --- ACTIONS BAR --- */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border-main">
        {/* Left Actions: Media & Privacy */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Inputs ẩn */}
          <input
            type="file"
            hidden
            ref={imageInputRef}
            accept="image/*"
            onChange={handleFileChange}
          />
          <input
            type="file"
            hidden
            ref={videoInputRef}
            accept="video/*"
            onChange={handleFileChange}
          />

          <button
            type="button"
            onClick={() => imageInputRef.current.click()}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-green-500/10 text-green-600 transition-colors tooltip-trigger"
            title="Thêm ảnh"
          >
            <Image size={20} strokeWidth={2.5} />
            <span className="hidden md:inline font-medium text-sm">Ảnh</span>
          </button>

          <button
            type="button"
            onClick={() => videoInputRef.current.click()}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-blue-500/10 text-blue-600 transition-colors tooltip-trigger"
            title="Thêm video"
          >
            <Video size={20} strokeWidth={2.5} />
            <span className="hidden md:inline font-medium text-sm">Video</span>
          </button>

          {!groupId && <div className="h-5 w-px bg-border-main mx-1"></div>}

          {/* Visibility Dropdown */}
          {!groupId && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
                className="flex items-center gap-1.5 px-2 py-1.5 md:px-3 rounded-md hover:bg-background-main text-text-secondary transition-colors text-xs font-semibold bg-background-main/50 border border-transparent hover:border-border-main"
              >
                {(() => {
                  const Icon = visibilityIcons[formik.values.visibility];
                  return <Icon size={14} className="text-text-secondary" />;
                })()}
                <span className="hidden md:inline">
                  {visibilityLabels[formik.values.visibility]}
                </span>
                <ChevronDown size={12} className="opacity-70" />
              </button>

              {/* Menu */}
              {showVisibilityMenu && (
                <>
                  <div
                    className="fixed inset-0 z-20 cursor-default"
                    onClick={() => setShowVisibilityMenu(false)}
                  ></div>
                  <div className="absolute top-full left-0 mt-2 w-40 bg-surface-main border border-border-main rounded-lg shadow-xl z-30 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
                    {["PUBLIC", "FRIENDS", "PRIVATE"].map((vis) => (
                      <button
                        key={vis}
                        type="button"
                        onClick={() => {
                          formik.setFieldValue("visibility", vis);
                          setShowVisibilityMenu(false);
                        }}
                        className={`flex items-center gap-2.5 px-3 py-2.5 text-sm w-full text-left transition-colors ${
                          formik.values.visibility === vis
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-background-main text-text-main"
                        }`}
                      >
                        {(() => {
                          const Icon = visibilityIcons[vis];
                          return <Icon size={16} />;
                        })()}
                        {vis === "PUBLIC"
                          ? "Công khai"
                          : vis === "FRIENDS"
                          ? "Bạn bè"
                          : "Riêng tư"}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Actions: Post Button */}
        <button
          onClick={formik.handleSubmit}
          disabled={
            formik.isSubmitting ||
            (!formik.values.content.trim() && formik.values.media.length === 0)
          }
          className="bg-primary hover:bg-primary-hover text-[#231810] font-bold text-sm px-4 py-1.5 md:px-6 md:py-2 rounded-lg transition-all shadow-sm md:shadow-md shadow-primary/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
        >
          Đăng
        </button>
      </div>
    </div>
  );
}
