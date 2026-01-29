/* src/utils/errorUtils.js */
export const getErrorMessage = (error) => {
    // Nếu error là một chuỗi (String) trả về từ server
    if (typeof error === 'string') return error;
    
    // Nếu error là Object (thông thường từ axios error.response.data)
    if (error && typeof error === 'object') {
        return error.message || error.error || "Đã có lỗi xảy ra. Vui lòng thử lại.";
    }
    
    return "Lỗi kết nối đến máy chủ.";
};