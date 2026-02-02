import React, { useState, useRef } from 'react';
import {
    Camera,
    Pencil,
    Check,
    X,
    User,
    ChevronRight,
    UserX,
    Trash2,
    Flag,
    Info,
    Users,
    Paperclip
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatSettings = ({
    activeRoom,
    currentUser,
    onUpdateAvatar,
    onRenameRoom,
    onClearHistory,
    onReportUser,
    onLeaveGroup,
    onDeleteGroup,
    onKickMember,
    setShowClearConfirm,
    setShowReportUser,
    setShowLeaveConfirm,
    setShowDeleteConfirm
}) => {
    const navigate = useNavigate();
    const chatAvatarInputRef = useRef(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState("");

    if (!activeRoom) {
        return (
            <aside className="hidden xl:flex w-80 flex-col border-l border-border-main bg-background-main overflow-y-auto shrink-0 z-20">
                <div className="flex-1 flex flex-col items-center justify-center text-text-secondary h-full p-8 text-center gap-3">
                    <Info size={32} className="opacity-20" />
                    <p className="text-xs italic">
                        Chọn một cuộc trò chuyện để xem chi tiết
                    </p>
                </div>
            </aside>
        );
    }

    const handleRename = () => {
        if (!tempName.trim() || tempName === activeRoom.name) {
            setIsEditingName(false);
            return;
        }
        onRenameRoom(tempName);
        setIsEditingName(false);
    };

    const isAdmin = activeRoom.members?.find((m) => m.id === currentUser.id)?.role === "ADMIN";

    return (
        <aside className="hidden xl:flex w-80 flex-col border-l border-border-main bg-background-main overflow-y-auto shrink-0 z-20 transition-colors duration-300">
            <div className="p-8 flex flex-col items-center border-b border-border-main">
                <div className="relative group/avatar">
                    <div
                        className="size-24 rounded-full bg-cover bg-center ring-4 ring-surface-main mb-4 shadow-xl"
                        style={{
                            backgroundImage: `url("${activeRoom?.avatarUrl ||
                                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                }")`,
                        }}
                    ></div>
                    {activeRoom?.type === "GROUP" && (
                        <>
                            <button
                                onClick={() => chatAvatarInputRef.current?.click()}
                                className="absolute bottom-4 right-0 size-8 bg-primary rounded-full border-4 border-background-main text-[#231810] flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all shadow-lg hover:scale-110"
                            >
                                <Camera size={18} />
                            </button>
                            <input
                                type="file"
                                ref={chatAvatarInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => onUpdateAvatar(e.target.files[0])}
                            />
                        </>
                    )}
                </div>

                {isEditingName ? (
                    <div className="flex gap-2 mb-1 w-full px-4">
                        <input
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            className="bg-surface-main border border-border-main text-text-main text-sm rounded-lg px-2 py-1 flex-1 focus:outline-none focus:ring-1 focus:ring-primary"
                            autoFocus
                            onKeyDown={(e) => e.key === "Enter" && handleRename()}
                        />
                        <button
                            onClick={handleRename}
                            className="text-primary flex items-center justify-center p-1 rounded hover:bg-surface-main"
                        >
                            <Check size={18} />
                        </button>
                        <button
                            onClick={() => setIsEditingName(false)}
                            className="text-text-secondary flex items-center justify-center p-1 rounded hover:bg-surface-main"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ) : (
                    <h2 className="text-text-main text-xl font-extrabold mb-1 text-center flex items-center gap-2 group/title">
                        {activeRoom?.name || "Đang tải..."}
                        {activeRoom?.type === "GROUP" && (
                            <button
                                onClick={() => {
                                    setIsEditingName(true);
                                    setTempName(activeRoom.name || "");
                                }}
                                className="opacity-0 group-hover/title:opacity-100 text-text-secondary hover:text-primary transition-all"
                            >
                                <Pencil size={16} />
                            </button>
                        )}
                    </h2>
                )}
                <p className="text-text-secondary text-sm mb-4">
                    {activeRoom?.type === "GROUP"
                        ? "Trò chuyện Nhóm"
                        : "Trò chuyện Cá nhân"}
                </p>

                <div className="flex gap-3 w-full justify-center">
                    {activeRoom?.type !== "GROUP" && (
                        <button
                            onClick={() => navigate(`/dashboard/member/${activeRoom?.otherParticipantId}`)}
                            className="flex flex-col items-center gap-1 group"
                        >
                            <div className="size-10 rounded-full bg-[#2A1D15] group-hover:bg-primary group-hover:text-[#231810] flex items-center justify-center text-white transition-all border border-[#3A2A20]">
                                <User size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-text-secondary group-hover:text-primary uppercase tracking-wider">Trang cá nhân</span>
                        </button>
                    )}

                    {activeRoom?.type === "GROUP" && (
                        <>
                            <button
                                onClick={() => setShowLeaveConfirm(true)}
                                className="flex flex-col items-center gap-1 group"
                            >
                                <div className="size-10 rounded-full bg-[#2A1D15] group-hover:bg-red-500/20 group-hover:text-red-500 flex items-center justify-center text-white transition-all border border-[#3A2A20]">
                                    <X size={20} />
                                </div>
                                <span className="text-[10px] font-bold text-text-secondary group-hover:text-red-500 uppercase tracking-wider">Rời nhóm</span>
                            </button>

                            {isAdmin && (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="flex flex-col items-center gap-1 group"
                                >
                                    <div className="size-10 rounded-full bg-[#2A1D15] group-hover:bg-red-600/20 group-hover:text-red-600 flex items-center justify-center text-white transition-all border border-[#3A2A20]">
                                        <Trash2 size={20} />
                                    </div>
                                    <span className="text-[10px] font-bold text-text-secondary group-hover:text-red-600 uppercase tracking-wider">Giải tán</span>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="p-6">
                {activeRoom?.type === "GROUP" ? (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                                <Users size={16} className="text-primary" />
                                Thành viên ({activeRoom.members?.length || 0})
                            </h3>
                        </div>
                        <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                            {activeRoom.members?.map((member) => (
                                <div
                                    key={member.id}
                                    onClick={() => navigate(`/dashboard/member/${member.id}`)}
                                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-main cursor-pointer group transition-all"
                                >
                                    <div
                                        className="size-8 rounded-full bg-cover bg-center border border-border-main"
                                        style={{
                                            backgroundImage: `url("${member.avatarUrl ||
                                                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                                }")`,
                                        }}
                                    ></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-text-main text-sm font-bold truncate group-hover:text-primary transition-colors">
                                            {member.fullName}
                                        </p>
                                        <span
                                            className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${member.role === "ADMIN"
                                                ? "bg-orange-500/20 text-orange-400"
                                                : "bg-surface-main text-text-secondary"
                                                }`}
                                        >
                                            {member.role === "ADMIN" ? "Quản trị viên" : "Thành viên"}
                                        </span>
                                    </div>
                                    <ChevronRight
                                        size={16}
                                        className="text-text-secondary opacity-0 group-hover:opacity-100 transition-all"
                                    />
                                    {/* Kick Button for Admin */}
                                    {isAdmin && member.id !== currentUser.id && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onKickMember(member);
                                            }}
                                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Xóa khỏi nhóm"
                                        >
                                            <UserX size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white text-sm font-bold uppercase tracking-wide">
                                Ảnh & Video
                            </h3>
                            <button className="text-primary text-xs font-bold hover:underline">
                                Xem tất cả
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=150&q=80",
                                "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=150&q=80",
                                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=150&q=80",
                                "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=150&q=80",
                            ].map((img, i) => (
                                <div
                                    key={i}
                                    className="aspect-square bg-cover bg-center rounded-xl cursor-pointer hover:opacity-80 transition-opacity border border-border-main"
                                    style={{ backgroundImage: `url("${img}")` }}
                                ></div>
                            ))}
                            <div className="aspect-square bg-surface-main rounded-xl flex items-center justify-center text-text-secondary hover:text-primary cursor-pointer transition-all border border-border-main">
                                <span className="text-xs font-bold">+12</span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="p-5 border-t border-border-main mt-auto">
                <h3 className="text-text-main text-sm font-bold uppercase tracking-wide mb-3">
                    Bảo mật & Hỗ trợ
                </h3>
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => setShowClearConfirm(true)}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-background-main hover:bg-surface-main border border-border-main group transition-colors text-left"
                    >
                        <div className="flex items-center gap-3 text-text-secondary group-hover:text-white">
                            <Trash2 size={20} />
                            <span className="text-sm font-medium">Xóa lịch sử</span>
                        </div>
                    </button>

                    <button
                        onClick={() => setShowReportUser(true)}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-main hover:bg-background-main border border-border-main group transition-colors text-left"
                    >
                        <div className="flex items-center gap-3 text-text-secondary group-hover:text-white">
                            <Flag size={20} />
                            <span className="text-sm font-medium">Báo cáo</span>
                        </div>
                        <ChevronRight size={16} className="text-text-secondary" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default ChatSettings;
