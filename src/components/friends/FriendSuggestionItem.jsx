import { useState } from "react";
import { Sparkle, Star, CircleNotch, UserPlus, EyeSlash } from "@phosphor-icons/react";
import ConfirmModal from "../common/ConfirmModal";

export default function FriendSuggestionItem({
    suggestion,
    isActive,
    onClick,
    onAddFriend,
    onDismiss,
    isProcessing
}) {
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        onConfirm: null
    });

    const closeModal = () => {
        setConfirmModal({ ...confirmModal, isOpen: false });
    };

    const handleAddFriend = (e) => {
        e.stopPropagation();
        setConfirmModal({
            isOpen: true,
            type: 'info',
            title: 'Gửi lời mời kết bạn?',
            message: `Bạn muốn gửi lời mời kết bạn đến ${suggestion.fullName || suggestion.username}?`,
            onConfirm: () => {
                onAddFriend(suggestion.userId);
                closeModal();
            }
        });
    };

    const handleDismiss = (e) => {
        e.stopPropagation();
        setConfirmModal({
            isOpen: true,
            type: 'info',
            title: 'Ẩn gợi ý?',
            message: `Bạn sẽ không thấy ${suggestion.fullName || suggestion.username} trong danh sách gợi ý nữa.`,
            onConfirm: () => {
                onDismiss(suggestion.userId);
                closeModal();
            }
        });
    };

    return (
        <>
            <div
                onClick={onClick}
                className={`p-4 rounded-xl cursor-pointer relative group flex flex-col gap-3 transition-all duration-200 border-0 ${isActive
                    ? 'bg-primary/10 shadow-lg shadow-primary/10'
                    : 'bg-surface-main/50 hover:bg-surface-main'
                    }`}
            >
                {/* Header */}
                <div className="flex gap-3 items-center">
                    <div className="relative shrink-0">
                        <div
                            className="size-14 rounded-xl bg-cover bg-center transition-all"
                            style={{ backgroundImage: `url("${suggestion.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}")` }}
                        ></div>
                        {/* Badge */}
                        <div className="absolute -bottom-1 -right-1 size-6 bg-primary rounded-full flex items-center justify-center ring-2 ring-surface-main shadow-lg">
                            <Sparkle size={12} weight="fill" className="text-white" />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-base truncate transition-colors ${isActive ? 'text-text-main' : 'text-text-main group-hover:text-primary'
                            }`}>
                            {suggestion.fullName || suggestion.username}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-0.5">
                            {suggestion.description && (
                                <>
                                    <Star size={14} weight="fill" className="text-primary shrink-0" />
                                    <span className="truncate">{suggestion.description}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={handleAddFriend}
                        disabled={isProcessing}
                        className="flex-1 py-2 px-3 bg-primary hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md border-0"
                    >
                        {isProcessing === 'adding' ? (
                            <>
                                <CircleNotch size={16} className="animate-spin" />
                                Đang gửi...
                            </>
                        ) : (
                            <>
                                <UserPlus size={16} weight="bold" />
                                Kết bạn
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleDismiss}
                        disabled={isProcessing}
                        className="flex-1 py-2 px-3 bg-surface-subtle hover:bg-surface-subtle/80 text-text-secondary hover:text-white text-sm font-bold rounded-lg transition-all border-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                        {isProcessing === 'dismissing' ? (
                            <>
                                <CircleNotch size={16} className="animate-spin" />
                                ...
                            </>
                        ) : (
                            <>
                                <EyeSlash size={16} />
                                Bỏ qua
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                type={confirmModal.type}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={confirmModal.onConfirm}
                onClose={closeModal}
                confirmText="Xác nhận"
                cancelText="Hủy"
            />
        </>
    );
}
