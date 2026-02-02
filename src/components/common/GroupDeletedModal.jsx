import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearGroupDeletionAlert } from '../../redux/slices/notificationSlice';
import { AlertTriangle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GroupDeletedModal = () => {
    const dispatch = useDispatch();
    const alert = useSelector(state => state.notifications.groupDeletionAlert);

    const navigate = useNavigate();

    if (!alert) return null;

    const handleClose = () => {
        const deletedGroupId = alert.targetId || alert.groupId;
        const currentPath = window.location.pathname;

        if (deletedGroupId && currentPath.includes(`/groups/${deletedGroupId}`)) {
            navigate('/dashboard/groups');
        }
        dispatch(clearGroupDeletionAlert());
    };

    // Determine type of deletion based on content keywords
    const isViolation = alert.content?.toLowerCase().includes("vi phạm");
    const isDisbanded = alert.content?.toLowerCase().includes("giải tán");

    let title = "Thông báo quan trọng";
    let icon = <Info className="text-blue-500 size-8" />;
    let iconBg = "bg-blue-500/10";
    let borderColor = "border-blue-500/30";
    let btnColor = "bg-blue-500 hover:bg-blue-600";

    if (isViolation) {
        title = "Cảnh báo vi phạm";
        icon = <AlertTriangle className="text-red-500 size-8" />;
        iconBg = "bg-red-500/10";
        borderColor = "border-red-500/30";
        btnColor = "bg-red-500 hover:bg-red-600";
    } else if (isDisbanded) {
        title = "Nhóm đã giải tán";
        icon = <Info className="text-orange-500 size-8" />;
        iconBg = "bg-orange-500/10";
        borderColor = "border-orange-500/30";
        btnColor = "bg-orange-500 hover:bg-orange-600";
    }

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`bg-surface-main w-full max-w-md rounded-2xl border ${borderColor} shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200`}>
                <div className="p-6 flex flex-col items-center text-center">
                    <div className={`size-16 rounded-full ${iconBg} flex items-center justify-center mb-4`}>
                        {icon}
                    </div>

                    <h3 className="text-xl font-bold text-text-main mb-2">{title}</h3>

                    <p className="text-text-secondary mb-6 leading-relaxed">
                        {alert.content || "Nhóm này không còn tồn tại."}
                    </p>

                    <button
                        onClick={handleClose}
                        className={`w-full py-3 ${btnColor} text-white font-bold rounded-xl transition-colors`}
                    >
                        Quay về trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupDeletedModal;
