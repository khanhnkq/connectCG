import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AlertTriangle, X, ShieldAlert } from "lucide-react";

const StrikeWarningModal = () => {
    const { user } = useSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [strikeData, setStrikeData] = useState(null);

    useEffect(() => {
        const handleUserEvent = (e) => {
            const { action, violationCount, isLocked, userId } = e.detail;

            // Robust ID check: try multiple sources for current user ID
            const currentUserId = user?.id || user?.userId || user?.sub ||
                JSON.parse(localStorage.getItem('user') || '{}')?.id ||
                JSON.parse(localStorage.getItem('userData') || '{}')?.userId;

            const userRole = user?.role || JSON.parse(localStorage.getItem('user') || '{}')?.role;
            const isAdmin = userRole === 'ADMIN' || userRole === 'ROLE_ADMIN';

            console.log(`[StrikeWarning] Incoming event for UserID: ${userId}. Current Login ID: ${currentUserId}, Role: ${userRole}`);

            // CRITICAL: Only show if the event is strictly for the current logged in user
            // AND the user is NOT an admin (Admins are immune to strikes)
            if (!currentUserId || Number(userId) !== Number(currentUserId) || isAdmin) {
                return;
            }

            // We only show this modal for strike updates (violationCount changed)
            // and if the user is not completely locked (GlobalBanModal handles that)
            if (action === "UPDATED" && violationCount !== undefined && !isLocked) {
                setStrikeData(e.detail);
                setIsOpen(true);
            }
        };

        window.addEventListener("userEvent", handleUserEvent);
        return () => window.removeEventListener("userEvent", handleUserEvent);
    }, [user]);

    if (!isOpen || !strikeData) return null;

    const isHighRisk = strikeData.violationCount >= 5;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative bg-surface-main border-2 border-orange-500/30 rounded-[2.5rem] p-8 max-w-md w-full shadow-[0_0_50px_-12px_rgba(249,115,22,0.3)] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-text-secondary transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center space-y-6">
                    {/* Animated Icon */}
                    <div className={`size-20 rounded-full flex items-center justify-center animate-bounce ${isHighRisk ? "bg-red-500/10 text-red-500" : "bg-orange-500/10 text-orange-500"
                        }`}>
                        <AlertTriangle size={48} />
                    </div>

                    <div className="space-y-2">
                        <h2 className={`text-2xl font-black uppercase tracking-tighter ${isHighRisk ? "text-red-500" : "text-orange-500"
                            }`}>
                            Cảnh báo vi phạm
                        </h2>
                        <p className="text-text-secondary text-sm leading-relaxed px-4">
                            Hệ thống ghi nhận hành vi vi phạm tiêu chuẩn cộng đồng từ tài khoản của bạn.
                        </p>
                    </div>

                    {/* Stats Card */}
                    <div className="w-full p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-text-secondary text-xs uppercase font-bold tracking-widest">Trạng thái hiện tại</span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-500/10 text-orange-500 border border-orange-500/20`}>
                                Gậy thứ {strikeData.violationCount}
                            </span>
                        </div>

                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ease-out rounded-full ${isHighRisk ? 'bg-red-500' : 'bg-orange-500'}`}
                                style={{ width: `${(strikeData.violationCount / 8) * 100}%` }}
                            />
                        </div>

                        <p className="text-[11px] text-text-secondary italic">
                            * Khi đạt đủ 8 gậy vi phạm, tài khoản của bạn sẽ bị <strong>KHÓA VĨNH VIỄN</strong>.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsOpen(false)}
                        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg ${isHighRisk
                            ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
                            : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20"
                            }`}
                    >
                        Tôi đã hiểu và cam kết tuân thủ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StrikeWarningModal;
