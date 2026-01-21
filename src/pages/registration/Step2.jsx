import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { uploadAvatar } from '../../utils/uploadImage';
import toast from 'react-hot-toast';

// Validation schema
const Step2Schema = Yup.object().shape({
    occupation: Yup.string()
        .min(2, 'Nghề nghiệp phải có ít nhất 2 ký tự')
        .max(50, 'Nghề nghiệp không được quá 50 ký tự')
        .required('Vui lòng nhập nghề nghiệp'),
    gender: Yup.string()
        .oneOf(['male', 'female', 'other'], 'Vui lòng chọn giới tính')
        .required('Vui lòng chọn giới tính'),
    maritalStatus: Yup.string()
        .oneOf(['single', 'divorced', 'widowed'], 'Vui lòng chọn tình trạng hôn nhân')
        .required('Vui lòng chọn tình trạng hôn nhân'),
    purpose: Yup.string()
        .oneOf(['love', 'friends', 'networking'], 'Vui lòng chọn mục đích tham gia')
        .required('Vui lòng chọn mục đích tham gia'),
    hobbies: Yup.array()
        .min(1, 'Vui lòng chọn ít nhất 1 sở thích')
        .required('Vui lòng chọn sở thích'),
    city: Yup.string()
        .required('Vui lòng chọn thành phố'),
});

export default function Step2() {
    const navigate = useNavigate();
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);

    const initialValues = {
        occupation: '',
        gender: '',
        maritalStatus: '',
        purpose: '',
        hobbies: [],
        city: '',
        avatar: null
    };

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        // Lấy dữ liệu từ Step 1
        const step1Data = JSON.parse(localStorage.getItem('registrationStep1') || '{}');

        let avatarUrl = null;

        // Upload avatar lên Cloudinary nếu có
        if (values.avatar) {
            try {
                console.log('Đang upload avatar lên Cloudinary...');
                avatarUrl = await uploadAvatar(values.avatar);
                console.log('Upload thành công:', avatarUrl);
            } catch (error) {
                setErrors({ avatar: error.message });
                setSubmitting(false);
                return;
            }
        }

        // Chuẩn bị dữ liệu để gửi lên backend
        const registrationData = {
            // Từ Step 1
            fullName: step1Data.fullName || '',
            username: step1Data.username || '',
            email: step1Data.email || '',
            password: step1Data.password || '',
            dateOfBirth: step1Data.dateOfBirth || '',
            // Từ Step 2
            occupation: values.occupation,
            gender: values.gender,
            maritalStatus: values.maritalStatus,
            purpose: values.purpose,
            hobbyIds: values.hobbies, // Array IDs
            cityId: values.city, // ID
            avatarUrl: avatarUrl, // URL từ Cloudinary
        };

        // Log dữ liệu để kiểm tra
        console.log('Registration Data:', registrationData);

        setSubmitting(false);

        // Xóa dữ liệu tạm
        localStorage.removeItem('registrationStep1');
        toast.success('Đăng ký thành công');
        // Chuyển đến trang đăng nhập hoặc dashboard
        navigate('/login');
    };

    const handleFileChange = (event, setFieldValue) => {
        const file = event.target.files[0];
        if (file) {
            setFieldValue('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const maritalStatusOptions = [
        { value: 'single', label: 'Độc thân' },
        { value: 'divorced', label: 'Ly hôn' },
        { value: 'widowed', label: 'Góa bụa' }
    ];

    const genderOptions = [
        { value: 'male', icon: 'male', label: 'Nam' },
        { value: 'female', icon: 'female', label: 'Nữ' },
        { value: 'other', icon: 'transgender', label: 'Khác' }
    ];

    const purposeOptions = [
        { value: 'love', icon: 'favorite', label: 'Tìm tình yêu' },
        { value: 'friends', icon: 'diversity_3', label: 'Kết bạn' },
        { value: 'networking', icon: 'work', label: 'Kết nối' }
    ];

    // MOCK DATA: Giả lập dữ liệu từ Backend (có ID)
    const hobbiesOptions = [
        { id: 1, value: 'music', icon: 'music_note', label: 'Âm nhạc' },
        { id: 2, value: 'sports', icon: 'sports_soccer', label: 'Thể thao' },
        { id: 3, value: 'reading', icon: 'menu_book', label: 'Đọc sách' },
        { id: 4, value: 'travel', icon: 'flight', label: 'Du lịch' },
        { id: 5, value: 'cooking', icon: 'restaurant', label: 'Nấu ăn' },
        { id: 6, value: 'gaming', icon: 'sports_esports', label: 'Chơi game' },
        { id: 7, value: 'movies', icon: 'movie', label: 'Phim ảnh' },
        { id: 8, value: 'photography', icon: 'photo_camera', label: 'Nhiếp ảnh' },
        { id: 9, value: 'art', icon: 'palette', label: 'Nghệ thuật' },
        { id: 10, value: 'fitness', icon: 'fitness_center', label: 'Gym' },
        { id: 11, value: 'pets', icon: 'pets', label: 'Thú cưng' },
        { id: 12, value: 'technology', icon: 'computer', label: 'Công nghệ' },
    ];

    const cityOptions = [
        { id: 1, value: 'hanoi', label: 'Hà Nội' },
        { id: 2, value: 'hochiminh', label: 'TP. Hồ Chí Minh' },
        { id: 3, value: 'danang', label: 'Đà Nẵng' },
        { id: 4, value: 'haiphong', label: 'Hải Phòng' },
        { id: 5, value: 'cantho', label: 'Cần Thơ' },
        { id: 6, value: 'bienhoa', label: 'Biên Hòa' },
        { id: 7, value: 'nhatrang', label: 'Nha Trang' },
        { id: 8, value: 'hue', label: 'Huế' },
        { id: 9, value: 'vungtau', label: 'Vũng Tàu' },
        { id: 10, value: 'dalat', label: 'Đà Lạt' },
        { id: 11, value: 'quynhon', label: 'Quy Nhơn' },
        { id: 12, value: 'buonmethuot', label: 'Buôn Ma Thuột' },
        { id: 13, value: 'thanhhoa', label: 'Thanh Hóa' },
        { id: 14, value: 'ninhbinh', label: 'Ninh Bình' },
        { id: 15, value: 'halong', label: 'Hạ Long' },
        { id: 16, value: 'vinh', label: 'Vinh' },
        { id: 17, value: 'rachgia', label: 'Rạch Giá' },
        { id: 18, value: 'longan', label: 'Long An' },
        { id: 99, value: 'other', label: 'Khác' },
    ];

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
                        {/* Progress Bar */}
                        <div className="flex flex-col gap-3 mb-10">
                            <div className="flex gap-6 justify-between items-end">
                                <p className="text-white text-base font-medium leading-normal">Bước 2 / 2</p>
                                <span className="text-text-secondary text-sm font-medium">Hồ sơ & Khảo sát</span>
                            </div>
                            <div className="rounded-full bg-border-dark h-2 overflow-hidden">
                                <div className="h-full rounded-full bg-primary w-full transition-all duration-500" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold leading-tight tracking-tight mb-2 text-white">
                            Hãy xác nhận phong cách của bạn
                        </h1>
                        <p className="text-text-secondary text-base mb-8">
                            Thêm một tấm ảnh và trả lời vài câu hỏi nhanh.
                        </p>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={Step2Schema}
                            onSubmit={handleSubmit}
                        >
                            {({ errors, touched, values, setFieldValue, isSubmitting }) => (
                                <Form className="flex flex-col gap-8">
                                    {/* Photo Upload */}
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <div className="relative group cursor-pointer">
                                            <label className="block">
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => handleFileChange(e, setFieldValue)}
                                                />
                                                <div className="w-32 h-32 rounded-full bg-surface-dark border-2 border-dashed border-border-dark flex flex-col items-center justify-center transition-all duration-200 group-hover:border-primary group-hover:bg-surface-dark/80 group-hover:shadow-[0_0_20px_rgba(244,123,37,0.15)] overflow-hidden">
                                                    {avatarPreview ? (
                                                        <img
                                                            src={avatarPreview}
                                                            alt="Avatar preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-4xl text-text-secondary group-hover:text-primary transition-colors">photo_camera</span>
                                                    )}
                                                </div>
                                                <div className="absolute bottom-1 right-1 bg-primary rounded-full p-2 text-white shadow-lg border-2 border-background-dark group-hover:scale-110 transition-transform">
                                                    <span className="material-symbols-outlined text-sm leading-none">edit</span>
                                                </div>
                                            </label>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center gap-2 text-primary hover:text-white text-sm font-bold transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">videocam</span>
                                            Chụp từ Webcam
                                        </button>
                                    </div>

                                    {/* Occupation */}
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="occupation" className="text-white text-base font-medium">Nghề nghiệp</label>
                                        <input
                                            type="text"
                                            id="occupation"
                                            name="occupation"
                                            value={values.occupation}
                                            onChange={(e) => setFieldValue('occupation', e.target.value)}
                                            className={`form-input w-full rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border ${errors.occupation && touched.occupation ? 'border-red-500' : 'border-border-dark'} bg-surface-dark h-14 px-4 placeholder:text-text-secondary/60 text-base transition-all duration-200`}
                                            placeholder="VD: Nhà thiết kế, Giáo viên, Lập trình viên"
                                        />
                                        {errors.occupation && touched.occupation && (
                                            <span className="text-red-500 text-sm">{errors.occupation}</span>
                                        )}
                                    </div>

                                    {/* Gender */}
                                    <div className="flex flex-col gap-3">
                                        <span className="text-white text-base font-medium">Giới tính</span>
                                        <div className="grid grid-cols-3 gap-3">
                                            {genderOptions.map((option) => (
                                                <label key={option.value} className="cursor-pointer relative">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value={option.value}
                                                        checked={values.gender === option.value}
                                                        onChange={() => setFieldValue('gender', option.value)}
                                                        className="peer sr-only"
                                                    />
                                                    <div className={`rounded-xl border ${errors.gender && touched.gender ? 'border-red-500' : 'border-border-dark'} bg-surface-dark p-3 flex flex-col items-center justify-center gap-2 h-20 transition-all duration-200 hover:bg-border-dark peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary peer-checked:bg-primary/10`}>
                                                        <span className="material-symbols-outlined text-xl text-text-secondary peer-checked:text-primary transition-colors">
                                                            {option.icon}
                                                        </span>
                                                        <span className="text-sm font-medium text-text-secondary peer-checked:text-white transition-colors">
                                                            {option.label}
                                                        </span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.gender && touched.gender && (
                                            <span className="text-red-500 text-sm">{errors.gender}</span>
                                        )}
                                    </div>

                                    {/* Marital Status */}
                                    <div className="flex flex-col gap-3">
                                        <span className="text-white text-base font-medium">Tình trạng hôn nhân</span>
                                        <div className="grid grid-cols-3 gap-3">
                                            {maritalStatusOptions.map((status) => (
                                                <label key={status.value} className="cursor-pointer relative">
                                                    <input
                                                        type="radio"
                                                        name="maritalStatus"
                                                        value={status.value}
                                                        checked={values.maritalStatus === status.value}
                                                        onChange={() => setFieldValue('maritalStatus', status.value)}
                                                        className="peer sr-only"
                                                    />
                                                    <div className={`rounded-xl border ${errors.maritalStatus && touched.maritalStatus ? 'border-red-500' : 'border-border-dark'} bg-surface-dark p-3 flex flex-col items-center justify-center h-20 transition-all duration-200 hover:bg-border-dark peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary peer-checked:bg-primary/10`}>
                                                        <span className="text-sm font-medium text-text-secondary peer-checked:text-white transition-colors">
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.maritalStatus && touched.maritalStatus && (
                                            <span className="text-red-500 text-sm">{errors.maritalStatus}</span>
                                        )}
                                    </div>

                                    {/* Purpose */}
                                    <div className="flex flex-col gap-3">
                                        <span className="text-white text-base font-medium">Tại sao bạn tham gia?</span>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {purposeOptions.map((option) => (
                                                <label key={option.value} className="cursor-pointer relative">
                                                    <input
                                                        type="radio"
                                                        name="purpose"
                                                        value={option.value}
                                                        checked={values.purpose === option.value}
                                                        onChange={() => setFieldValue('purpose', option.value)}
                                                        className="peer sr-only"
                                                    />
                                                    <div className={`rounded-xl border ${errors.purpose && touched.purpose ? 'border-red-500' : 'border-border-dark'} bg-surface-dark p-4 flex flex-col items-center justify-center gap-3 text-center h-28 transition-all duration-200 hover:bg-border-dark peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary peer-checked:bg-primary/10`}>
                                                        <span className="material-symbols-outlined text-2xl text-text-secondary peer-checked:text-primary transition-colors">
                                                            {option.icon}
                                                        </span>
                                                        <span className="text-sm font-medium text-white">{option.label}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.purpose && touched.purpose && (
                                            <span className="text-red-500 text-sm">{errors.purpose}</span>
                                        )}
                                    </div>

                                    {/* Hobbies */}
                                    <div className="flex flex-col gap-3">
                                        <span className="text-white text-base font-medium">Sở thích của bạn</span>
                                        <p className="text-text-secondary text-sm -mt-1">Chọn ít nhất 1 sở thích</p>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                            {hobbiesOptions.map((hobby) => {
                                                const isSelected = values.hobbies.includes(hobby.id);
                                                return (
                                                    <label key={hobby.id} className="cursor-pointer relative">
                                                        <input
                                                            type="checkbox"
                                                            value={hobby.id}
                                                            checked={isSelected}
                                                            onChange={() => {
                                                                if (isSelected) {
                                                                    setFieldValue('hobbies', values.hobbies.filter(h => h !== hobby.id));
                                                                } else {
                                                                    setFieldValue('hobbies', [...values.hobbies, hobby.id]);
                                                                }
                                                            }}
                                                            className="peer sr-only"
                                                        />
                                                        <div className={`rounded-xl border ${errors.hobbies && touched.hobbies ? 'border-red-500' : 'border-border-dark'} bg-surface-dark p-3 flex flex-col items-center justify-center gap-2 text-center h-20 transition-all duration-200 hover:bg-border-dark ${isSelected ? 'border-primary ring-1 ring-primary bg-primary/10' : ''}`}>
                                                            <span className={`material-symbols-outlined text-xl ${isSelected ? 'text-primary' : 'text-text-secondary'} transition-colors`}>
                                                                {hobby.icon}
                                                            </span>
                                                            <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-text-secondary'}`}>{hobby.label}</span>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        {errors.hobbies && touched.hobbies && (
                                            <span className="text-red-500 text-sm">{errors.hobbies}</span>
                                        )}
                                    </div>

                                    {/* City */}
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="city" className="text-white text-base font-medium">Thành phố</label>
                                        <div className="relative">
                                            <select
                                                id="city"
                                                name="city"
                                                value={values.city}
                                                onChange={(e) => setFieldValue('city', e.target.value)}
                                                className={`form-select w-full rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border ${errors.city && touched.city ? 'border-red-500' : 'border-border-dark'} bg-surface-dark h-14 px-4 text-base transition-all duration-200 appearance-none cursor-pointer`}
                                            >
                                                <option value="" className="bg-surface-dark text-text-secondary">Chọn thành phố...</option>
                                                {cityOptions.map((city) => (
                                                    <option key={city.id} value={city.id} className="bg-surface-dark text-white">
                                                        {city.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
                                                expand_more
                                            </span>
                                        </div>
                                        {errors.city && touched.city && (
                                            <span className="text-red-500 text-sm">{errors.city}</span>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="mt-4 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 bg-primary hover:bg-orange-600 text-white text-lg font-bold leading-normal tracking-wide transition-colors shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Đang xử lý...' : 'Hoàn tất hồ sơ'}
                                    </button>
                                </Form>
                            )}
                        </Formik>

                        <div className="mt-8 text-center">
                            <Link
                                to="/registration/step-1"
                                className="text-sm text-text-secondary hover:text-white transition-colors flex items-center justify-center gap-1"
                            >
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Quay lại Bước 1
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
