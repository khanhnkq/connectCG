import React from 'react';

const ConfirmModal = ({
    isOpen,
    title,
    message,
    onConfirm,
    onClose,
    type = 'danger',
    confirmText = 'Confirm',
    cancelText = 'Cancel'
}) => {
    if (!isOpen) return null;

    const themes = {
        danger: {
            icon: 'report',
            iconBg: 'bg-red-500/10 text-red-500',
            button: 'bg-red-500 shadow-red-500/20 hover:bg-red-600'
        },
        warning: {
            icon: 'warning',
            iconBg: 'bg-orange-500/10 text-orange-400',
            button: 'bg-orange-500 shadow-orange-500/20 hover:bg-orange-600'
        },
        info: {
            icon: 'help',
            iconBg: 'bg-primary/10 text-primary',
            button: 'bg-primary shadow-primary/20 hover:brightness-110'
        }
    };

    const theme = themes[type] || themes.danger;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-background-dark/90 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-surface-dark w-full max-w-md rounded-3xl border border-border-dark/50 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 text-center space-y-6">
                    <div className={`size-20 rounded-full mx-auto flex items-center justify-center ${theme.iconBg}`}>
                        <span className="material-symbols-outlined text-4xl">
                            {theme.icon}
                        </span>
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-xl font-black text-white">{title}</h4>
                        <p className="text-sm text-text-muted leading-relaxed">{message}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <button
                            onClick={onClose}
                            className="py-3.5 rounded-xl border border-border-dark/50 text-text-muted font-bold hover:bg-background-dark hover:text-white transition-all"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`py-3.5 rounded-xl text-white font-black shadow-lg transition-all ${theme.button}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
