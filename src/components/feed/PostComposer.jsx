import { useState, useRef } from "react";
import { Image, Video, Globe, Users, Lock, ChevronDown, X } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import postService from "../../services/PostService";
import { uploadImage } from "../../utils/uploadImage"; // Import hàm uploadImage gốc từ utils

// --- CẤU HÌNH VALIDATION ---
const FILE_SIZE = 50 * 1024 * 1024; // 50MB (Cho phép video)
const SUPPORTED_FORMATS = [
  "image/jpg", "image/jpeg", "image/png", "image/gif", "image/webp",
  "video/mp4", "video/webm"
];

const validationSchema = Yup.object({
  content: Yup.string().trim().required("Please write something before posting!"),
  visibility: Yup.string().oneOf(["PUBLIC", "FRIENDS", "PRIVATE"]).required(),
  media: Yup.array()
    .of(
      Yup.mixed()
        .test("fileSize", "File too large (max 50MB)", (value) => {
          if (!value) return true;
          return value.size <= FILE_SIZE;
        })
        .test("fileType", "Unsupported format", (value) => {
          if (!value) return true;
          return SUPPORTED_FORMATS.includes(value.type);
        })
    )
    .max(4, "You can only upload up to 4 files."),
});

export default function PostComposer({ userAvatar, onPostCreated }) {
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
      try {
        setSubmitting(true);

        // 1. Upload file lên Cloudinary
        // Lưu ý: Đảm bảo file src/utils/uploadImage.js của bạn đã cho phép upload Video như hướng dẫn trước
        let mediaUrls = [];
        if (values.media.length > 0) {
          const uploadPromises = values.media.map((file) => 
             // Tham số thứ 2 là folder trên Cloudinary
             uploadImage(file, "posts") 
          );
          mediaUrls = await Promise.all(uploadPromises);
        }

        // 2. Gọi API Backend để tạo bài viết
        // Payload gửi đi là JSON
        const payload = {
          content: values.content,
          visibility: values.visibility,
          mediaUrls: mediaUrls, // Mảng các đường dẫn URL ảnh/video
        };

        const response = await postService.createPost(payload);
        const createdPost = response.data;

        // 3. Xử lý phản hồi
        if (createdPost.status === "PENDING") {
          alert("⚠️ Your post has been flagged for admin review.");
        } else {
          alert("✅ Post created successfully!");
          if (onPostCreated) {
            onPostCreated(createdPost);
          }
        }

        // 4. Reset form
        resetForm();
        if (imageInputRef.current) imageInputRef.current.value = "";
        if (videoInputRef.current) videoInputRef.current.value = "";

      } catch (error) {
        console.error("Error creating post:", error);
        alert(error.message || "❌ Failed to create post.");
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
      e.target.value = '';
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

  return (
    <div className="flex flex-col gap-4 bg-surface-main p-5 rounded-2xl shadow-lg border border-border-main transition-shadow hover:shadow-primary/5 mb-6">
      
      {/* --- HEADER: Avatar & Input --- */}
      <div className="flex gap-4">
        <div
          className="bg-center bg-no-repeat bg-cover rounded-full size-12 shrink-0 border border-border-main"
          style={{ backgroundImage: `url("${userAvatar}")` }}
        ></div>
        <div className="flex-1">
          <textarea
            name="content"
            className="w-full bg-transparent border-none focus:ring-0 text-text-main placeholder:text-text-secondary/60 resize-none text-lg py-2 h-14 leading-relaxed scrollbar-hide"
            placeholder="What's on your mind?"
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
          ></textarea>
          {formik.touched.content && formik.errors.content && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.content}</p>
          )}
        </div>
      </div>

      {/* --- PREVIEW MEDIA AREA --- */}
      {formik.values.media.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {formik.values.media.map((file, index) => (
            <div key={index} className="relative w-32 h-32 shrink-0 rounded-xl overflow-hidden border border-border-main group">
              {file.type.startsWith("image/") ? (
                <img 
                  src={URL.createObjectURL(file)} 
                  alt="preview" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <video 
                  src={URL.createObjectURL(file)} 
                  className="w-full h-full object-cover bg-black" 
                />
              )}
              <button
                type="button"
                onClick={() => removeMedia(index)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      {formik.errors.media && typeof formik.errors.media === 'string' && (
        <p className="text-red-500 text-xs">{formik.errors.media}</p>
      )}

      {/* --- FOOTER: Actions & Submit --- */}
      <div className="flex flex-wrap gap-2 justify-between items-center border-t border-border-main pt-4 mt-1">
        <div className="flex gap-1 items-center">
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

          {/* Button Photo */}
          <button 
            type="button"
            onClick={() => imageInputRef.current.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-background-main text-text-secondary hover:text-green-500 transition-colors"
          >
            <Image size={22} />
            <span className="text-sm font-medium hidden sm:block">Photo</span>
          </button>
          
          {/* Button Video */}
          <button 
            type="button"
            onClick={() => videoInputRef.current.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-background-main text-text-secondary hover:text-blue-500 transition-colors"
          >
            <Video size={22} />
            <span className="text-sm font-medium hidden sm:block">Video</span>
          </button>

          {/* Visibility Dropdown */}
          <div className="relative ml-2">
            <button
              type="button"
              onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#493222] text-text-secondary hover:text-white transition-colors"
            >
              {(() => {
                const Icon = visibilityIcons[formik.values.visibility];
                return <Icon size={18} />;
              })()}
              <span className="text-sm font-medium text-xs">{formik.values.visibility}</span>
              <ChevronDown size={16} />
            </button>
            
            {showVisibilityMenu && (
              <div className="absolute top-full left-0 mt-2 w-32 bg-surface-main border border-border-main rounded-lg shadow-xl z-20 overflow-hidden">
                {["PUBLIC", "FRIENDS", "PRIVATE"].map((vis) => (
                  <button
                    key={vis}
                    type="button"
                    onClick={() => {
                      formik.setFieldValue("visibility", vis);
                      setShowVisibilityMenu(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-background-main text-text-main text-sm w-full text-left transition-colors"
                  >
                    {(() => {
                      const Icon = visibilityIcons[vis];
                      return <Icon size={16} />;
                    })()}
                    {vis}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={formik.handleSubmit}
          disabled={formik.isSubmitting || (!formik.values.content.trim() && formik.values.media.length === 0)}
          className="bg-primary hover:bg-orange-600 text-[#231810] font-bold text-sm px-6 py-2.5 rounded-full transition-all shadow-md shadow-orange-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {formik.isSubmitting && (
            <div className="w-4 h-4 border-2 border-[#231810] border-t-transparent rounded-full animate-spin"></div>
          )}
          {formik.isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}