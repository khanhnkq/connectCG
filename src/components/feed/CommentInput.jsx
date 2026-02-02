import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Send, Loader2 } from "lucide-react";

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
  return (
    <Formik
      initialValues={{ content: initialValue }}
      validationSchema={CommentSchema}
      onSubmit={async (values, { resetForm }) => {
        if (!values.content.trim()) return;
        await onSubmit(values.content.trim());
        resetForm();
      }}
    >
      {({ values, isSubmitting, isValid }) => (
        <Form
          className={`flex-1 flex gap-2 relative rounded-full ${className}`}
        >
          <Field
            name="content"
            placeholder={placeholder}
            autoFocus={autoFocus}
            autoComplete="off"
            className="w-full px-4 py-2 text-sm rounded-full bg-background-main border border-border-main  focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all pr-10"
          />

          <button
            type="submit"
            disabled={!values.content.trim() || isSubmitting}
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${
              values.content.trim() && !isSubmitting
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
        </Form>
      )}
    </Formik>
  );
}
