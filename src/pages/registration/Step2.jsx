import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Step2() {
    const [maritalStatus, setMaritalStatus] = useState('');
    const [purpose, setPurpose] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Profile completed:', { maritalStatus, purpose });
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
                        Find meaningful connections tailored to you.
                    </h2>
                    <p className="text-text-secondary text-lg leading-relaxed max-w-md">
                        Join a community of millions of people who have found their perfect match. Start your journey today.
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
                        {/* Progress Bar */}
                        <div className="flex flex-col gap-3 mb-10">
                            <div className="flex gap-6 justify-between items-end">
                                <p className="text-white text-base font-medium leading-normal">Step 2 of 2</p>
                                <span className="text-text-secondary text-sm font-medium">Profile &amp; Survey</span>
                            </div>
                            <div className="rounded-full bg-border-dark h-2 overflow-hidden">
                                <div className="h-full rounded-full bg-primary w-full transition-all duration-500" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold leading-tight tracking-tight mb-2 text-white">
                            Let's verify your vibe
                        </h1>
                        <p className="text-text-secondary text-base mb-8">
                            Add a photo and answer a few quick questions.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                            {/* Photo Upload */}
                            <div className="flex flex-col items-center justify-center gap-4">
                                <div className="relative group cursor-pointer">
                                    <label className="block">
                                        <input type="file" accept="image/*" className="hidden" />
                                        <div className="w-32 h-32 rounded-full bg-surface-dark border-2 border-dashed border-border-dark flex flex-col items-center justify-center transition-all duration-200 group-hover:border-primary group-hover:bg-surface-dark/80 group-hover:shadow-[0_0_20px_rgba(244,123,37,0.15)]">
                                            <span className="material-symbols-outlined text-4xl text-text-secondary group-hover:text-primary transition-colors">photo_camera</span>
                                        </div>
                                        <div className="absolute bottom-1 right-1 bg-primary rounded-full p-2 text-white shadow-lg border-2 border-background-dark group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-sm leading-none">edit</span>
                                        </div>
                                    </label>
                                </div>
                                <button type="button" className="flex items-center gap-2 text-primary hover:text-white text-sm font-bold transition-colors">
                                    <span className="material-symbols-outlined text-lg">videocam</span>
                                    Upload from Webcam
                                </button>
                            </div>

                            {/* Marital Status */}
                            <div className="flex flex-col gap-3">
                                <span className="text-white text-base font-medium">Marital Status</span>
                                <div className="grid grid-cols-3 gap-3">
                                    {['single', 'divorced', 'widowed'].map((status) => (
                                        <label key={status} className="cursor-pointer relative">
                                            <input
                                                type="radio"
                                                name="marital_status"
                                                value={status}
                                                checked={maritalStatus === status}
                                                onChange={(e) => setMaritalStatus(e.target.value)}
                                                className="peer sr-only"
                                            />
                                            <div className="rounded-xl border border-border-dark bg-surface-dark p-3 flex flex-col items-center justify-center h-20 transition-all duration-200 hover:bg-border-dark peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary peer-checked:bg-primary/10">
                                                <span className="text-sm font-medium text-text-secondary peer-checked:text-white transition-colors capitalize">
                                                    {status}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Purpose */}
                            <div className="flex flex-col gap-3">
                                <span className="text-white text-base font-medium">Why are you joining?</span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {[
                                        { value: 'love', icon: 'favorite', label: 'Find Love' },
                                        { value: 'friends', icon: 'diversity_3', label: 'Make Friends' },
                                        { value: 'networking', icon: 'work', label: 'Networking' }
                                    ].map((option) => (
                                        <label key={option.value} className="cursor-pointer relative">
                                            <input
                                                type="radio"
                                                name="purpose"
                                                value={option.value}
                                                checked={purpose === option.value}
                                                onChange={(e) => setPurpose(e.target.value)}
                                                className="peer sr-only"
                                            />
                                            <div className="rounded-xl border border-border-dark bg-surface-dark p-4 flex flex-col items-center justify-center gap-3 text-center h-28 transition-all duration-200 hover:bg-border-dark peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary peer-checked:bg-primary/10">
                                                <span className="material-symbols-outlined text-2xl text-text-secondary peer-checked:text-primary transition-colors">
                                                    {option.icon}
                                                </span>
                                                <span className="text-sm font-medium text-white">{option.label}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="mt-4 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 bg-primary hover:bg-orange-600 text-white text-lg font-bold leading-normal tracking-wide transition-colors shadow-lg shadow-orange-900/20"
                            >
                                Complete Profile
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <Link
                                to="/registration/step-1"
                                className="text-sm text-text-secondary hover:text-white transition-colors flex items-center justify-center gap-1"
                            >
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Back to Step 1
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
