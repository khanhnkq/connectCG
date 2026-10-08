import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { EnvelopeOpen, ArrowLeft } from "@phosphor-icons/react";
import toast from "react-hot-toast";

import authService from "../../services/authService";
import { Input } from "../../components/ui/input/Input";
import { Button } from "../../components/ui/button/Button";
import { Card } from "../../components/ui/card/Card";
import { AuthSplitLayout } from "../../features/auth";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập địa chỉ email"),
});

export default function ForgotPassword() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const initialValues = {
    email: "",
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await authService.forgotPassword(values.email);
      setSentEmail(values.email);
      setIsEmailSent(true);
      toast.success("Đã gửi email khôi phục!");
    } catch (error) {
      console.error(error);
      let message = "Không thể gửi email. Vui lòng thử lại.";
      if (error.response && error.response.data) {
        const data = error.response.data;
        if (typeof data === "string") {
          message = data;
        } else if (typeof data === "object") {
          message = data.message || data.error || JSON.stringify(data);
        }
      }
      setErrors({ email: message });
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthSplitLayout
      title={isEmailSent ? "Kiểm tra hộp thư của bạn" : "Quên mật khẩu?"}
      subtitle={
        isEmailSent
          ? `Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến ${sentEmail}.`
          : "Nhập địa chỉ email đã đăng ký để nhận liên kết khôi phục mật khẩu."
      }
      backTo="/login"
    >
      {isEmailSent ? (
        <Card className="p-6 text-center space-y-5">
          <div className="size-16 rounded-2xl bg-primary/10 border-0 flex items-center justify-center mx-auto text-primary">
            <EnvelopeOpen size={32} />
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-text-main">
              Email đã được gửi thành công
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Vui lòng kiểm tra hộp thư đến (và thư mục rác) để nhấp vào liên kết
              đặt lại mật khẩu.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link to="/login" className="w-full">
              <Button variant="primary" size="lg" className="w-full">
                Quay lại đăng nhập
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="md"
              className="w-full"
              onClick={() => setIsEmailSent(false)}
            >
              Thử lại với email khác
            </Button>
          </div>
        </Card>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={ForgotPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form className="flex flex-col gap-5">
              <Input
                id="forgot-email"
                name="email"
                type="email"
                label="Địa chỉ Email"
                placeholder="VD: alex@example.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
                disabled={isSubmitting}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isSubmitting}
                loadingText="Đang gửi email..."
              >
                Gửi liên kết khôi phục
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-text-secondary hover:text-primary transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  <span>Quay lại trang Đăng nhập</span>
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </AuthSplitLayout>
  );
}
