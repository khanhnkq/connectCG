import React, { useState } from 'react';

export default function TransferOwnershipModal({ isOpen, onClose, members, currentUserId, onTransfer }) {
    const [selectedMember, setSelectedMember] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Lọc bỏ Owner hiện tại và lọc theo từ khóa tìm kiếm (fullName)
    const filteredMembers = members.filter(m =>
        m.userId !== currentUserId &&
        (m.fullName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    Bạn đang là chủ sở hữu. Sau khi chuyển quyền, bạn sẽ trở thành thành viên thường:
                </p>

                {/* Thanh tìm kiếm */}
                <div className="relative mb-4">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-xl">search</span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm thành viên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-[#3e2b1d] rounded-2xl py-3 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-primary/50 transition-all"
                    />
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2 mb-6 custom-scrollbar pr-1">
                    {filteredMembers.length === 0 ? (
                        <p className="text-center text-text-secondary py-4">
                            {searchTerm ? 'Không tìm thấy thành viên nào' : 'Không có thành viên nào khác trong nhóm'}
                        </p>
                    ) : (
                        filteredMembers.map(member => (
                            <div
                                key={member.userId}
                                onClick={() => setSelectedMember(member)}
                                className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedMember?.userId === member.userId
                                    ? 'bg-primary/10 border-primary/50'
                                    : 'hover:bg-white/5 border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <img src={member.avatarUrl} className="size-10 rounded-full" alt="" />
                                    <div className="flex-1">
                                        <p className="font-bold text-white text-sm">{member.fullName}</p>
                                        <p className="text-xs text-text-secondary">
                                            {member.role === 'ADMIN' ? 'Quản trị viên' : 'Thành viên'}
                                        </p>
                                    </div>
                                    <div className={`size-5 rounded-full border-2 flex items-center justify-center ${selectedMember?.userId === member.userId
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
                        <span className="material-symbols-outlined text-sm mt-0.5">info</span>
                        <span>Sau khi chuyển quyền, bạn sẽ trở thành <strong>thành viên thường</strong> của nhóm này.</span>
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
                        Xác nhận chuyển
                    </button>
                </div>
            </div>
        </div>
    );
}