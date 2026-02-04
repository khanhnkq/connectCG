import React from "react";
import { Link } from "react-router-dom";
import {
    ShieldCheck, Globe, Lock, UserPlus, PlusSquare, User, LogIn, Settings
} from "lucide-react";

const GroupCard = ({
    group,
    activeTab,
    isAdmin,
    onAccept,
    onDecline,
    onCancelRequest,
    onJoin,
    onNavigate
}) => {
    const imageUrl = group.image || "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000";
    const isMember = group.currentUserStatus === "ACCEPTED";

    return (
        <div
            className={`bg-white dark:bg-card-dark rounded-3xl border overflow-hidden flex flex-col hover:border-primary/30 transition-all group h-full shadow-md dark:shadow-2xl relative ${isAdmin ? "border-orange-500/50 dark:shadow-orange-500/10" : "border-gray-200 dark:border-[#3e2b1d]"
                }`}
        >
            <div className="relative h-44 overflow-hidden">
                <Link to={`/dashboard/groups/${group.id}`} className="absolute inset-0 z-10 block cursor-pointer" />
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url("${imageUrl}")` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-20">
                    {isAdmin && (
                        <div className="bg-orange-500 text-[#231810] text-[10px] font-black px-3 py-1.5 rounded-xl border border-white/20 shadow-xl flex items-center gap-1.5">
                            <ShieldCheck size={14} /> ADMIN
                        </div>
                    )}
                    <div className="bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/10 shadow-lg">
                        {group.privacy === "PUBLIC" ? <Globe size={18} className="text-primary" /> : <Lock size={18} className="text-primary" />}
                        <span className="text-text-main text-[11px] font-black uppercase tracking-wider">
                            {group.privacy === "PUBLIC" ? "Công khai" : "Riêng tư"}
                        </span>
                    </div>
                </div>

                {isAdmin && (group.pendingRequestsCount > 0 || group.pendingPostsCount > 0) && (
                    <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                        {group.pendingRequestsCount > 0 && (
                            <div className="bg-red-500/90 backdrop-blur-md text-white px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/10 shadow-xl" title={`${group.pendingRequestsCount} yêu cầu tham gia`}>
                                <UserPlus size={16} />
                                <span className="text-[11px] font-bold">{group.pendingRequestsCount}</span>
                            </div>
                        )}
                        {group.pendingPostsCount > 0 && (
                            <div className="bg-blue-500/90 backdrop-blur-md text-white px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/20 shadow-xl" title={`${group.pendingPostsCount} bài viết chờ duyệt`}>
                                <PlusSquare size={16} />
                                <span className="text-[11px] font-bold">{group.pendingPostsCount}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="absolute bottom-4 left-5 right-5 z-20 pointer-events-none">
                    <h4 className="text-white font-bold text-xl leading-tight group-hover:text-primary transition-colors line-clamp-1">{group.name}</h4>
                    <p className="text-white/80 text-xs font-medium italic flex items-center gap-1 mt-1">
                        <User size={16} /> {group.ownerFullName || group.ownerName}
                    </p>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1 bg-white dark:bg-surface-main">
                <p className="text-text-secondary text-sm mb-6 line-clamp-2 leading-relaxed h-10">
                    {group.description || "Chưa có mô tả cho nhóm này."}
                </p>

                <div className="mt-auto flex gap-3 relative z-10">
                    {activeTab === "invites" ? (
                        <>
                            <button onClick={() => onAccept(group.id)} className="flex-1 py-3 rounded-2xl bg-primary text-text-main font-black text-xs uppercase tracking-widest hover:bg-orange-600 active:scale-95 flex items-center justify-center">Chấp nhận</button>
                            <button onClick={() => onDecline(group.id)} className="flex-1 py-3 rounded-2xl bg-surface-main text-red-500 border border-border-main font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white active:scale-95 flex items-center justify-center">Từ chối</button>
                        </>
                    ) : group.currentUserStatus === "REQUESTED" ? (
                        <button onClick={() => onCancelRequest(group.id)} className="flex-1 py-3 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 font-black text-xs uppercase tracking-widest text-center flex items-center justify-center hover:bg-orange-500 hover:text-white">Hủy yêu cầu</button>
                    ) : group.currentUserStatus === "PENDING" ? (
                        <div className="flex-1 py-3 rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20 font-black text-xs uppercase tracking-widest text-center flex items-center justify-center italic">Mời tham gia</div>
                    ) : (isMember || isAdmin) ? (
                        <button onClick={() => onNavigate(`/dashboard/groups/${group.id}`)} className="flex-1 py-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-text-main active:scale-95 flex items-center justify-center gap-2">
                            <LogIn size={16} /> Vào nhóm
                        </button>
                    ) : (
                        <button onClick={() => onJoin(group.id)} className="flex-1 py-3 rounded-2xl bg-primary text-text-main font-black text-xs uppercase tracking-widest hover:bg-orange-600 active:scale-95 flex items-center justify-center gap-2">
                            <UserPlus size={16} /> Tham gia
                        </button>
                    )}

                    {isAdmin && (
                        <button onClick={() => onNavigate(`/dashboard/groups/edit/${group.id}`)} className="px-4 py-3 rounded-2xl bg-surface-main text-primary border border-border-main hover:bg-primary hover:text-white transition-all active:scale-95 flex items-center justify-center group/settings" title="Cài đặt nhóm">
                            <Settings size={18} className="group-hover/settings:rotate-90 transition-transform" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(GroupCard);
