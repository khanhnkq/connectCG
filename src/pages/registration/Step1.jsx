import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Envelope, Eye, EyeSlash } from "@phosphor-icons/react";
import toast from "react-hot-toast";

import { registerUser } from "../../redux/slices/authSlice";
import { getErrorMessage } from "../../utils/errorUtils";
import { Input } from "../../components/ui/input/Input";
import { Button, IconButton } from "../../components/ui/button/Button";
import { Card } from "../../components/ui/card/Card";
import {
  AuthSplitLayout,
  TermsModal,
  SocialLoginButtons,
} from "../../features/auth";

const Step1Schema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
    .max(20, "Tên đăng nhập không được quá 20 ký tự")
    .matches(/^[a-zA-Z0-9_]+$/, "Chỉ cho phép chữ cái, số và dấu gạch dưới")
    .required("Vui lòng nhập tên đăng nhập"),
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  password: Yup.string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .matches(/[a-z]/, "Mật khẩu phải chứa ít nhất 1 chữ thường")
    .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
    .matches(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 số")
    .required("Vui lòng nhập mật khẩu"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
    .required("Vui lòng xác nhận mật khẩu"),
  acceptTerms: Yup.boolean().oneOf(
    [true],
    "Bạn phải đồng ý với điều khoản để tiếp tục"
  ),
});

export default function Step1() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const dispatch = useDispatch();

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(registerUser(values)).unwrap();
      setRegisteredEmail(values.email);
      setIsRegisterSuccess(true);
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthSplitLayout
      title={isRegisterSuccess ? "Kiểm tra email của bạn" : "Tạo tài khoản mới"}
      subtitle={
        isRegisterSuccess
          ? `Chúng tôi đã gửi liên kết xác thực đến ${registeredEmail}.`
          : "Bắt đầu hành trình kết nối ý nghĩa cùng hàng ngàn thành viên."
      }
      backTo="/login"
    >
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />

      {isRegisterSuccess ? (
        <Card className="p-6 text-center space-y-5">
          <div className="size-16 rounded-2xl bg-primary/10 border-0 flex items-center justify-center mx-auto text-primary">
            <Envelope size={32} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-text-main">
              Xác thực tài khoản của bạn
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Vui lòng kiểm tra hộp thư đến và nhấp vào liên kết để kích hoạt tài
              khoản trước khi đăng nhập.
            </p>
          </div>

          <Link to="/login" className="block w-full pt-2">
            <Button variant="primary" size="lg" className="w-full">
              Về trang đăng nhập
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          <Formik
            initialValues={initialValues}
            validationSchema={Step1Schema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              setFieldValue,
              isSubmitting,
            }) => (
              <Form className="flex flex-col gap-3.5">
                <Input
                  id="step1-username"
                  name="username"
                  label="Tên đăng nhập"
                  placeholder="VD: alex_nguyen"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.username && errors.username}
                  disabled={isSubmitting}
                />

                <Input
                  id="step1-email"
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

                <Input
                  id="step1-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  label="Mật khẩu"
                  placeholder="Tối thiểu 8 ký tự (hoa, thường, số)"
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
                  id="step1-confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  label="Xác nhận mật khẩu"
                  placeholder="Nhập lại mật khẩu"
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
                      aria-label={
                        showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      tabIndex={-1}
                    />
                  }
                />

                {/* Checkbox điều khoản */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={values.acceptTerms}
                      onChange={(e) =>
                        setFieldValue("acceptTerms", e.target.checked)
                      }
                      className="mt-0.5 size-4 rounded text-primary focus:ring-primary border-0 bg-surface-subtle accent-primary cursor-pointer"
                      disabled={isSubmitting}
                    />
                    <span className="text-xs text-text-secondary leading-relaxed">
                      Tôi đồng ý với{" "}
                      <button
                        type="button"
                        onClick={() => setShowTerms(true)}
                        className="text-primary hover:underline font-bold"
                      >
                        Điều khoản sử dụng
                      </button>{" "}
                      của Connect.
                    </span>
                  </label>
                  {touched.acceptTerms && errors.acceptTerms && (
                    <p className="text-xs text-danger font-medium mt-1">
                      {errors.acceptTerms}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-2"
                  isLoading={isSubmitting}
                  loadingText="Đang tạo tài khoản..."
                >
                  Đăng ký tài khoản
                </Button>
              </Form>
            )}
          </Formik>

          {/* Phân tách */}
          <div className="relative my-5">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-surface-subtle" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background-main px-3 text-text-muted font-medium">
                Hoặc đăng ký nhanh với
              </span>
            </div>
          </div>

          <SocialLoginButtons />

          <p className="mt-6 text-center text-sm text-text-secondary">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-bold transition-colors"
            >
              Đăng nhập
            </Link>
          </p>
        </>
      )}
    </AuthSplitLayout>
  );
}
