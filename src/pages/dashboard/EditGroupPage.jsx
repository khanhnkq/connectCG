import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import Sidebar from '../../components/layout/Sidebar';
import { uploadGroupCover } from '../../utils/uploadImage';
import { findById, updateGroup, deleteGroup } from '../../services/groups/GroupService';
import DeleteGroupModal from '../../components/groups/DeleteGroupModal';

const editGroupSchema = Yup.object().shape({
    group_name: Yup.string()
        .required('Tên nhóm không được để trống')
        .min(3, 'Tên nhóm phải có ít nhất 3 ký tự')
        .max(50, 'Tên nhóm quá dài'),
    privacy: Yup.string().oneOf(['PUBLIC', 'PRIVATE']).required('Vui lòng chọn quyền riêng tư'),
    description: Yup.string()
        .max(500, 'Mô tả quá dài'),
    cover_image: Yup.mixed()
});

export default function EditGroupPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);
    const [initialValues, setInitialValues] = useState({
        group_name: '',
        privacy: 'PUBLIC',
        description: '',
        cover_image: null
    });
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const data = await findById(id);
                setInitialValues({
                    group_name: data.name,
                    privacy: data.privacy.toUpperCase(),
                    description: data.description || '',
                    cover_image: data.image
                });
                setPreviewUrl(data.image);
            } catch (error) {
                console.error("Fetch group failed:", error);
                toast.error("Không thể lấy thông tin nhóm.");
                navigate('/dashboard/groups');
            } finally {
                setIsLoading(false);
            }
        };
        fetchGroup();
    }, [id, navigate]);

    const handleImageChange = (event, setFieldValue) => {
        const file = event.currentTarget.files[0];
        if (file) {
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                toast.error("Chỉ chấp nhận ảnh JPG hoặc PNG");
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
            let imageUrl = values.cover_image;
            if (values.cover_image && typeof values.cover_image !== 'string') {
                imageUrl = await uploadGroupCover(values.cover_image);
            }

            const updatedGroupData = {
                name: values.group_name,
                privacy: values.privacy,
                description: values.description,
                image: (typeof imageUrl === 'string') ? imageUrl : ''
            };

            await updateGroup(id, updatedGroupData);
            toast.success(`Cập nhật nhóm thành công!`);
            navigate('/dashboard/groups');
        } catch (error) {
            toast.error(`Lỗi cập nhật: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-[#0f0a06] min-h-screen flex items-center justify-center">
                <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-white font-display overflow-hidden h-screen flex w-full">
            <Sidebar />

            <main className="flex-1 h-full overflow-y-auto relative scroll-smooth bg-background-dark">
                {/* Visual Background Decorations - Dark Theme */}
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
                <div className="absolute bottom-[5%] left-[-5%] w-[400px] h-[400px] bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto px-8 py-12 relative z-10">
                    {/* Header */}
                    <header className="mb-12">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-text-muted hover:text-primary transition-all mb-6 group"
                        >
                            <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">keyboard_backspace</span>
                            <span className="text-xs font-black uppercase tracking-widest text-white/50 group-hover:text-primary">Hủy & Quay lại</span>
                        </button>

                        <div className="flex items-center gap-6">
                            <div className="size-20 rounded-3xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-2xl shadow-primary/20 transform -rotate-3 text-[#0f0a06]">
                                <span className="material-symbols-outlined text-4xl">settings</span>
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tight mb-1 text-white">
                                    Chỉnh sửa <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Cộng đồng</span>
                                </h1>
                                <p className="text-text-secondary text-sm font-medium">Thay đổi thông tin nhóm để phù hợp hơn với định hướng mới.</p>
                            </div>
                        </div>
                    </header>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={editGroupSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize={true}
                    >
                        {({ errors, touched, isSubmitting, setFieldValue, values }) => (
                            <Form className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Form Controls - Left Section */}
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="bg-[#1a120b] border border-[#2d1f14] rounded-[2.5rem] p-10 shadow-2xl space-y-8">

                                        {/* Group Name */}
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
                                                    <Field type="radio" name="privacy" value="PUBLIC" className="sr-only peer" />
                                                    <div className="p-5 rounded-2xl bg-[#120a05] border border-[#2d1f14] transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:shadow-[0_0_20px_rgba(255,107,0,0.1)] hover:bg-[#1a120b]">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="size-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                                <span className="material-symbols-outlined text-lg">public</span>
                                                            </div>
                                                            <span className="text-xs font-black uppercase tracking-widest text-text-secondary peer-checked:text-white">Công khai</span>
                                                        </div>
                                                        <p className="text-[10px] text-text-muted leading-relaxed">Ai cũng có thể tìm thấy nhóm.</p>
                                                    </div>
                                                    <div className="absolute top-4 right-4 size-4 rounded-full border-2 border-[#2d1f14] peer-checked:border-primary peer-checked:after:content-[''] peer-checked:after:absolute peer-checked:after:inset-1 peer-checked:after:bg-primary peer-checked:after:rounded-full" />
                                                </label>
                                                <label className="relative cursor-pointer group">
                                                    <Field type="radio" name="privacy" value="PRIVATE" className="sr-only peer" />
                                                    <div className="p-5 rounded-2xl bg-[#120a05] border border-[#2d1f14] transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:shadow-[0_0_20px_rgba(255,107,0,0.1)] hover:bg-[#1a120b]">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="size-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                                <span className="material-symbols-outlined text-lg">shield_person</span>
                                                            </div>
                                                            <span className="text-xs font-black uppercase tracking-widest text-text-secondary peer-checked:text-white">Riêng tư</span>
                                                        </div>
                                                        <p className="text-[10px] text-text-muted leading-relaxed">Chỉ thành viên mới xem được.</p>
                                                    </div>
                                                    <div className="absolute top-4 right-4 size-4 rounded-full border-2 border-[#2d1f14] peer-checked:border-primary peer-checked:after:content-[''] peer-checked:after:absolute peer-checked:after:inset-1 peer-checked:after:bg-primary peer-checked:after:rounded-full" />
                                                </label>
                                            </div>
                                        </div>

                                        {/* Description */}
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
                                                className="w-full bg-[#120a05] border border-[#2d1f14] focus:border-primary/50 rounded-2xl py-5 px-6 text-white text-sm h-32 focus:outline-none transition-all shadow-inner resize-none placeholder:text-text-muted/20"
                                            />
                                            <div className="flex justify-end pr-2">
                                                <span className={`text-[9px] font-bold tracking-widest uppercase ${values.description ? (values.description.length > 450 ? 'text-orange-500' : 'text-text-muted') : 'text-text-muted'}`}>
                                                    {values.description?.length || 0} / 500
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section - Image & Actions */}
                                <div className="lg:col-span-5 space-y-6">
                                    <div className="bg-[#1a120b] border border-[#2d1f14] rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center">
                                        <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] self-start mb-6 ml-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">wallpaper</span> Ảnh bìa
                                        </label>

                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="relative w-full aspect-video rounded-3xl border-2 border-dashed border-[#2d1f14] hover:border-primary/50 transition-all cursor-pointer overflow-hidden group flex items-center justify-center bg-[#120a05]"
                                        >
                                            {previewUrl ? (
                                                <>
                                                    <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center backdrop-blur-sm">
                                                        <div className="size-14 rounded-full bg-white/10 flex items-center justify-center border border-white/20 mb-3 shadow-xl">
                                                            <span className="material-symbols-outlined text-white text-2xl">change_circle</span>
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase text-white tracking-widest">Thay đổi ảnh</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center text-center p-8">
                                                    <div className="size-20 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center text-primary/40 mb-6 group-hover:scale-110 transition-transform duration-500 ring-1 ring-primary/5 shadow-inner">
                                                        <span className="material-symbols-outlined text-5xl">wallpaper</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-text-secondary mb-2 uppercase tracking-wide">Tải ảnh bìa mới</p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, setFieldValue)}
                                            />
                                        </div>

                                        <div className="w-full mt-6 space-y-4">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full py-4 bg-gradient-to-r from-primary to-orange-600 text-[#0f0a06] font-black rounded-xl shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 disabled:opacity-50"
                                            >
                                                {isSubmitting ? 'Đang lưu...' : 'Lưu Thay đổi'}
                                            </button>

                                            <div className="pt-4 border-t border-[#2d1f14] space-y-2">
                                                <div className="flex items-center gap-2 justify-center text-red-500/80">
                                                    <span className="material-symbols-outlined text-xl">warning</span>
                                                    <span className="text-sm font-bold uppercase tracking-wide">Chú ý khu vực nguy hiểm</span>
                                                </div>
                                                <p className="text-sm text-text-muted text-center leading-relaxed px-2">
                                                    Khi xóa nhóm, toàn bộ dữ liệu bài viết và thành viên sẽ bị mất vĩnh viễn và không thể khôi phục.
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowDeleteModal(true)}
                                                    className="w-full py-3 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 font-bold rounded-xl transition-all uppercase tracking-widest text-[9px] flex items-center justify-center gap-2"
                                                >
                                                    <span className="material-symbols-outlined text-base">delete_forever</span>
                                                    Xóa Nhóm
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>

                    <DeleteGroupModal
                        isOpen={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        groupName={initialValues.group_name}
                        onConfirm={async () => {
                            try {
                                await deleteGroup(id);
                                toast.success("Đã xóa nhóm thành công");
                                navigate('/dashboard/groups');
                            } catch (error) {
                                console.error("Failed to delete group:", error);
                                toast.error(error.response?.data || "Không thể xóa nhóm");
                                setShowDeleteModal(false);
                            }
                        }}
                    />
                </div>
            </main>
        </div>
    );
}
