import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

import { uploadGroupCover } from '../../utils/uploadImage';
import { addGroup } from "../../services/groups/GroupService.js";

const createGroupSchema = Yup.object().shape({
    group_name: Yup.string()
        .required('Tên nhóm không được để trống')
        .min(3, 'Tên nhóm phải có ít nhất 3 ký tự')
        .max(50, 'Tên nhóm quá dài'),
    privacy: Yup.string().oneOf(['public', 'private']).required('Vui lòng chọn quyền riêng tư'),
    description: Yup.string()
        .max(500, 'Mô tả quá dài'),
    cover_image: Yup.mixed()
        .test('fileType', 'Chỉ nhận định dạng jpg/png', (value) => {
            if (!value) return true;
            if (typeof value === 'string') return true;
            return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
        })
});

export default function CreateGroupPage() {
    const navigate = useNavigate();
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const initialValues = {
        group_name: '',
        privacy: 'public',
        description: '',
        cover_image: null
    };

    const handleImageChange = (event, setFieldValue) => {
        const file = event.currentTarget.files[0];
        if (file) {
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                toast.error("Chỉ chấp nhận ảnh JPG hoặc PNG", { theme: "dark" });
                return;
            }
            setFieldValue("cover_image", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            let imageUrl = null;
            if (values.cover_image && typeof values.cover_image !== 'string') {
                imageUrl = await uploadGroupCover(values.cover_image);
            }

            const finalGroupData = {
                name: values.group_name,
                privacy: values.privacy.toUpperCase(),
                description: values.description,
                image: imageUrl || ""
            };
            await addGroup(finalGroupData);
            toast.success(`Nhóm "${values.group_name}" đã sẵn sàng!`);
            setTimeout(() => {
                setSubmitting(false);
                navigate('/dashboard/groups');
            }, 1500);

        } catch (error) {
            toast.error(`Lỗi: ${error.message}`);
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full h-full overflow-y-auto relative scroll-smooth bg-background-dark">
                {/* Visual Background Decorations */}
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
                <div className="absolute bottom-[5%] left-[-5%] w-[400px] h-[400px] bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto px-8 py-12 relative z-10">
                    {/* Compact & Stylish Header */}
                    <header className="mb-12">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-text-muted hover:text-primary transition-all mb-6 group"
                        >
                            <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">keyboard_backspace</span>
                            <span className="text-xs font-black uppercase tracking-widest text-white/50 group-hover:text-primary">Quay lại</span>
                        </button>

                        <div className="flex items-center gap-6">
                            <div className="size-20 rounded-3xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-2xl shadow-primary/20 transform -rotate-3">
                                <span className="material-symbols-outlined text-4xl text-[#0f0a06]">groups_3</span>
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tight mb-1 text-white">
                                    Thiết lập <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Cộng đồng</span>
                                </h1>
                                <p className="text-text-secondary text-sm font-medium">Khởi tạo không gian riêng của bạn chỉ trong vài giây.</p>
                            </div>
                        </div>
                    </header>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={createGroupSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, isSubmitting, setFieldValue, values }) => (
                            <Form className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                                {/* Form Controls - Left Section */}
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="bg-[#1a120b] border border-[#2d1f14] rounded-[2.5rem] p-10 shadow-2xl space-y-8">

                                        {/* Group Name Input */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center ml-2">
                                                <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm">edit_note</span> Tên nhóm
                                                </label>
                                                <span className="text-[9px] font-bold text-red-500/60 uppercase tracking-tighter">Bắt buộc</span>
                                            </div>
                                            <div className="relative group">
                                                <Field
                                                    name="group_name"
                                                    placeholder="Ví dụ: Hội yêu cây cảnh, Dev Hà Nội..."
                                                    className={`w-full bg-[#120a05] border ${errors.group_name && touched.group_name ? 'border-red-500/50' : 'border-[#2d1f14] group-focus-within:border-primary/50'} rounded-2xl py-5 px-6 text-white text-base focus:outline-none transition-all shadow-inner placeholder:text-text-muted/20`}
                                                />
                                                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/5 pointer-events-none group-focus-within:ring-primary/20 transition-all" />
                                            </div>
                                            {errors.group_name && touched.group_name && (
                                                <p className="text-red-400 text-[10px] font-bold ml-2 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[12px]">error</span> {errors.group_name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Privacy Selector */}
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">lock_person</span> Quyền riêng tư
                                            </label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <label className="relative cursor-pointer group">
                                                    <Field type="radio" name="privacy" value="public" className="sr-only peer" />
                                                    <div className="p-5 rounded-2xl bg-[#120a05] border border-[#2d1f14] transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:shadow-[0_0_20px_rgba(255,107,0,0.1)] hover:bg-[#1a120b]">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="size-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                                <span className="material-symbols-outlined text-lg">public</span>
                                                            </div>
                                                            <span className="text-xs font-black uppercase tracking-widest text-text-secondary peer-checked:text-white">Công khai</span>
                                                        </div>
                                                        <p className="text-[10px] text-text-muted leading-relaxed">Ai cũng có thể tìm thấy nhóm và xem bài viết.</p>
                                                    </div>
                                                    <div className="absolute top-4 right-4 size-4 rounded-full border-2 border-[#2d1f14] peer-checked:border-primary peer-checked:after:content-[''] peer-checked:after:absolute peer-checked:after:inset-1 peer-checked:after:bg-primary peer-checked:after:rounded-full" />
                                                </label>

                                                <label className="relative cursor-pointer group">
                                                    <Field type="radio" name="privacy" value="private" className="sr-only peer" />
                                                    <div className="p-5 rounded-2xl bg-[#120a05] border border-[#2d1f14] transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:shadow-[0_0_20px_rgba(255,107,0,0.1)] hover:bg-[#1a120b]">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="size-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                                <span className="material-symbols-outlined text-lg">shield_person</span>
                                                            </div>
                                                            <span className="text-xs font-black uppercase tracking-widest text-text-secondary peer-checked:text-white">Riêng tư</span>
                                                        </div>
                                                        <p className="text-[10px] text-text-muted leading-relaxed">Chỉ thành viên mới có thể xem nội dung bên trong.</p>
                                                    </div>
                                                    <div className="absolute top-4 right-4 size-4 rounded-full border-2 border-[#2d1f14] peer-checked:border-primary peer-checked:after:content-[''] peer-checked:after:absolute peer-checked:after:inset-1 peer-checked:after:bg-primary peer-checked:after:rounded-full" />
                                                </label>
                                            </div>
                                        </div>

                                        {/* Description TextArea */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center ml-2">
                                                <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm">description</span> Mô tả
                                                </label>
                                                <span className="text-[9px] font-bold text-text-muted uppercase tracking-tighter italic">Tùy chọn</span>
                                            </div>
                                            <Field
                                                as="textarea"
                                                name="description"
                                                placeholder="Viết vài dòng giới thiệu về nét đặc trưng của nhóm..."
                                                className="w-full bg-[#120a05] border border-[#2d1f14] focus:border-primary/50 rounded-2xl py-5 px-6 text-white text-sm h-32 focus:outline-none transition-all shadow-inner resize-none placeholder:text-text-muted/20"
                                            />
                                            <div className="flex justify-end pr-2">
                                                <span className={`text-[9px] font-bold tracking-widest uppercase ${values.description.length > 450 ? 'text-orange-500' : 'text-text-muted'}`}>
                                                    {values.description.length} / 500
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Media Upload - Right Section */}
                                <div className="lg:col-span-5 space-y-6">
                                    <div className="bg-[#1a120b] border border-[#2d1f14] rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center">
                                        <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] self-start mb-6 ml-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">center_focus_strong</span> Ảnh bìa
                                        </label>

                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="relative w-full aspect-[4/3] rounded-3xl border-2 border-dashed border-[#2d1f14] hover:border-primary/50 transition-all cursor-pointer overflow-hidden group flex items-center justify-center bg-[#120a05] shadow-2xl"
                                        >
                                            {previewUrl ? (
                                                <>
                                                    <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center backdrop-blur-[2px]">
                                                        <div className="size-14 rounded-full bg-white/10 flex items-center justify-center border border-white/20 mb-3 shadow-xl">
                                                            <span className="material-symbols-outlined text-white text-2xl">change_circle</span>
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Thay đổi ảnh</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center text-center p-8">
                                                    <div className="size-20 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center text-primary/40 mb-6 group-hover:scale-110 transition-transform duration-500 ring-1 ring-primary/5 shadow-inner">
                                                        <span className="material-symbols-outlined text-5xl">wallpaper</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-text-secondary mb-2 uppercase tracking-wide">Tải ảnh bìa chuyên nghiệp</p>
                                                    <p className="text-[10px] text-text-muted font-bold tracking-tighter italic">Kích thước khuyên dùng 1200x600px</p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/jpeg,image/png"
                                                onChange={(e) => handleImageChange(e, setFieldValue)}
                                            />
                                        </div>

                                        {/* Status & Action */}
                                        <div className="w-full mt-10 space-y-4">
                                            <div className="p-5 rounded-2xl bg-orange-500/5 border border-primary/10 flex items-start gap-3">
                                                <span className="material-symbols-outlined text-primary text-xl mt-0.5">verified_user</span>
                                                <p className="text-[10px] font-medium leading-[1.6] text-text-secondary">
                                                    Bạn sẽ trở thành <b>Quản trị viên</b> của nhóm này. Hãy đảm bảo nội dung tuân thủ chính sách của ConnectCG.
                                                </p>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className={`w-full py-5 bg-gradient-to-r from-primary to-orange-600 text-[#0f0a06] font-black rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="size-4 border-2 border-[#0f0a06]/20 border-t-[#0f0a06] rounded-full animate-spin" />
                                                        <span>Đang xử lý...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Xác nhận & Khởi tạo</span>
                                                        <span className="material-symbols-outlined text-lg">rocket_launch</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
        </div>
    );

}
