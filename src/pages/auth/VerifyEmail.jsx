import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { Link } from 'react-router-dom';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const verifyCalled = useRef(false);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Token không tìm thấy.');
            return;
        }

        if (verifyCalled.current) return;
        verifyCalled.current = true;

        const verify = async () => {
            try {
                await authService.verifyEmail(token);
                setStatus('success');
                setMessage('Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.');
                setTimeout(() => navigate('/login'), 3000);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn.');
            }
        };

        verify();
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-dark px-4">
            <div className="max-w-md w-full bg-surface-dark p-8 rounded-2xl border border-border-dark shadow-xl text-center">
                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <h2 className="text-xl font-bold text-white">Đang xác thực email...</h2>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-green-500">check_circle</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Xác thực thành công!</h2>
                        <p className="text-text-secondary">{message}</p>
                        <p className="text-sm text-text-secondary mt-2">Đang chuyển hướng đến trang đăng nhập...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-red-500">error</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Xác thực thất bại</h2>
                        <p className="text-text-secondary">{message}</p>
                        <Link to="/login" className="mt-4 px-6 py-2 bg-primary text-white rounded-full font-bold hover:bg-orange-600 transition-colors">
                            Quay lại đăng nhập
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
