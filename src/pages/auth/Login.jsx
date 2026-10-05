import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import toast from "react-hot-toast";

import { loginUser } from "../../redux/slices/authSlice";
import { getErrorMessage } from "../../utils/errorUtils";
import { Input } from "../../components/ui/input/Input";
import { Button, IconButton } from "../../components/ui/button/Button";
import {
  AuthSplitLayout,
  AccountLockedDialog,
  SocialLoginButtons,
} from "../../features/auth";

const LoginSchema = Yup.object().shape({
  email: Yup.string().required("Vui lòng nhập email hoặc tên đăng nhập"),
  password: Yup.string()
    .min(1, "Vui lòng nhập mật khẩu")
    .required("Vui lòng nhập mật khẩu"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [lockedError, setLockedError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const initialValues = {
    email: "",
    password: "",
  };

  useEffect(() => {
    const errorMsg = localStorage.getItem("loginError");
    if (errorMsg) {
      setLockedError(errorMsg);
      localStorage.removeItem("loginError");
    }
  }, []);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const resultAction = await dispatch(loginUser(values)).unwrap();
      const displayName =
        resultAction.fullName || resultAction.username || "bạn";
      toast.success(`Đăng nhập thành công! Chào mừng ${displayName}`);
      if (resultAction.hasProfile) {
        navigate("/dashboard/feed");
      } else {
        navigate("/onboarding");
      }
    } catch (error) {
      const message = getErrorMessage(error);
      console.error("Login Failed:", error);
      setErrors({
        email: message || "Tên đăng nhập hoặc mật khẩu không đúng",
      });

      const errorMsg = (message || "").toLowerCase();
      if (
        errorMsg.includes("khóa") ||
        errorMsg.includes("lock") ||
        errorMsg.includes("ban") ||
        errorMsg.includes("xóa") ||
        errorMsg.includes("delete")
      ) {
        setLockedError(message);
      } else {
        toast.error(message || "Đăng nhập thất bại. Vui lòng kiểm tra lại!");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthSplitLayout
      title="Chào mừng bạn trở lại"
      subtitle="Vui lòng nhập thông tin của bạn để đăng nhập."
    >
      <AccountLockedDialog
        isOpen={!!lockedError}
        message={lockedError}
        onClose={() => setLockedError(null)}
      />

      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <Input
              id="login-email"
              name="email"
              label="Địa chỉ Email hoặc Tên đăng nhập"
              placeholder="VD: alex@example.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
              disabled={isSubmitting || loading}
            />

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-bold text-text-main select-none"
                >
                  Mật khẩu
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-primary hover:underline transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <Input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu của bạn"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password}
                disabled={isSubmitting || loading}
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
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isSubmitting || loading}
              loadingText="Đang đăng nhập..."
            >
              Đăng nhập
            </Button>
          </Form>
        )}
      </Formik>

      {/* Phân tách */}
      <div className="relative my-6">
        <div aria-hidden="true" className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-main" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background-main px-3 text-text-muted font-medium">
            Hoặc tiếp tục với
          </span>
        </div>
      </div>

      {/* Social Login */}
      <SocialLoginButtons />

      {/* Link đăng ký */}
      <p className="mt-8 text-center text-sm text-text-secondary">
        Chưa có tài khoản?{" "}
        <Link
          to="/registration/step-1"
          className="text-primary hover:underline font-bold transition-colors"
        >
          Đăng ký ngay
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
