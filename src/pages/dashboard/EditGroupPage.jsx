import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import Sidebar from '../../components/layout/Sidebar';
import { uploadGroupCover } from '../../utils/uploadImage';
import { findById, updateGroup, deleteGroup } from '../../services/groups/GroupService';

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
        <div className="bg-[#0f0a06] text-white font-display min-h-screen flex w-full overflow-hidden">
            <Sidebar />

            <main className="flex-1 h-screen overflow-y-auto relative custom-scrollbar">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto px-8 py-12 relative z-10">
                    <header className="mb-12">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-text-muted hover:text-primary transition-all mb-6 group"
                        >
                            <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">keyboard_backspace</span>
                            <span className="text-xs font-black uppercase tracking-widest">Hủy & Quay lại</span>
                        </button>

                        <div className="flex items-center gap-6">
                            <div className="size-20 rounded-3xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-2xl shadow-primary/20 transform -rotate-3 text-[#0f0a06]">
                                <span className="material-symbols-outlined text-4xl">settings</span>
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tight mb-1">
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
                        {({ errors, touched, isSubmitting, setFieldValue }) => (
                            <Form className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                <div className="lg:col-span-7 space-y-6">
                                    <div className="bg-[#1a120b] border border-[#2d1f14] rounded-[2.5rem] p-10 shadow-2xl space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
                                                <span className="material-symbols-outlined text-sm">edit_note</span> Tên nhóm
                                            </label>
                                            <Field
                                                name="group_name"
                                                className={`w-full bg-[#120a05] border ${errors.group_name && touched.group_name ? 'border-red-500/50' : 'border-[#2d1f14]'} rounded-2xl py-5 px-6 text-white text-base focus:outline-none focus:border-primary/50 transition-all shadow-inner`}
                                            />
                                            {errors.group_name && touched.group_name && (
                                                <p className="text-red-400 text-[10px] font-bold ml-2">{errors.group_name}</p>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">lock_person</span> Quyền riêng tư
                                            </label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <label className="relative cursor-pointer">
                                                    <Field type="radio" name="privacy" value="PUBLIC" className="sr-only peer" />
                                                    <div className="p-5 rounded-2xl bg-[#120a05] border border-[#2d1f14] transition-all peer-checked:border-primary peer-checked:bg-primary/5 text-center">
                                                        <span className="text-xs font-black uppercase tracking-widest text-text-secondary peer-checked:text-white">Công khai</span>
                                                    </div>
                                                </label>
                                                <label className="relative cursor-pointer">
                                                    <Field type="radio" name="privacy" value="PRIVATE" className="sr-only peer" />
                                                    <div className="p-5 rounded-2xl bg-[#120a05] border border-[#2d1f14] transition-all peer-checked:border-primary peer-checked:bg-primary/5 text-center">
                                                        <span className="text-xs font-black uppercase tracking-widest text-text-secondary peer-checked:text-white">Riêng tư</span>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
                                                <span className="material-symbols-outlined text-sm">description</span> Mô tả
                                            </label>
                                            <Field
                                                as="textarea"
                                                name="description"
                                                className="w-full bg-[#120a05] border border-[#2d1f14] focus:border-primary/50 rounded-2xl py-5 px-6 text-white text-sm h-32 focus:outline-none transition-all shadow-inner resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-5 space-y-6">
                                    <div className="bg-[#1a120b] border border-[#2d1f14] rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center">
                                        <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] self-start mb-6 ml-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">wallpaper</span> Ảnh bìa
                                        </label>

                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="relative w-full aspect-[4/3] rounded-3xl border-2 border-dashed border-[#2d1f14] hover:border-primary/50 transition-all cursor-pointer overflow-hidden group flex items-center justify-center bg-[#120a05]"
                                        >
                                            {previewUrl && (
                                                <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center backdrop-blur-sm">
                                                <span className="material-symbols-outlined text-white text-3xl mb-2">add_a_photo</span>
                                                <span className="text-[10px] font-black uppercase text-white tracking-widest">Thay đổi ảnh</span>
                                            </div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, setFieldValue)}
                                            />
                                        </div>

                                        <div className="w-full mt-10">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full py-5 bg-gradient-to-r from-primary to-orange-600 text-[#0f0a06] font-black rounded-2xl shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 disabled:opacity-50"
                                            >
                                                {isSubmitting ? 'Đang lưu...' : 'Lưu Thay đổi'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Danger Zone */}
                                    <div className="bg-[#1a120b] border border-red-500/20 rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center">
                                        <div className="flex items-center gap-2 mb-4 text-red-500">
                                            <span className="material-symbols-outlined">warning</span>
                                            <h3 className="text-sm font-black uppercase tracking-widest">Khu vực nguy hiểm</h3>
                                        </div>
                                        <p className="text-text-secondary text-xs text-center mb-6">
                                            Hành động này không thể hoàn tác. Nhóm sẽ bị xóa vĩnh viễn và tất cả dữ liệu sẽ bị mất.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                if (window.confirm("CẢNH BÁO: Bạn có chắc chắn muốn xóa nhóm này vĩnh viễn không? Hành động này không thể hoàn tác.")) {
                                                    try {
                                                        await deleteGroup(id);
                                                        toast.success("Đã xóa nhóm thành công");
                                                        navigate('/dashboard/groups');
                                                    } catch (error) {
                                                        console.error("Failed to delete group:", error);
                                                        toast.error(error.response?.data || "Không thể xóa nhóm");
                                                    }
                                                }
                                            }}
                                            className="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-black rounded-2xl border border-red-500/20 transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-lg">delete_forever</span>
                                            Xóa Nhóm
                                        </button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </main>
        </div>
    );
}
