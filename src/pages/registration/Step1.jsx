import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../redux/slices/authSlice';

// Validation schema
const Step1Schema = Yup.object().shape({
    username: Yup.string()
        .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
        .max(20, 'Tên đăng nhập không được quá 20 ký tự')
        .matches(/^[a-zA-Z0-9_]+$/, 'Chỉ cho phép chữ cái, số và dấu gạch dưới')
        .required('Vui lòng nhập tên đăng nhập'),
    email: Yup.string()
        .email('Email không hợp lệ')
        .required('Vui lòng nhập email'),
    password: Yup.string()
        .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
        .matches(/[a-z]/, 'Mật khẩu phải chứa ít nhất 1 chữ thường')
        .matches(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa')
        .matches(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 số')
        .required('Vui lòng nhập mật khẩu'),
});

export default function Step1() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const initialValues = {
        username: '',
        email: '',
        password: ''
    };

    const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await dispatch(registerUser(values)).unwrap();
            setIsRegisterSuccess(true);
        } catch (error) {
            toast.error(error.message || "Đăng ký thất bại");
        } finally {
            setSubmitting(false);
        }
    };

    if (isRegisterSuccess) {
        return (
            <div className="min-h-screen flex w-full bg-background-light dark:bg-background-dark items-center justify-center p-4">
                <div className="bg-surface-dark p-8 rounded-2xl border border-border-dark shadow-xl text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-4xl text-primary">mail</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Kiểm tra email của bạn</h2>
                    <p className="text-text-secondary mb-6">
                        Chúng tôi đã gửi một liên kết xác thực đến email của bạn. Vui lòng kiểm tra và xác thực tài khoản để tiếp tục.
                    </p>
                    <Link 
                        to="/login"
                        className="inline-flex items-center justify-center px-6 py-3 bg-surface-dark border border-border-dark text-white rounded-full font-medium hover:bg-border-dark transition-colors"
                    >
                        Về trang đăng nhập
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex w-full bg-background-light dark:bg-background-dark">
            {/* Left Side: Illustration/Image */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-end p-12 overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDNcX_OkXziFr_DLXg1rNkbJ3wS9r2bvbi2h7-4klRlJeBSya1D4N4wo0Wo3duWWyiffzU6pC-bpTYad3yDlJusQLY3mGR5BrnFYwKkG1kckD6DKkpsjRcmjbL2k95yvQLmGtXotc-X-5YDks3CJW31a747NjvKC2jjBjTkL4lY4Wy6hv2d6-sLwGzHpT25KwBm12U_PzECna1eM0R8KR4wyFWEBCPdyO_gH_N4Jww7lIv99BG12Ho_k4vT0pmblJ949OOiPXscn98")'
                    }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#231810] via-[#231810]/60 to-transparent opacity-90" />
                {/* Content */}
                <div className="relative z-20 max-w-lg">
                    <div className="flex items-center gap-3 mb-6 text-primary">
                        <span className="material-symbols-outlined text-4xl">favorite</span>
                        <span className="text-2xl font-bold tracking-tight text-white">Connect</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 tracking-tight text-white">
                        Tìm kiếm những kết nối ý nghĩa dành riêng cho bạn.
                    </h2>
                    <p className="text-text-secondary text-lg leading-relaxed max-w-md">
                        Tham gia cộng đồng hàng triệu người đã tìm thấy một nửa hoàn hảo của mình. Bắt đầu hành trình của bạn ngay hôm nay.
                    </p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex flex-col h-screen overflow-y-auto bg-background-dark relative">
                {/* Top Navigation (Mobile/Tablet only) */}
                <div className="w-full p-6 flex justify-between items-center lg:hidden">
                    <div className="flex items-center gap-2 text-white">
                        <span className="material-symbols-outlined text-primary">favorite</span>
                        <span className="text-lg font-bold">Connect</span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center py-10 px-6 sm:px-12 md:px-20 lg:px-24">
                    <div className="max-w-[480px] w-full mx-auto">
                        {/* Progress Bar
                        <div className="flex flex-col gap-3 mb-8">
                            <div className="flex gap-6 justify-between items-end">
                                <p className="text-white text-base font-medium leading-normal">Bước 1 / 2</p>
                                <span className="text-text-secondary text-sm font-medium">Thông tin cá nhân</span>
                            </div>
                            <div className="rounded-full bg-border-dark h-2 overflow-hidden">
                                <div className="h-full rounded-full bg-primary w-1/2" />
                            </div>
                        </div> */}

                        {/* Title */}
                        <h1 className="text-3xl font-bold leading-tight tracking-tight mb-2 text-white">
                            Tạo hồ sơ của bạn
                        </h1>
                        <p className="text-text-secondary text-base mb-8">
                            Nhập thông tin cá nhân của bạn để bắt đầu.
                        </p>

                        {/* Form */}
                        <Formik
                            initialValues={initialValues}
                            validationSchema={Step1Schema}
                            onSubmit={handleSubmit}
                        >
                            {({ errors, touched, isSubmitting }) => (
                                <Form className="flex flex-col gap-5">
                                    {/* Username */}
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="username" className="text-white text-base font-medium">Tên đăng nhập</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">@</span>
                                            <Field
                                                type="text"
                                                name="username"
                                                id="username"
                                                className={`form-input w-full rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border ${errors.username && touched.username ? 'border-red-500' : 'border-border-dark'} bg-surface-dark h-14 pl-10 pr-4 placeholder:text-text-secondary/60 text-base transition-all duration-200`}
                                                placeholder="nguyen_van_a"
                                            />
                                        </div>
                                        {errors.username && touched.username && (
                                            <span className="text-red-500 text-sm">{errors.username}</span>
                                        )}
                                    </div>

                                    

                                    {/* Email */}
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="email" className="text-white text-base font-medium">Địa chỉ Email</label>
                                        <Field
                                            type="email"
                                            name="email"
                                            id="email"
                                            className={`form-input w-full rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border ${errors.email && touched.email ? 'border-red-500' : 'border-border-dark'} bg-surface-dark h-14 px-4 placeholder:text-text-secondary/60 text-base transition-all duration-200`}
                                            placeholder="email@example.com"
                                        />
                                        {errors.email && touched.email && (
                                            <span className="text-red-500 text-sm">{errors.email}</span>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="password" className="text-white text-base font-medium">Mật khẩu</label>
                                        <div className="relative flex items-center">
                                            <Field
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                id="password"
                                                className={`form-input w-full rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border ${errors.password && touched.password ? 'border-red-500' : 'border-border-dark'} bg-surface-dark h-14 pl-4 pr-12 placeholder:text-text-secondary/60 text-base transition-all duration-200`}
                                                placeholder="Tối thiểu 8 ký tự"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 cursor-pointer text-text-secondary hover:text-primary transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[20px] leading-none">
                                                    {showPassword ? 'visibility_off' : 'visibility'}
                                                </span>
                                            </button>
                                        </div>
                                        {errors.password && touched.password && (
                                            <span className="text-red-500 text-sm">{errors.password}</span>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="mt-4 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 bg-primary hover:bg-orange-600 text-white text-lg font-bold leading-normal tracking-wide transition-colors shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Đang xử lý...' : 'Tiếp tục'}
                                    </button>
                                </Form>
                            )}
                        </Formik>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border-dark" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-background-dark px-4 text-sm text-text-secondary">
                                    Hoặc tiếp tục với
                                </span>
                            </div>
                        </div>

                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button
                                type="button"
                                className="flex items-center justify-center gap-3 rounded-xl border border-border-dark bg-surface-dark hover:bg-border-dark h-14 px-4 transition-colors"
                            >
                                <svg aria-hidden="true" className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                </svg>
                                <span className="text-white font-medium">Facebook</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center gap-3 rounded-xl border border-border-dark bg-surface-dark hover:bg-border-dark h-14 px-4 transition-colors"
                            >
                                <svg aria-hidden="true" className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09zM12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23zM5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84zM12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span className="text-white font-medium">Google</span>
                            </button>
                        </div>

                        {/* Login Link */}
                        <p className="text-center text-text-secondary text-sm">
                            Đã có tài khoản?{' '}
                            <Link to="/login" className="text-primary hover:text-white font-bold transition-colors">
                                Đăng nhập
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
