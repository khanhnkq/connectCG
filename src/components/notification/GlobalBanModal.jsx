import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, ShieldAlert, AlertCircle, Info } from 'lucide-react';
import { clearGroupBanAlert } from '../../redux/slices/notificationSlice';

const GlobalBanModal = () => {
    const dispatch = useDispatch();
    const { groupBanAlert } = useSelector((state) => state.notifications);
    const [timeLeft, setTimeLeft] = useState(20);

    useEffect(() => {
        if (!groupBanAlert) return;

        setTimeLeft(20);
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleClose();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [groupBanAlert]);

    const handleClose = () => {
        dispatch(clearGroupBanAlert());
    };

    if (!groupBanAlert) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-md overflow-hidden bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-red-500/20 transform animate-in zoom-in slide-in-from-bottom-10 duration-500">
                {/* Header Background Pattern */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-red-600 to-red-900 opacity-10 dark:opacity-20 pointer-events-none" />

                <div className="relative p-8 text-center">
                    {/* Icon Container */}
                    <div className="mx-auto w-20 h-20 mb-6 relative">
                        <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
                        <div className="relative flex items-center justify-center w-full h-full bg-red-600 rounded-full shadow-lg shadow-red-600/30">
                            <ShieldAlert size={40} className="text-white" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 leading-tight">
                        Bạn đã bị cấm khỏi nhóm!
                    </h2>

                    <p className="text-zinc-500 dark:text-zinc-400 mb-6">
                        Thông báo quan trọng từ hệ thống kiểm soát nội dung
                    </p>

                    {/* Group info card */}
                    <div className="bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl p-5 mb-8 border border-zinc-200 dark:border-zinc-700/50">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <AlertCircle size={18} className="text-red-500" />
                            <span className="text-sm font-semibold uppercase tracking-wider text-red-500">
                                Vi phạm nghiêm trọng
                            </span>
                        </div>
                        <div className="text-lg font-bold text-zinc-800 dark:text-zinc-200 truncate">
                            {groupBanAlert.groupName || "Một nhóm của bạn"}
                        </div>
                        <div className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                            Hệ thống đã ghi nhận 3 lần vi phạm nội quy của bạn trong nhóm này. Token truy cập của bạn vào nhóm đã bị thu hồi.
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full mb-8 overflow-hidden">
                        <div
                            className="h-full bg-red-600 transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                            style={{ width: `${(timeLeft / 20) * 100}%` }}
                        />
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleClose}
                        className="w-full py-4 px-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold text-lg 
                            hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-xl shadow-zinc-900/20 dark:shadow-white/10"
                    >
                        Tôi đã hiểu ({timeLeft}s)
                    </button>

                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Footer Decor */}
                <div className="flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-800/20 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                        <Info size={14} />
                        Hệ thống tự động ConnectCG
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalBanModal;
