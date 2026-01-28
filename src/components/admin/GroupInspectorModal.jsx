import React, { useState, useEffect } from 'react';
import { findById as findGroupById, getGroupMembers, getGroupPosts } from "../../services/groups/GroupService";
import toast from 'react-hot-toast';

const GroupInspectorModal = ({ groupId, onClose, onAction, actionLabel = "Delete Group" }) => {
    const [inspectorData, setInspectorData] = useState({
        group: null,
        members: [],
        posts: [],
        loading: true,
        activeTab: 'overview'
    });

    useEffect(() => {
        if (!groupId) return;

        const fetchData = async () => {
            setInspectorData(prev => ({ ...prev, loading: true }));
            try {
                const [group, members, posts] = await Promise.all([
                    findGroupById(groupId).catch(e => { throw e }),
                    getGroupMembers(groupId).catch(e => []),
                    getGroupPosts(groupId).catch(e => [])
                ]);
                setInspectorData({ group, members, posts, loading: false, activeTab: 'overview' });
            } catch (error) {
                console.error("Inspector error:", error);
                toast.error("Failed to load group details");
                onClose();
            }
        };

        fetchData();
    }, [groupId]);

    if (!groupId) return null;

    return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-background-dark/95 backdrop-blur-md animate-in fade-in duration-300">
            {inspectorData.loading ? (
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <div className="text-white font-bold tracking-widest uppercase text-xs">Loading Group Info</div>
                </div>
            ) : (
                <div className="bg-surface-dark w-full max-w-5xl h-[85vh] rounded-[2.5rem] border border-border-dark/50 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                    {/* Modal Header */}
                    <div className="relative h-48 shrink-0">
                        <img
                            src={inspectorData.group?.image || `https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80`}
                            className="w-full h-full object-cover"
                            alt=""
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/50 to-transparent"></div>
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 size-10 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-all border border-white/10 z-10"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-3xl font-black text-white tracking-tight">{inspectorData.group?.name}</h2>
                                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border backdrop-blur-md ${inspectorData.group?.privacy === 'PUBLIC' ? 'bg-green-500/20 text-green-400 border-green-500/20' : 'bg-orange-500/20 text-orange-400 border-orange-500/20'}`}>
                                        {inspectorData.group?.privacy}
                                    </span>
                                </div>
                                <p className="text-white/80 text-sm max-w-2xl line-clamp-1">{inspectorData.group?.description || "No description provided."}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs & Content */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="px-8 border-b border-border-dark/50 flex gap-6 shrink-0">
                            {['overview', 'members', 'posts'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setInspectorData(prev => ({ ...prev, activeTab: tab }))}
                                    className={`py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${inspectorData.activeTab === tab
                                        ? 'text-primary border-primary'
                                        : 'text-text-muted border-transparent hover:text-white'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-background-dark/30">
                            {inspectorData.activeTab === 'overview' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-surface-dark p-6 rounded-3xl border border-border-dark/50 space-y-4">
                                        <h3 className="text-xl font-bold text-white">General Info</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between py-2 border-b border-border-dark/30">
                                                <span className="text-text-muted">Owner</span>
                                                <span className="text-white font-bold">{inspectorData.group?.ownerName}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-border-dark/30">
                                                <span className="text-text-muted">Created At</span>
                                                <span className="text-white font-bold">{inspectorData.group?.createdAt ? new Date(inspectorData.group.createdAt).toLocaleDateString() : 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-border-dark/30">
                                                <span className="text-text-muted">Member Count</span>
                                                <span className="text-white font-bold">{inspectorData.members.length}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-border-dark/30">
                                                <span className="text-text-muted">Post Count</span>
                                                <span className="text-white font-bold">{inspectorData.posts.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-surface-dark p-6 rounded-3xl border border-border-dark/50 space-y-4 flex flex-col items-center justify-center text-center">
                                        <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                                            <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Admin Actions</h3>
                                        <p className="text-text-muted text-sm">Perform administrative actions on this group.</p>
                                        <div className="flex gap-3 w-full mt-4">
                                            <button
                                                onClick={() => onAction && onAction(inspectorData.group)}
                                                className="flex-1 py-3 bg-red-500/10 text-red-500 font-bold rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                {actionLabel}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {inspectorData.activeTab === 'members' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {inspectorData.members.map(member => (
                                        <div key={member.userId} className="bg-surface-dark p-4 rounded-2xl border border-border-dark/50 flex items-center gap-3">
                                            <img src={member.avatarUrl} className="size-10 rounded-full bg-surface-dark border border-border-dark" alt="" />
                                            <div className="overflow-hidden">
                                                <p className="text-white font-bold truncate">{member.fullName}</p>
                                                <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${member.role === 'ADMIN' ? 'bg-orange-500/20 text-orange-400' : 'bg-background-dark text-text-muted'}`}>
                                                    {member.role}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {inspectorData.members.length === 0 && (
                                        <div className="col-span-full py-10 text-center text-text-muted">No members found.</div>
                                    )}
                                </div>
                            )}

                            {inspectorData.activeTab === 'posts' && (
                                <div className="space-y-4 max-w-3xl mx-auto">
                                    {inspectorData.posts.map(post => (
                                        <div key={post.id} className="bg-surface-dark p-6 rounded-3xl border border-border-dark/50 space-y-4">
                                            <div className="flex items-center gap-3 border-b border-border-dark/30 pb-4">
                                                <img src={post.authorAvatar} className="size-10 rounded-full" alt="" />
                                                <div>
                                                    <p className="text-white font-bold">{post.authorFullName}</p>
                                                    <p className="text-text-muted text-xs">{new Date(post.createdAt).toLocaleString()}</p>
                                                </div>
                                                <span className={`ml-auto px-2 py-1 rounded-lg text-[10px] font-black uppercase ${post.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                    {post.status || 'PENDING'}
                                                </span>
                                            </div>
                                            <div className="text-white/90 whitespace-pre-wrap text-sm leading-relaxed">
                                                {post.content}
                                            </div>
                                            {post.images && post.images.length > 0 && (
                                                <div className="grid grid-cols-2 gap-2 mt-2">
                                                    {post.images.map((img, i) => (
                                                        <img key={i} src={img} className="rounded-xl w-full h-40 object-cover border border-border-dark/30" alt="" />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {inspectorData.posts.length === 0 && (
                                        <div className="py-10 text-center text-text-muted">No posts found.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupInspectorModal;
