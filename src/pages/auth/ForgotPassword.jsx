import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// Validation schema
const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email('Email không hợp lệ')
        .required('Vui lòng nhập địa chỉ email'),
});

export default function ForgotPassword() {
    const [isEmailSent, setIsEmailSent] = useState(false);

    const initialValues = {
        email: ''
    };

    const handleSubmit = (values, { setSubmitting }) => {
        console.log('Reset link sent to:', values.email);

        // TODO: Gọi API gửi email reset password ở đây
        // try {
        //     await sendResetEmail(values.email);
        //     setIsEmailSent(true);
        // } catch (error) {
        //     setErrors({ email: 'Không thể gửi email. Vui lòng thử lại.' });
        // }

        setSubmitting(false);
        setIsEmailSent(true);
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
                <div className="w-full p-6 flex justify-between items-center lg:hidden">
                    <div className="flex items-center gap-2 text-white">
                        <span className="material-symbols-outlined text-primary">favorite</span>
                        <span className="text-lg font-bold">Connect</span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center py-10 px-6 sm:px-12 md:px-20 lg:px-24">
                    <div className="max-w-[480px] w-full mx-auto">
                        {isEmailSent ? (
                            // Success message
                            <div className="text-center">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-primary">mark_email_read</span>
                                </div>
                                <h1 className="text-3xl font-bold leading-tight tracking-tight mb-2 text-white">
                                    Kiểm tra email của bạn
                                </h1>
                                <p className="text-text-secondary text-base mb-8">
                                    Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư (bao gồm cả thư rác).
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
                                <h1 className="text-3xl font-bold leading-tight tracking-tight mb-2 text-white">
                                    Quên mật khẩu?
                                </h1>
                                <p className="text-text-secondary text-base mb-8">
                                    Nhập địa chỉ email của bạn và chúng tôi sẽ gửi hướng dẫn để đặt lại mật khẩu.
                                </p>

                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={ForgotPasswordSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ errors, touched, isSubmitting }) => (
                                        <Form className="flex flex-col gap-5">
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="email" className="text-white text-base font-medium">Địa chỉ Email</label>
                                                <Field
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    className={`form-input w-full rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border ${errors.email && touched.email ? 'border-red-500' : 'border-border-dark'} bg-surface-dark h-14 px-4 placeholder:text-text-secondary/60 text-base transition-all duration-200`}
                                                    placeholder="VD: alex@example.com"
                                                />
                                                {errors.email && touched.email && (
                                                    <span className="text-red-500 text-sm">{errors.email}</span>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="mt-4 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 bg-primary hover:bg-orange-600 text-white text-lg font-bold leading-normal tracking-wide transition-colors shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
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
