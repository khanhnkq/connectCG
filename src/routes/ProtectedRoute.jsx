import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
/**
 * @param {Array<string>} roles - Danh sách các role được phép truy cập (VD: ['ADMIN', 'USER'])
 * @param {JSX.Element} children - Component con cần bảo vệ
 */
const ProtectedRoute = ({ children, roles }) => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const location = useLocation(); // Lưu lại vị trí để sau khi login thì redirect lại
    // 1. Kiểm tra đăng nhập
    if (!isAuthenticated) {
        // Chưa đăng nhập -> Chuyển về Login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    // 2. Kiểm tra quyền (Nếu route yêu cầu roles cụ thể)
    if (roles && roles.length > 0) {
        // Giả sử user.role là String ('ADMIN', 'USER') hoặc Array
        // Backend trả về là "ROLE_USER" hoặc "[ROLE_USER]"
        
        // Normalize role user đang có (tuỳ vào structure user object của bạn)
        const userRole = user?.role || user?.authorities || ""; 
        
        // Kiểm tra xem user có quyền không
        const hasPermission = roles.some(role => userRole.includes(role));
        if (!hasPermission) {
            // Đăng nhập rồi nhưng không đủ quyền -> Về trang 403 hoặc Dashboard
            return <Navigate to="/dashboard/feed" replace />;
        }
    }
    // 3. Hợp lệ -> Render component con
    return children;
};
export default ProtectedRoute;