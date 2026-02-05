export const toastConfig = {
    position: "top-right",
    toastOptions: {
        duration: 4000,
        style: {
            background: "var(--color-surface-main)",
            color: "var(--color-text-main)",
            border: "1px solid var(--color-border-main)",
            borderRadius: "12px",
            padding: "12px 16px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            fontSize: "14px",
            fontWeight: "500",
        },
        success: {
            duration: 3000,
            iconTheme: {
                primary: "#10b981", // Emerald 500
                secondary: "#ffffff",
            },
            style: {
                borderLeft: "4px solid #10b981",
            },
        },
        error: {
            duration: 5000,
            iconTheme: {
                primary: "#ef4444", // Red 500
                secondary: "#ffffff",
            },
            style: {
                borderLeft: "4px solid #ef4444",
            },
        },
        loading: {
            style: {
                borderLeft: "4px solid #3b82f6", // Blue 500
            },
        },
    },
};
