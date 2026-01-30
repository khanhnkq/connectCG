import { useState } from "react";
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
                className={`p-4 rounded-xl cursor-pointer relative group flex flex-col gap-3 transition-all duration-200 ${isActive
                    ? 'bg-primary/10 border-2 border-primary shadow-lg shadow-primary/10'
                    : 'bg-surface-main/50 hover:bg-surface-main border-2 border-transparent hover:border-border-main'
                    }`}
            >
                {/* Header */}
                <div className="flex gap-3 items-center">
                    <div className="relative shrink-0">
                        <div
                            className="size-14 rounded-xl bg-cover bg-center border-2 border-border-main group-hover:border-primary/50 transition-all"
                            style={{ backgroundImage: `url("${suggestion.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}")` }}
                        ></div>
                        {/* Badge */}
                        <div className="absolute -bottom-1 -right-1 size-6 bg-primary rounded-full flex items-center justify-center border-2 border-surface-main shadow-lg">
                            <span className="material-symbols-outlined text-[12px] text-white font-bold">auto_awesome</span>
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
                                    <span className="material-symbols-outlined text-[14px] text-primary">stars</span>
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
                        className="flex-1 py-2 px-3 bg-primary hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                        {isProcessing === 'adding' ? (
                            <>
                                <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                                Đang gửi...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[16px]">person_add</span>
                                Kết bạn
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleDismiss}
                        disabled={isProcessing}
                        className="flex-1 py-2 px-3 bg-background-main hover:bg-neutral-700 text-text-secondary hover:text-white text-sm font-bold rounded-lg transition-all border border-border-main hover:border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                        {isProcessing === 'dismissing' ? (
                            <>
                                <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                                ...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[16px]">visibility_off</span>
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
