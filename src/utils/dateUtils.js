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
