import { useState, useRef, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import postService from "../../../services/PostService";
import { uploadImage } from "../../../utils/uploadImage";
import toast from "react-hot-toast";

const FILE_SIZE = 50 * 1024 * 1024; // 50MB
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
        })
    )
    .max(4, "Bạn chỉ có thể tải lên tối đa 4 tệp."),
});

/**
 * Custom hook for post composition, file handling, and submission logic.
 */
export function usePostComposer({ onPostCreated, groupId } = {}) {
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      content: "",
      visibility: "PUBLIC",
      media: [],
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        setSubmitting(true);

        // Upload media files
        let mediaUrls = [];
        if (values.media.length > 0) {
          const uploadPromises = values.media.map((file) =>
            uploadImage(file, "posts")
          );
          mediaUrls = await Promise.all(uploadPromises);
        }

        const payload = {
          content: values.content,
          visibility: values.visibility,
          mediaUrls,
          groupId: groupId || null,
        };

        const response = await postService.createPost(payload);
        const createdPost = response.data;

        if (createdPost.status !== "PENDING" && !onPostCreated) {
          toast.success("Đã đăng bài viết!");
        }

        if (onPostCreated) {
          onPostCreated(createdPost);
        }

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

  const handleFileChange = useCallback(
    (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        formik.setFieldValue("media", [...formik.values.media, file]);
        e.target.value = "";
      }
    },
    [formik]
  );

  const removeMedia = useCallback(
    (index) => {
      const newMedia = formik.values.media.filter((_, i) => i !== index);
      formik.setFieldValue("media", newMedia);
    },
    [formik]
  );

  return {
    formik,
    showVisibilityMenu,
    setShowVisibilityMenu,
    imageInputRef,
    videoInputRef,
    handleFileChange,
    removeMedia,
  };
}

export default usePostComposer;
