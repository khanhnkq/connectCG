export const toastConfig = {
    position: "top-right",
    toastOptions: {
        duration: 4000,
        style: {
            background: "var(--color-surface-main)",
            color: "var(--color-text-main)",
            border: "none",
            borderRadius: "16px",
            padding: "12px 16px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
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
                border: "none",
            },
        },
        error: {
            duration: 5000,
            iconTheme: {
                primary: "#ef4444", // Red 500
                secondary: "#ffffff",
            },
            style: {
                border: "none",
            },
        },
        loading: {
            style: {
                border: "none",
            },
        },
    },
};
