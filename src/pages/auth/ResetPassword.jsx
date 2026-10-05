import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  WarningCircle,
  CheckCircle,
  Eye,
  EyeSlash,
} from "@phosphor-icons/react";
import toast from "react-hot-toast";

import authService from "../../services/authService";
import { Input } from "../../components/ui/input/Input";
import { Button, IconButton } from "../../components/ui/button/Button";
import { Card } from "../../components/ui/card/Card";
import { AuthSplitLayout } from "../../features/auth";

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Vui lòng nhập mật khẩu mới"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
    .required("Vui lòng xác nhận mật khẩu"),
});

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Nếu không có token trên URL, hiển thị thông báo lỗi
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-main p-6">
        <Card className="max-w-md w-full p-8 text-center space-y-5">
          <div className="size-16 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto text-danger">
            <WarningCircle size={32} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-main mb-2">
              Liên kết không hợp lệ
            </h1>
            <p className="text-text-secondary text-sm leading-relaxed">
              Liên kết đặt lại mật khẩu này bị thiếu thông tin xác thực hoặc đã hết hạn.
            </p>
          </div>
          <Link to="/forgot-password" className="block w-full">
            <Button variant="primary" size="lg" className="w-full">
              Yêu cầu liên kết mới
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await authService.resetPassword(token, values.password);
      setIsSubmitted(true);
      toast.success("Đặt lại mật khẩu thành công!");
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.message || "Đã xảy ra lỗi. Token có thể đã hết hạn.";
      setErrors({ confirmPassword: message });
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthSplitLayout
      title={isSubmitted ? "Đặt lại mật khẩu thành công" : "Tạo mật khẩu mới"}
      subtitle={
        isSubmitted
          ? "Mật khẩu của bạn đã được cập nhật thành công."
          : "Vui lòng nhập mật khẩu mới để tiếp tục đăng nhập tài khoản."
      }
      heroTitle="Bảo mật tài khoản của bạn."
      heroSubtitle="Đặt lại mật khẩu mới để tiếp tục truy cập vào tài khoản và kết nối với mọi người."
      backTo="/login"
    >
      {isSubmitted ? (
        <Card className="p-6 text-center space-y-5">
          <div className="size-16 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center mx-auto text-success">
            <CheckCircle size={32} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-text-main">
              Cập nhật thành công!
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Bạn có thể sử dụng mật khẩu mới này để đăng nhập ngay bây giờ.
            </p>
          </div>

          <Link to="/login" className="block w-full pt-2">
            <Button variant="primary" size="lg" className="w-full">
              Đăng nhập ngay
            </Button>
          </Link>
        </Card>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={ResetPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <Input
                id="reset-password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Mật khẩu mới"
                placeholder="Ít nhất 6 ký tự"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password}
                disabled={isSubmitting}
                rightElement={
                  <IconButton
                    size="sm"
                    variant="ghost"
                    icon={showPassword ? EyeSlash : Eye}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  />
                }
              />

              <Input
                id="reset-confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                label="Xác nhận mật khẩu mới"
                placeholder="Nhập lại mật khẩu mới"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && errors.confirmPassword}
                disabled={isSubmitting}
                rightElement={
                  <IconButton
                    size="sm"
                    variant="ghost"
                    icon={showConfirmPassword ? EyeSlash : Eye}
                    aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  />
                }
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isSubmitting}
                loadingText="Đang cập nhật..."
              >
                Cập nhật mật khẩu
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </AuthSplitLayout>
  );
}
