import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import authService from '../../services/authService';

// Validation schema
const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .required('Vui lòng nhập mật khẩu mới'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
        .required('Vui lòng xác nhận mật khẩu'),
});

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    
    // UI states
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // Nếu không có token trên URL, hiển thị lỗi
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-dark text-white p-4">
                <div className="text-center max-w-md">
                    <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
                    <h1 className="text-2xl font-bold mb-2">Liên kết không hợp lệ</h1>
                    <p className="text-text-secondary mb-6">Liên kết đặt lại mật khẩu này bị thiếu thông tin xác thực hoặc không hợp lệ.</p>
                    <Link to="/forgot-password" className="text-primary hover:underline font-bold">Quay lại trang Quên mật khẩu</Link>
                </div>
            </div>
        );
    }

    const initialValues = {
        password: '',
        confirmPassword: ''
    };

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            await authService.resetPassword(token, values.password);
            setIsSubmitted(true);
            toast.success("Đặt lại mật khẩu thành công!");
        } catch (error) {
            console.error(error);
            const message = error.response?.data || "Đã xảy ra lỗi. Token có thể đã hết hạn.";
            setErrors({ submit: message });
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full bg-background-light dark:bg-background-dark">
            {/* Left Side: Illustration */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-end p-12 overflow-hidden">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDNcX_OkXziFr_DLXg1rNkbJ3wS9r2bvbi2h7-4klRlJeBSya1D4N4wo0Wo3duWWyiffzU6pC-bpTYad3yDlJusQLY3mGR5BrnFYwKkG1kckD6DKkpsjRcmjbL2k95yvQLmGtXotc-X-5YDks3CJW31a747NjvKC2jjBjTkL4lY4Wy6hv2d6-sLwGzHpT25KwBm12U_PzECna1eM0R8KR4wyFWEBCPdyO_gH_N4Jww7lIv99BG12Ho_k4vT0pmblJ949OOiPXscn98")'
                    }}
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#231810] via-[#231810]/60 to-transparent opacity-90" />
                <div className="relative z-20 max-w-lg">
                    <div className="flex items-center gap-3 mb-6 text-primary">
                        <img src="/logo.png" alt="Connect Logo" className="h-10 w-auto object-contain" />
                        <span className="text-2xl font-bold tracking-tight text-white">Connect</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 tracking-tight text-white">
                        Bảo mật tài khoản của bạn.
                    </h2>
                    <p className="text-text-secondary text-lg leading-relaxed max-w-md">
                        Đặt lại mật khẩu mới để tiếp tục truy cập vào tài khoản và kết nối với mọi người.
                    </p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex flex-col h-screen overflow-y-auto bg-background-dark relative">
                <div className="w-full p-6 flex justify-between items-center lg:hidden">
                    <div className="flex items-center gap-2 text-white">
                         <Link to="/" className="flex items-center gap-2">
                            <img src="/logo.png" alt="Connect Logo" className="h-8 w-auto object-contain" />
                            <span className="text-lg font-bold">Connect</span>
                        </Link>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center py-10 px-6 sm:px-12 md:px-20 lg:px-24">
                    <div className="max-w-[480px] w-full mx-auto">
                        {isSubmitted ? (
                            // Success message
                            <div className="text-center">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-green-500">check_circle</span>
                                </div>
                                <h1 className="text-3xl font-bold leading-tight tracking-tight mb-2 text-white">
                                    Đổi mật khẩu thành công!
                                </h1>
                                <p className="text-text-secondary text-base mb-8">
                                    Mật khẩu của bạn đã được cập nhật. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.
                                </p>
                                <Link
                                    to="/login"
                                    className="inline-flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 bg-primary hover:bg-orange-600 text-white text-lg font-bold leading-normal tracking-wide transition-colors shadow-lg shadow-orange-900/20"
                                >
                                    Đăng nhập ngay
                                </Link>
                            </div>
                        ) : (
                            // Form
                            <>
                                <h1 className="text-3xl font-bold leading-tight tracking-tight mb-2 text-white">
                                    Đặt lại mật khẩu
                                </h1>
                                <p className="text-text-secondary text-base mb-8">
                                    Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
                                </p>

                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={ResetPasswordSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ errors, touched, isSubmitting }) => (
                                        <Form className="flex flex-col gap-5">
                                            {/* New Password */}
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="password" className="text-white text-base font-medium">Mật khẩu mới</label>
                                                <Field
                                                    type="password"
                                                    name="password"
                                                    id="password"
                                                    className={`form-input w-full rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border ${errors.password && touched.password ? 'border-red-500' : 'border-border-dark'} bg-surface-dark h-14 px-4 placeholder:text-text-secondary/60 text-base transition-all duration-200`}
                                                    placeholder="••••••••"
                                                />
                                                {errors.password && touched.password && (
                                                    <span className="text-red-500 text-sm">{errors.password}</span>
                                                )}
                                            </div>

                                            {/* Confirm Password */}
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="confirmPassword" className="text-white text-base font-medium">Xác nhận mật khẩu</label>
                                                <Field
                                                    type="password"
                                                    name="confirmPassword"
                                                    id="confirmPassword"
                                                    className={`form-input w-full rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-border-dark'} bg-surface-dark h-14 px-4 placeholder:text-text-secondary/60 text-base transition-all duration-200`}
                                                    placeholder="••••••••"
                                                />
                                                {errors.confirmPassword && touched.confirmPassword && (
                                                    <span className="text-red-500 text-sm">{errors.confirmPassword}</span>
                                                )}
                                            </div>
                                            
                                            {errors.submit && (
                                                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
                                                    {errors.submit}
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="mt-4 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 bg-primary hover:bg-orange-600 text-white text-lg font-bold leading-normal tracking-wide transition-colors shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? 'Đang xử lý...' : 'Đổi mật khẩu'}
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
                                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                                Quay lại Đăng nhập
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
