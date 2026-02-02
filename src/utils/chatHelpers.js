export const formatDaySeparator = (date) => {
    if (!date) return "";
    const targetDate = new Date(date);
    const now = new Date();

    // Reset hours to compare dates only
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const compareDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    const diffTime = today.getTime() - compareDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";

    return targetDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};

export const getMessageSenderBadge = (role) => {
    if (role === "ADMIN") return "bg-orange-500/20 text-orange-400";
    return "bg-surface-main text-text-secondary";
};
