import React, { useState } from 'react';

export default function TransferOwnershipModal({ isOpen, onClose, members, currentUserId, onTransfer }) {
    const [selectedMember, setSelectedMember] = useState(null);

    // Lọc bỏ Owner hiện tại khỏi danh sách
    const eligibleMembers = members.filter(m => m.userId !== currentUserId);

    const handleTransfer = () => {
        if (!selectedMember) return;
        onTransfer(selectedMember);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1a120b] border border-[#3e2b1d] rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="size-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mx-auto mb-6">
                    <span className="material-symbols-outlined text-4xl">swap_horiz</span>
                </div>

                <h2 className="text-2xl font-black text-white text-center mb-2">Chuyển quyền sở hữu</h2>
                <p className="text-text-secondary text-sm text-center mb-6">
                    Bạn là chủ sở hữu nhóm. Để rời nhóm, vui lòng chọn chủ sở hữu mới:
                </p>

                <div className="max-h-64 overflow-y-auto space-y-2 mb-6 custom-scrollbar">
                    {eligibleMembers.length === 0 ? (
                        <p className="text-center text-text-secondary py-4">Không có thành viên nào khác trong nhóm</p>
                    ) : (
                        eligibleMembers.map(member => (
                            <div
                                key={member.userId}
                                onClick={() => setSelectedMember(member)}
                                className={`p-4 rounded-xl cursor-pointer transition-all border ${
                                    selectedMember?.userId === member.userId
                                        ? 'bg-primary/10 border-primary/50'
                                        : 'hover:bg-white/5 border-transparent'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <img src={member.avatarUrl} className="size-10 rounded-full" alt="" />
                                    <div className="flex-1">
                                        <p className="font-bold text-white text-sm">{member.username}</p>
                                        <p className="text-xs text-text-secondary">
                                            {member.role === 'ADMIN' ? 'Quản trị viên' : 'Thành viên'}
                                        </p>
                                    </div>
                                    <div className={`size-5 rounded-full border-2 flex items-center justify-center ${
                                        selectedMember?.userId === member.userId
                                            ? 'bg-primary border-primary'
                                            : 'border-text-secondary'
                                    }`}>
                                        {selectedMember?.userId === member.userId && (
                                            <span className="material-symbols-outlined text-[14px] text-black font-bold">check</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-6">
                    <p className="text-orange-400 text-xs flex items-start gap-2">
                        <span className="material-symbols-outlined text-sm mt-0.5">warning</span>
                        <span>Sau khi chuyển quyền, bạn sẽ <strong>tự động rời khỏi nhóm</strong> và không thể hoàn tác!</span>
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all text-xs uppercase tracking-widest"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleTransfer}
                        disabled={!selectedMember}
                        className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl transition-all shadow-lg shadow-orange-500/20 text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Chuyển quyền & Rời nhóm
                    </button>
                </div>
            </div>
        </div>
    );
}