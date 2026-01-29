import { MailCheck, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import authService from "../../services/authService";

// Validation schema
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập địa chỉ email"),
});

export default function ForgotPassword() {
  const [isEmailSent, setIsEmailSent] = useState(false);

  const initialValues = {
    email: "",
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await authService.forgotPassword(values.email);
      setIsEmailSent(true);
      toast.success("Đã gửi email khôi phục!");
    } catch (error) {
      console.error(error);
      let message = "Không thể gửi email. Vui lòng thử lại.";
      if (error.response && error.response.data) {
        // Nếu data là string thì dùng luôn, nếu là object thì lấy field message hoặc error
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
    <div className="min-h-screen flex w-full bg-background-main transition-colors duration-300">
      {/* Left Side: Illustration */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-end p-12 overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDNcX_OkXziFr_DLXg1rNkbJ3wS9r2bvbi2h7-4klRlJeBSya1D4N4wo0Wo3duWWyiffzU6pC-bpTYad3yDlJusQLY3mGR5BrnFYwKkG1kckD6DKkpsjRcmjbL2k95yvQLmGtXotc-X-5YDks3CJW31a747NjvKC2jjBjTkL4lY4Wy6hv2d6-sLwGzHpT25KwBm12U_PzECna1eM0R8KR4wyFWEBCPdyO_gH_N4Jww7lIv99BG12Ho_k4vT0pmblJ949OOiPXscn98")',
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#231810] via-[#231810]/60 to-transparent opacity-90" />
        <div className="relative z-20 max-w-lg">
          <div className="flex items-center gap-3 mb-6 text-primary">
            <img
              src="/logo.png"
              alt="Connect Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="text-2xl font-bold tracking-tight text-text-main">
              Connect
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 tracking-tight text-text-main">
            Tìm kiếm những kết nối ý nghĩa dành riêng cho bạn.
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed max-w-md">
            Tham gia cộng đồng hàng triệu người đã tìm thấy một nửa hoàn hảo của
            mình. Bắt đầu hành trình của bạn ngay hôm nay.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col h-screen overflow-y-auto bg-background-main relative transition-colors duration-300">
        <div className="w-full p-6 flex justify-between items-center lg:hidden">
          <div className="flex items-center gap-2 text-white">
            <img
              src="/logo.png"
              alt="Connect Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="text-lg font-bold">Connect</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center py-10 px-6 sm:px-12 md:px-20 lg:px-24">
          <div className="max-w-[480px] w-full mx-auto">
            {isEmailSent ? (
              // Success message
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <MailCheck className="size-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold leading-tight tracking-tight mb-2 text-text-main">
                  Kiểm tra email của bạn
                </h1>
                <p className="text-text-secondary text-base mb-8">
                  Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.
                  Vui lòng kiểm tra hộp thư (bao gồm cả thư rác).
                </p>
                <button
                  type="button"
                  onClick={() => setIsEmailSent(false)}
                  className="text-primary hover:text-white font-medium transition-colors"
                >
                  Gửi lại email
                </button>
              </div>
            ) : (
              // Form
              <>
                <h1 className="text-3xl font-bold leading-tight tracking-tight mb-2 text-text-main">
                  Quên mật khẩu?
                </h1>
                <p className="text-text-secondary text-base mb-8">
                  Nhập địa chỉ email của bạn và chúng tôi sẽ gửi hướng dẫn để
                  đặt lại mật khẩu.
                </p>

                <Formik
                  initialValues={initialValues}
                  validationSchema={ForgotPasswordSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, isSubmitting }) => (
                    <Form className="flex flex-col gap-5">
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="email"
                          className="text-text-main text-base font-medium"
                        >
                          Địa chỉ Email
                        </label>
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          className={`form-input w-full rounded-xl text-text-main focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border ${
                            errors.email && touched.email
                              ? "border-red-500"
                              : "border-border-main"
                          } bg-surface-main h-14 px-4 placeholder:text-text-secondary/60 text-base transition-all duration-200`}
                          placeholder="VD: alex@example.com"
                        />
                        {errors.email && touched.email && (
                          <span className="text-red-500 text-sm">
                            {errors.email}
                          </span>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-4 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 bg-primary hover:bg-primary-hover text-white text-lg font-bold leading-normal tracking-wide transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Đang gửi..." : "Gửi liên kết đặt lại"}
                      </button>
                    </Form>
                  )}
                </Formik>
              </>
            )}

            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm font-medium"
              >
                <ArrowLeft size={20} />
                Quay lại Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
