import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Send, Loader2, Image, X } from "lucide-react";
import { uploadImage } from "../../utils/uploadImage";
import { useRef, useState } from "react";

const CommentSchema = Yup.object().shape({
  content: Yup.string()
    .trim()
    .required("Nội dung không được để trống")
    .max(1000, "Bình luận quá dài"),
});

export default function CommentInput({
  initialValue = "",
  placeholder = "Viết bình luận...",
  onSubmit, // async function(content)
  className = "",
  autoFocus = false,
}) {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Formik
      initialValues={{ content: initialValue }}
      validationSchema={CommentSchema}
      onSubmit={async (values, { resetForm }) => {
        if (!values.content.trim() && !selectedImage) return;

        let imageUrl = null;
        if (selectedImage) {
          try {
            imageUrl = await uploadImage(selectedImage, "comments");
          } catch (error) {
            console.error("Error uploading image:", error);
            return;
          }
        }

        await onSubmit(values.content.trim(), imageUrl);
        resetForm();
        removeImage();
      }}
    >
      {({ values, isSubmitting, setFieldValue }) => (
        <div className="flex-1 flex flex-col gap-2">
          {previewUrl && (
            <div className="relative inline-block w-20 h-20 mb-1 animate-in fade-in zoom-in duration-200">
              <img
                src={previewUrl}
                alt="preview"
                className="w-full h-full object-cover rounded-lg border border-border-main"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-black/60 hover:bg-red-500 text-white rounded-full p-1 transition-colors shadow-sm"
              >
                <X size={12} />
              </button>
            </div>
          )}
          <Form
            className={`flex flex-col gap-2 relative rounded-lg ${className}`}
          >
            <div className="relative flex items-center">
              <Field
                name="content"
                placeholder={placeholder}
                autoFocus={autoFocus}
                autoComplete="off"
                as="textarea"
                rows={1}
                className="w-full px-4 py-2 text-sm rounded-lg bg-background-main border border-border-main focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all pr-20 resize-none min-h-[38px] leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (values.content.trim() || selectedImage) {
                      e.target.form.requestSubmit();
                    }
                  }
                }}
              />

              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="p-1.5 rounded-md text-text-secondary hover:bg-background-main transition-colors"
                  disabled={isSubmitting}
                >
                  <Image size={18} />
                </button>

                <button
                  type="submit"
                  disabled={
                    (!values.content.trim() && !selectedImage) || isSubmitting
                  }
                  className={`p-1.5 rounded-md transition-all ${
                    (values.content.trim() || selectedImage) && !isSubmitting
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "text-text-secondary/50 cursor-not-allowed hover:bg-transparent"
                  }`}
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
}
