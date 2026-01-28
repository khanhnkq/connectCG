import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout-admin/AdminLayout';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/admin/ConfirmModal';
import postService from '../../services/PostService';

const MainFeedManager = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isShowingForm, setIsShowingForm] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
    const [scanningId, setScanningId] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await postService.getHomepagePosts();
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching homepage posts:", error);
            toast.error("Failed to load homepage posts");
        } finally {
            setLoading(false);
        }
    };

    const handleAICheck = async (postId) => {
        try {
            setScanningId(postId);
            toast.loading("Gemini AI is analyzing content...", { id: "ai-scan" });
            const response = await postService.checkPostWithAI(postId);
            const result = response.data.result;

            toast.dismiss("ai-scan");
            if (result === 'TOXIC') {
                toast.error("⚠️ AI Flagged: Content contains toxic language!", { duration: 5000 });
            } else {
                toast.success("✅ AI Verified: Content looks safe.", { duration: 3000 });
            }

            // Update local state to show result if we added a field for it
            setPosts(posts.map(p => p.id === postId ? { ...p, aiStatus: result } : p));
        } catch (error) {
            toast.dismiss("ai-scan");
            toast.error("AI Scan failed. Please check Gemini API configuration.");
        } finally {
            setScanningId(null);
        }
    };

    const postSchema = Yup.object().shape({
        content: Yup.string().required("Broadcast content is required").min(10, "Minimum 10 characters"),
        type: Yup.string().required()
    });

    const handleSubmit = (values, { resetForm }) => {
        // Since we don't have CRUD implemented yet as per user request, 
        // we'll just show a toast for now or add to local state if needed.
        toast.success(`⚡ Feature under development: ${values.type}`);
        setIsShowingForm(false);
        resetForm();
    };

    const handleDelete = (id) => {
        setConfirmConfig({
            isOpen: true,
            title: "Remove Feed Content?",
            message: "This will permanently remove this broadcast from the website.",
            onConfirm: async () => {
                try {
                    await postService.deletePost(id);
                    setPosts(posts.filter(p => p.id !== id));
                    toast.success("Content removed successfully");
                } catch (error) {
                    toast.error("Failed to delete post");
                }
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
                                <th className="px-6 py-5">Author</th>
                                <th className="px-6 py-5">Visibility</th>
                                <th className="px-6 py-5">Message Snippet</th>
                                <th className="px-6 py-5">AI Status</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-dark/30 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-text-muted">Loading global feed...</td>
                                </tr>
                            ) : posts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-text-muted">No homepage posts found in database.</td>
                                </tr>
                            ) : (
                                posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-surface-dark/40 transition-colors text-white/90 group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden border border-border-dark/50">
                                                    {post.author?.avatar ? <img src={post.author.avatar} alt="" /> : (post.author?.fullName?.charAt(0) || 'U')}
                                                </div>
                                                <span className="font-bold text-xs">{post.author?.fullName || 'Anonymous'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded border text-primary bg-primary/10 border-primary/20">
                                                {post.visibility || 'PUBLIC'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 max-w-sm truncate text-text-muted italic">"{post.content}"</td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-full border ${post.aiStatus === 'SAFE'
                                                ? 'bg-green-500/20 text-green-400 border-green-500/40'
                                                : post.aiStatus === 'TOXIC'
                                                    ? 'bg-red-500/20 text-red-500 border-red-500/40'
                                                    : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                                }`}>
                                                {post.aiStatus || 'Not Scanned'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right flex justify-end gap-2">
                                            <button
                                                onClick={() => handleAICheck(post.id)}
                                                disabled={scanningId === post.id}
                                                className={`p-2 rounded-lg transition-all ${scanningId === post.id ? 'bg-primary/20 text-primary animate-pulse' : 'hover:bg-primary/10 text-primary/70 hover:text-primary'}`}
                                                title="Scan with Gemini AI"
                                            >
                                                <span className="material-symbols-outlined text-lg">psychology</span>
                                            </button>
                                            <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-all rounded-lg">
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
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
                                    <h4 className="text-xl font-black text-white">Review Content?</h4>
                                </div>
                                <div className="bg-background-dark/50 p-6 rounded-2xl italic text-text-muted text-sm leading-relaxed border border-border-dark/30 shadow-inner">
                                    "{selectedPost.content}"
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <button onClick={() => setSelectedPost(null)} className="py-3.5 rounded-xl border border-border-dark/50 text-text-muted font-bold hover:bg-background-dark hover:text-white transition-all">Close</button>
                                    <button onClick={() => setSelectedPost(null)} className="py-3.5 rounded-xl bg-primary text-white font-black shadow-lg shadow-primary/20 hover:brightness-110 transition-all">Mark as Safe</button>
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
