import React, { useState } from 'react';
import AdminLayout from '../../components/layout-admin/AdminLayout';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/admin/ConfirmModal';

const MainFeedManager = () => {
    // 1. Initial State focused on Global Broadcasts
    const [posts, setPosts] = useState([
        {
            id: "#SYS-001",
            authorName: "System Administrator",
            authorAvatar: "https://ui-avatars.com/api/?name=Admin&background=f47b25&color=fff",
            handle: "@admin_central",
            content: "Welcome to the ConnectCG Global Feed. This space is reserved for system-wide announcements and social interactions.",
            status: "Live",
            type: "System Official",
            date: "1d ago"
        },
        {
            id: "#USR-8821",
            authorName: "Alex Rivera",
            authorAvatar: "https://i.pravatar.cc/150?u=alex",
            handle: "@arivera",
            content: "Does anyone know where to find the best coffee in the city? #coffee #recommendation",
            status: "Pending", // Admin needs to approve
            type: "User Social",
            date: "2h ago"
        }
    ]);

    const [isShowingForm, setIsShowingForm] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

    const postSchema = Yup.object().shape({
        content: Yup.string().required("Broadcast content is required").min(10, "Minimum 10 characters"),
        type: Yup.string().required()
    });

    const handleSubmit = (values, { resetForm }) => {
        const newPost = {
            id: `#SYS-${Math.floor(100 + Math.random() * 899)}`,
            authorName: "System Administrator",
            authorAvatar: "https://ui-avatars.com/api/?name=Admin&background=f47b25&color=fff",
            handle: "@admin_central",
            content: values.content,
            status: "Live", // Instant status for Admin
            type: values.type,
            date: "Just now"
        };
        setPosts([newPost, ...posts]);
        toast.success(`⚡ Instant Broadcast Live: ${values.type}`, { icon: '🚀' });
        setIsShowingForm(false);
        resetForm();
    };

    const handleDelete = (id) => {
        setConfirmConfig({
            isOpen: true,
            title: "Remove Feed Content?",
            message: "This will permanently remove this broadcast from the website. Global users will no longer be able to see it.",
            onConfirm: () => {
                setPosts(posts.filter(p => p.id !== id));
                toast.error("Content removed from global feed");
                setConfirmConfig({ ...confirmConfig, isOpen: false });
            }
        });
    };

    return (
        <AdminLayout title="Global Broadcast" activeTab="Content" brandName="Social Admin">
            <div className="p-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Main Feed Control</h2>
                        <p className="text-text-muted text-sm font-medium">Curating the public face of the website newsfeed</p>
                    </div>
                    <button onClick={() => setIsShowingForm(!isShowingForm)} className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95">
                        <span className="material-symbols-outlined">{isShowingForm ? 'close' : 'bolt'}</span>
                        {isShowingForm ? 'Cancel' : 'Instant Broadcast'}
                    </button>
                </div>

                {/* Broadcast Form */}
                {isShowingForm && (
                    <div className="bg-surface-dark/40 p-8 rounded-3xl border border-primary/20 animate-in fade-in slide-in-from-top-4 duration-300">
                        <Formik initialValues={{ content: '', type: 'Announcement' }} validationSchema={postSchema} onSubmit={handleSubmit}>
                            {() => (
                                <Form className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Feed Category</label>
                                        <Field as="select" name="type" className="w-full bg-background-dark/50 border border-border-dark/50 rounded-xl py-3 px-4 text-white focus:border-primary outline-none">
                                            <option value="Announcement">System Announcement</option>
                                            <option value="Update">Patch Update</option>
                                            <option value="Social">Public Social Post</option>
                                        </Field>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-1">Message Body</label>
                                        <Field name="content" placeholder="Transmit a message to all users..." className="w-full bg-background-dark/50 border border-border-dark/50 rounded-xl py-3 px-4 text-white focus:border-primary outline-none" />
                                    </div>
                                    <div className="md:col-span-3 pt-2">
                                        <button type="submit" className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined">send</span>
                                            Go Live on Newsfeed
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                )}

                {/* Content Table */}
                <div className="bg-surface-dark/20 rounded-2xl border border-border-dark/50 overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead className="bg-background-dark/60 border-b border-border-dark/50 text-[10px] uppercase font-black text-text-muted tracking-widest">
                            <tr>
                                <th className="px-6 py-5">Origin</th>
                                <th className="px-6 py-5">Content Type</th>
                                <th className="px-6 py-5">Message Snippet</th>
                                <th className="px-6 py-5">Live Status</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-dark/30 text-sm">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-surface-dark/40 transition-colors text-white/90 group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <img src={post.authorAvatar} className="size-8 rounded-lg border border-border-dark/50" alt="" />
                                            <span className="font-bold text-xs">{post.authorName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${post.type === 'System Official'
                                            ? 'text-orange-400 bg-orange-400/10 border-orange-400/20'
                                            : 'text-primary bg-primary/10 border-primary/20'
                                            }`}>
                                            {post.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 max-w-sm truncate text-text-muted italic">"{post.content}"</td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-full border ${post.status === 'Live'
                                            ? 'bg-green-500/20 text-green-400 border-green-500/40 shadow-[0_0_10px_rgba(74,222,128,0.1)]'
                                            : post.status === 'Pending'
                                                ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                                : 'bg-green-500/10 text-green-400 border-green-500/20'
                                            }`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right flex justify-end gap-2">
                                        {post.status === 'Pending' && (
                                            <button onClick={() => setSelectedPost(post)} className="p-2 hover:bg-green-500/10 text-green-500/70 hover:text-green-400 transition-all">
                                                <span className="material-symbols-outlined text-lg">fact_check</span>
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-background-dark text-text-muted hover:text-white transition-all">
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Global Review Modal */}
                {selectedPost && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-md">
                        <div className="bg-surface-dark w-full max-w-lg rounded-3xl border border-border-dark/50 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                            <div className="p-8 space-y-6">
                                <div className="text-center space-y-2">
                                    <span className="material-symbols-outlined text-5xl text-primary block">safety_check</span>
                                    <h4 className="text-xl font-black text-white">Review Global Content?</h4>
                                    <p className="text-text-muted text-xs font-bold uppercase tracking-widest">Main Feed Moderation</p>
                                </div>

                                {/* Author Identify Section */}
                                <div className="flex items-center gap-4 bg-background-dark/30 p-4 rounded-2xl border border-border-dark/30">
                                    <img src={selectedPost.authorAvatar} className="size-12 rounded-xl border border-primary/20 object-cover" alt="" />
                                    <div className="text-left">
                                        <p className="text-white font-black text-base leading-none mb-1">{selectedPost.authorName}</p>
                                        <p className="text-[10px] text-primary font-black uppercase tracking-tighter">{selectedPost.handle}</p>
                                    </div>
                                    <div className="ml-auto bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">
                                        <span className="text-[10px] text-primary font-black uppercase">{selectedPost.type}</span>
                                    </div>
                                </div>

                                <div className="bg-background-dark/50 p-6 rounded-2xl italic text-text-muted text-sm leading-relaxed border border-border-dark/30 shadow-inner">
                                    "{selectedPost.content}"
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <button onClick={() => setSelectedPost(null)} className="py-3.5 rounded-xl border border-border-dark/50 text-text-muted font-bold hover:bg-background-dark hover:text-white transition-all">Reject Submission</button>
                                    <button onClick={() => {
                                        setPosts(posts.map(p => p.id === selectedPost.id ? { ...p, status: 'Published' } : p));
                                        setSelectedPost(null);
                                        toast.success("Post promoted to global spotlight!");
                                    }} className="py-3.5 rounded-xl bg-primary text-white font-black shadow-lg shadow-primary/20 hover:brightness-110 transition-all">Approve Global</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Shared Confirmation Modal */}
                <ConfirmModal
                    isOpen={confirmConfig.isOpen}
                    title={confirmConfig.title}
                    message={confirmConfig.message}
                    type="danger"
                    onConfirm={confirmConfig.onConfirm}
                    onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
                    confirmText="Confirm Delete"
                />
            </div>
        </AdminLayout>
    );
};

export default MainFeedManager;
