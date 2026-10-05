/**
 * Formats a date string (YYYY-MM-DD or ISO) to DD/MM/YYYY
 * @param {string} dateString 
 * @returns {string} Formatted date string or "Chưa cập nhật"
 */
export const formatDate = (dateString) => {
  if (!dateString) return "Chưa cập nhật";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

/**
 * Formats a date string into a relative time description (e.g. "Vừa xong", "5 phút trước")
 * @param {string|Date} dateString 
 * @returns {string}
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // seconds

  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
  return date.toLocaleDateString("vi-VN", { day: "numeric", month: "short" });
};

export const formatTime = formatRelativeTime;

