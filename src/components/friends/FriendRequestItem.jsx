import { useState } from "react";
import ConfirmModal from "../common/ConfirmModal";

export default function FriendRequestItem({
    request,
    isActive,
    onClick,
    onAccept,
    onReject,
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

    const handleAccept = (e) => {
        e.stopPropagation();
        setConfirmModal({
            isOpen: true,
            type: 'info',
            title: 'Chấp nhận lời mời?',
            message: `Bạn muốn chấp nhận lời mời kết bạn từ ${request.senderFullName || request.senderUsername}?`,
            onConfirm: () => {
                onAccept(request);
                closeModal();
            }
        });
    };

    const handleReject = (e) => {
        e.stopPropagation();
        setConfirmModal({
            isOpen: true,
            type: 'warning',
            title: 'Từ chối lời mời?',
            message: `Bạn có chắc muốn từ chối lời mời kết bạn từ ${request.senderFullName || request.senderUsername}?`,
            onConfirm: () => {
                onReject(request);
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
                            style={{ backgroundImage: `url("${request.senderAvatarUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}")` }}
                        ></div>
                        {/* Badge */}
                        <div className="absolute -bottom-1 -right-1 size-6 bg-primary rounded-full flex items-center justify-center border-2 border-surface-main shadow-lg">
                            <span className="material-symbols-outlined text-[12px] text-white font-bold">person_add</span>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-base truncate transition-colors ${isActive ? 'text-text-main' : 'text-text-main group-hover:text-primary'
                            }`}>
                            {request.senderFullName || request.senderUsername}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="material-symbols-outlined text-[12px] text-text-secondary">schedule</span>
                            <p className="text-[11px] text-text-secondary">{request.time || 'Vừa xong'}</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={handleAccept}
                        disabled={isProcessing}
                        className="flex-1 py-2 px-3 bg-primary hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                        {isProcessing === 'accepting' ? (
                            <>
                                <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[16px]">check</span>
                                Chấp nhận
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleReject}
                        disabled={isProcessing}
                        className="flex-1 py-2 px-3 bg-background-main hover:bg-red-500/20 hover:text-red-500 text-text-secondary text-sm font-bold rounded-lg transition-all border border-border-main hover:border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                        {isProcessing === 'rejecting' ? (
                            <>
                                <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                                ...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[16px]">close</span>
                                Từ chối
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
