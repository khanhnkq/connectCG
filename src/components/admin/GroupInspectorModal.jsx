import React, { useState, useEffect } from 'react';
import { findById as findGroupById, getGroupMembers, getGroupPosts } from "../../services/groups/GroupService";
import toast from 'react-hot-toast';

const GroupInspectorModal = ({ groupId, reports = [], reporterMetadata = {}, onClose, onIgnore, onAction, actionLabel = "Delete Group" }) => {
    const [inspectorData, setInspectorData] = useState({
        group: null,
        members: [],
        posts: [],
        loading: true,
        activeTab: 'overview'
    });

    const isResolved = reports && reports.length > 0 && reports.every(r => r.status === 'RESOLVED');

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

    const hasReports = reports && reports.length > 0;

    return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-background-dark/95 backdrop-blur-md animate-in fade-in duration-300">
            {inspectorData.loading ? (
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <div className="text-white font-bold tracking-widest uppercase text-xs">Loading Group Info</div>
                </div>
            ) : (
                <div className={`bg-surface-dark w-full ${hasReports ? 'max-w-[75rem]' : 'max-w-5xl'} h-[85vh] rounded-[2.5rem] border border-border-dark/50 shadow-2xl overflow-hidden flex animate-in zoom-in-95 duration-300`}>

                    {/* MAIN CONTENT AREA */}
                    <div className="flex-1 flex flex-col min-w-0">
                        {/* Modal Header */}
                        <div className="relative h-48 shrink-0">
                            <img
                                src={inspectorData.group?.image || `https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80`}
                                className="w-full h-full object-cover"
                                alt=""
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/50 to-transparent"></div>

                            {!hasReports && (
                                <button
                                    onClick={onClose}
                                    className="absolute top-6 right-6 size-10 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-all border border-white/10 z-10"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            )}

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
                                    <div className={`grid grid-cols-1 ${hasReports ? '' : 'md:grid-cols-2'} gap-6`}>
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

                                        {!hasReports && (
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
                                        )}
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

                    {/* SIDEBAR (Only rendered if reports exist) */}
                    {hasReports && (
                        <div className="w-[350px] bg-[#1e120f] border-l border-white/5 flex flex-col shrink-0">
                            {/* Sidebar Header */}
                            <div className="p-5 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-red-500 text-sm">error</span>
                                    Report Details ({reports.length})
                                </h3>
                                <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            </div>

                            {/* Reports List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                {reports.map((report, idx) => {
                                    const reporterInfo = reporterMetadata[`USER_${report.reporterId}`];
                                    return (
                                        <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3 hover:bg-white/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                {reporterInfo?.avatar ? (
                                                    <img src={reporterInfo.avatar} className="size-10 rounded-full object-cover border border-white/10 shadow-sm" alt="" />
                                                ) : (
                                                    <div className="size-10 rounded-full bg-gradient-to-br from-primary/80 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-purple-500/20">
                                                        {(reporterInfo?.name || report.reporterUsername || 'R').charAt(0).toUpperCase()}
                                                    </div>
                                                )}

                                                <div className="overflow-hidden flex-1">
                                                    <p className="text-white font-bold text-sm truncate leading-tight">
                                                        {reporterInfo?.name || report.reporterUsername || "Người Báo Cáo"}
                                                    </p>
                                                    <p className="text-[11px] text-text-muted font-medium mt-0.5">
                                                        {new Date(report.createdAt).toLocaleString('vi-VN')}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                                                <p className="text-xs text-text-muted uppercase tracking-wider font-bold mb-1">Lý do báo cáo</p>
                                                <p className="text-sm font-medium text-red-400 leading-snug">
                                                    {report.reason}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Sidebar Footer Actions or Resolution Info */}
                            <div className="p-5 border-t border-white/5 bg-[#251815] space-y-3">
                                {isResolved ? (
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Biện pháp</p>
                                            <p className="text-sm font-bold text-green-400 bg-green-400/10 px-3 py-2 rounded-lg border border-green-400/20">
                                                Đã xử lý / Giữ nguyên
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Người thực hiện</p>
                                            <div className="flex items-center gap-2">
                                                <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                                                    A
                                                </div>
                                                <p className="text-white font-bold text-sm">Admin</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-[10px] text-text-muted text-center uppercase tracking-widest font-bold mb-2">Hành động quản trị viên cho Nhóm này</p>

                                        <button
                                            onClick={() => onAction && onAction(inspectorData.group)}
                                            className="w-full py-3 bg-[#ff3b3b] hover:bg-[#ff3b3b]/90 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-900/20"
                                        >
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                            {actionLabel}
                                        </button>

                                        <button
                                            onClick={onIgnore}
                                            className="w-full py-3 bg-[#3d2925] hover:bg-[#4a322e] text-white/80 font-bold rounded-xl transition-all border border-white/5"
                                        >
                                            Bỏ qua (Đóng)
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GroupInspectorModal;