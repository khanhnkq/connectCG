import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { updateProfileInfo } from '../../redux/slices/userSlice';
import { toast } from 'react-toastify';
import CitySelect from '../common/CitySelect';

export default function EditProfileModal({ isOpen, onClose, profile }) {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    // Validation Schema
    const validationSchema = Yup.object({
        fullName: Yup.string().required('Họ tên không được để trống'),
        bio: Yup.string().max(250, 'Tiểu sử tối đa 250 ký tự'),
        occupation: Yup.string().max(100, 'Nghề nghiệp tối đa 100 ký tự'),
        maritalStatus: Yup.string().oneOf(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'DATING', 'COMPLICATED'], 'Tình trạng không hợp lệ'),
        lookingFor: Yup.string(),
        gender: Yup.string().oneOf(['MALE', 'FEMALE', 'OTHER'], 'Giới tính không hợp lệ'),
        dateOfBirth: Yup.date().max(new Date(), 'Ngày sinh không hợp lệ'),
        city: Yup.mixed().nullable() // Cho phép null
    });

    const formik = useFormik({
        initialValues: {
            fullName: profile?.fullName || '',
            bio: profile?.bio || '',
            occupation: profile?.occupation || '',
            maritalStatus: profile?.maritalStatus || 'SINGLE',
            lookingFor: profile?.lookingFor || 'FRIENDSHIP',
            gender: profile?.gender || 'MALE',
            dateOfBirth: profile?.dateOfBirth || '',
            city: (profile?.cityCode) ? { code: profile.cityCode, name: profile.cityName } : null
        },
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                // Convert date empty string to null if needed
                const payload = {
                    ...values,
                    dateOfBirth: values.dateOfBirth || null,
                    cityCode: values.city?.code,
                    cityName: values.city?.name
                };

                await dispatch(updateProfileInfo(payload)).unwrap();
                toast.success("Cập nhật hồ sơ thành công!");
                onClose();
            } catch (error) {
                toast.error(typeof error === 'string' ? error : "Có lỗi xảy ra");
            } finally {
                setIsLoading(false);
            }
        },
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#221710] border border-[#3e2b1d] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#3e2b1d] sticky top-0 bg-[#221710] z-10">
                    <h2 className="text-xl font-bold text-white">Chỉnh sửa hồ sơ</h2>
                    <button
                        onClick={onClose}
                        className="text-text-secondary hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">

                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-text-secondary text-sm font-bold">Họ và tên</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Nhập họ tên của bạn"
                            value={formik.values.fullName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full bg-[#342418] border ${formik.touched.fullName && formik.errors.fullName ? 'border-red-500' : 'border-[#493222]'} rounded-xl px-4 py-3 text-white placeholder-text-secondary/50 focus:outline-none focus:border-primary transition-colors`}
                        />
                        {formik.touched.fullName && formik.errors.fullName && (
                            <p className="text-red-500 text-xs">{formik.errors.fullName}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Gender */}
                        <div className="space-y-2">
                            <label className="text-text-secondary text-sm font-bold">Giới tính</label>
                            <select
                                name="gender"
                                value={formik.values.gender}
                                onChange={formik.handleChange}
                                className="w-full bg-[#342418] border border-[#493222] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
                            >
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                                <option value="OTHER">Khác</option>
                            </select>
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-2">
                            <label className="text-text-secondary text-sm font-bold">Ngày sinh</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formik.values.dateOfBirth}
                                onChange={formik.handleChange}
                                className="w-full bg-[#342418] border border-[#493222] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                            />
                            {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                                <p className="text-red-500 text-xs">{formik.errors.dateOfBirth}</p>
                            )}
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <label className="text-text-secondary text-sm font-bold">Tiểu sử</label>
                        <textarea
                            name="bio"
                            rows="4"
                            placeholder="Giới thiệu đôi chút về bản thân..."
                            value={formik.values.bio}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`w-full bg-[#342418] border ${formik.touched.bio && formik.errors.bio ? 'border-red-500' : 'border-[#493222]'} rounded-xl px-4 py-3 text-white placeholder-text-secondary/50 focus:outline-none focus:border-primary transition-colors resize-none`}
                        ></textarea>
                        <div className="flex justify-end text-xs text-text-secondary">
                            {formik.values.bio.length}/250
                        </div>
                        {formik.touched.bio && formik.errors.bio && (
                            <p className="text-red-500 text-xs">{formik.errors.bio}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Occupation */}
                        <div className="space-y-2">
                            <label className="text-text-secondary text-sm font-bold">Nghề nghiệp</label>
                            <input
                                type="text"
                                name="occupation"
                                placeholder="Công việc hiện tại"
                                value={formik.values.occupation}
                                onChange={formik.handleChange}
                                className="w-full bg-[#342418] border border-[#493222] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                            />
                        </div>

                        {/* Marital Status */}
                        <div className="space-y-2">
                            <label className="text-text-secondary text-sm font-bold">Tình trạng</label>
                            <select
                                name="maritalStatus"
                                value={formik.values.maritalStatus}
                                onChange={formik.handleChange}
                                className="w-full bg-[#342418] border border-[#493222] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
                            >
                                <option value="SINGLE">Độc thân</option>
                                <option value="DATING">Đang hẹn hò</option>
                                <option value="MARRIED">Đã kết hôn</option>
                                <option value="COMPLICATED">Phức tạp</option>
                                <option value="DIVORCED">Đã ly hôn</option>
                                <option value="WIDOWED">Góa</option>
                            </select>
                        </div>
                    </div>

                    {/* Looking For */}
                    <div className="space-y-2">
                        <label className="text-text-secondary text-sm font-bold">Tìm kiếm</label>
                        <select
                            name="lookingFor"
                            value={formik.values.lookingFor}
                            onChange={formik.handleChange}
                            className="w-full bg-[#342418] border border-[#493222] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
                        >
                            <option value="FRIENDSHIP">Kết bạn</option>
                            <option value="DATING">Hẹn hò</option>
                            <option value="CHAT">Trò chuyện</option>
                            <option value="NETWORKING">Networking</option>
                        </select>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-[#3e2b1d]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl font-bold text-text-secondary hover:text-white hover:bg-[#342418] transition-all"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !formik.isValid}
                            className="bg-primary hover:bg-orange-600 text-[#231810] px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
                        >
                            {isLoading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
