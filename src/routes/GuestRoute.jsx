import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * GuestRoute - Component bảo vệ các route dành cho khách (chưa đăng nhập).
 * Nếu người dùng đã đăng nhập (isAuthenticated = true) thì sẽ redirect về Dashboard.
 */
const GuestRoute = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    if (isAuthenticated) {
        // Đã đăng nhập -> Chuyển hướng về Dashboard
        return <Navigate to="/dashboard/feed" replace />;
    }

    // Chưa đăng nhập -> Cho phép truy cập route con (Login, Register, Landing...)
    return <Outlet />;
};

export default GuestRoute;
