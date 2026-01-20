import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Step1() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        occupation: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

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
                        Find meaningful connections tailored to you.
                    </h2>
                    <p className="text-text-secondary text-lg leading-relaxed max-w-md">
                        Join a community of millions of people who have found their perfect match. Start your journey today.
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
                        {/* Progress Bar */}
                        <div className="flex flex-col gap-3 mb-8">
                            <div className="flex gap-6 justify-between items-end">
                                <p className="text-white text-base font-medium leading-normal">Step 1 of 2</p>
                                <span className="text-text-secondary text-sm font-medium">Personal Details</span>
                            </div>
                            <div className="rounded-full bg-border-dark h-2 overflow-hidden">
                                <div className="h-full rounded-full bg-primary w-1/2" />
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl font-bold leading-tight tracking-tight mb-2 text-white">
                            Create your profile
                        </h1>
                        <p className="text-text-secondary text-base mb-8">
                            Enter your details to get started.
                        </p>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            {/* Full Name */}
                            <label className="flex flex-col gap-2">
                                <span className="text-white text-base font-medium">Full Name</span>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="form-input w-full rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border border-border-dark bg-surface-dark h-14 px-4 placeholder:text-text-secondary/60 text-base transition-all duration-200"
                                    placeholder="e.g. Alex Smith"
                                />
                            </label>

                            {/* Date of Birth */}
                            <label className="flex flex-col gap-2">
                                <span className="text-white text-base font-medium">Date of Birth</span>
                                <div className="relative">
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        className="form-input w-full rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border border-border-dark bg-surface-dark h-14 px-4 text-base transition-all duration-200 appearance-none"
                                        placeholder="DD/MM/YYYY"
                                    />
                                </div>
                            </label>

                            {/* Occupation */}
                            <label className="flex flex-col gap-2">
                                <span className="text-white text-base font-medium">Occupation</span>
                                <input
                                    type="text"
                                    name="occupation"
                                    value={formData.occupation}
                                    onChange={handleChange}
                                    className="form-input w-full rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border border-border-dark bg-surface-dark h-14 px-4 placeholder:text-text-secondary/60 text-base transition-all duration-200"
                                    placeholder="e.g. Designer, Teacher"
                                />
                            </label>

                            {/* Email */}
                            <label className="flex flex-col gap-2">
                                <span className="text-white text-base font-medium">Email Address</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input w-full rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border border-border-dark bg-surface-dark h-14 px-4 placeholder:text-text-secondary/60 text-base transition-all duration-200"
                                    placeholder="name@example.com"
                                />
                            </label>

                            {/* Password */}
                            <label className="flex flex-col gap-2">
                                <span className="text-white text-base font-medium">Password</span>
                                <div className="relative flex items-center">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="form-input w-full rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border border-border-dark bg-surface-dark h-14 pl-4 pr-12 placeholder:text-text-secondary/60 text-base transition-all duration-200"
                                        placeholder="Min. 8 characters"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 text-text-secondary hover:text-primary transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px] leading-none">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </label>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="mt-4 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 bg-primary hover:bg-orange-600 text-white text-lg font-bold leading-normal tracking-wide transition-colors shadow-lg shadow-orange-900/20"
                            >
                                Continue
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border-dark" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-background-dark px-4 text-sm text-text-secondary">
                                    Or continue with
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
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                <span className="text-white font-medium">Twitter</span>
                            </button>
                        </div>

                        {/* Login Link */}
                        <p className="text-center text-text-secondary text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary hover:text-white font-bold transition-colors">
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
