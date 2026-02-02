import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { IconHome, IconBell, IconUsers, IconUser, IconSettings, IconLogout, IconChevronDown } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, markAsRead, deleteNotification, markAllAsRead } from '../../redux/slices/notificationSlice';
import { logout } from '../../redux/slices/authSlice';
import NotificationList from '../notification/NotificationList';
import NotificationService from '../../services/NotificationService';
import toast from 'react-hot-toast';

const UserNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { items: notifications, unreadCount } = useSelector((state) => state.notifications);
    const { user } = useSelector((state) => state.auth);
    const { profile: userProfile } = useSelector((state) => state.user);

    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const notificationRef = useRef(null);
    const userMenuRef = useRef(null);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const isActive = (path) => location.pathname === path;

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            navigate(`/search/members?keyword=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm("");
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await NotificationService.markAsRead(id);
            dispatch(markAsRead(id));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await NotificationService.deleteNotification(id);
            dispatch(deleteNotification(id));
            toast.success('Đã xóa thông báo');
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Không thể xóa thông báo');
        }
    };

    const handleMarkAllAsRead = async () => {
        const unreadNotifications = notifications.filter(n => !n.isRead);

        if (unreadNotifications.length === 0) {
            toast.info('Tất cả thông báo đã được đọc');
            return;
        }

        const tid = toast.loading(`Đang đánh dấu ${unreadNotifications.length} thông báo...`);

        try {
            // Mark each notification as read individually
            await Promise.all(
                unreadNotifications.map(notification =>
                    NotificationService.markAsRead(notification.id)
                )
            );

            // Update Redux state
            dispatch(markAllAsRead());
            toast.success('Đã đánh dấu tất cả đã đọc', { id: tid });
        } catch (error) {
            console.error('Error marking all as read:', error);
            toast.error('Không thể đánh dấu tất cả đã đọc', { id: tid });
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-40 w-full px-4 md:px-6 py-2 bg-background-main/80 backdrop-blur-xl border-b border-border-main flex items-center justify-between"
        >
            {/* LEFT: Logo & Search */}
            <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard/feed')}>
                    <img src="/logo.png" className="h-9 w-auto object-contain flex-shrink-0" alt="Connect Logo" />
                </div>

                {/* Search Bar - Desktop */}
                <div className="hidden md:flex relative w-full max-w-[240px] lg:max-w-[320px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IconHome className="h-4 w-4 text-text-secondary opacity-0" /> {/* Spacer */}
                        <svg className="h-4 w-4 text-text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-border-main rounded-full leading-5 bg-surface-main text-text-main placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
                        placeholder="Tìm kiếm trên Connect..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
            </div>

            {/* CENTER: Navigation Links */}
            <div className="hidden md:flex items-center justify-center gap-1 lg:gap-8 flex-1">
                <NavItem
                    icon={<IconHome size={24} />}
                    active={!showNotifications && isActive('/dashboard/feed')}
                    onClick={() => {
                        navigate('/dashboard/feed');
                        setShowNotifications(false);
                    }}
                    tooltip="Trang chủ"
                />
                <NavItem
                    icon={<IconUsers size={24} />}
                    active={!showNotifications && isActive('/dashboard/friends')}
                    onClick={() => {
                        navigate('/dashboard/friends');
                        setShowNotifications(false);
                    }}
                    tooltip="Bạn bè"
                />
                <NavItem
                    icon={<IconHome className="rotate-180" size={24} style={{ transform: 'scaleX(-1)' }} />} // Using IconHome as placeholder for Group if needed or just IconUsers
                    label=""
                    // Better Icon for Groups?
                    customIcon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
                    active={!showNotifications && isActive('/dashboard/groups')}
                    onClick={() => {
                        navigate('/dashboard/groups');
                        setShowNotifications(false);
                    }}
                    tooltip="Nhóm"
                />
            </div>

            {/* RIGHT: User Actions */}
            <div className="flex items-center justify-end gap-2 md:gap-3 flex-1">

                {/* Mobile Search Icon */}
                <button
                    className="md:hidden p-2 rounded-full text-text-secondary hover:bg-surface-main transition-colors"
                    onClick={() => navigate('/search/members')}
                >
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        className={`p-2.5 rounded-full transition-colors relative ${showNotifications ? 'bg-primary/10 text-primary' : 'bg-surface-main text-text-main hover:bg-border-main'}`}
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            setShowUserMenu(false);
                        }}
                    >
                        <IconBell size={22} />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background-main">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 top-full mt-2 w-80 md:w-96 z-50 origin-top-right shadow-2xl rounded-2xl"
                            >
                                <NotificationList
                                    notifications={notifications}
                                    onMarkAsRead={handleMarkAsRead}
                                    onDelete={handleDelete}
                                    onMarkAllAsRead={handleMarkAllAsRead}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                    <button
                        onClick={() => {
                            setShowUserMenu(!showUserMenu);
                            setShowNotifications(false);
                        }}
                        className="flex items-center gap-2 p-1 pl-2 pr-1 rounded-full hover:bg-surface-main transition-colors border border-border-main ml-1"
                    >
                        <div className="bg-gradient-to-tr from-primary to-orange-400 p-[2px] rounded-full">
                            <img
                                src={userProfile?.currentAvatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                alt="User Avatar"
                                className="w-8 h-8 rounded-full object-cover border-2 border-background-main"
                            />
                        </div>
                    </button>

                    <AnimatePresence>
                        {showUserMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 top-full mt-2 w-64 bg-background-main border border-border-main rounded-xl shadow-xl overflow-hidden z-50 p-2"
                            >
                                <div className="p-3 mb-2 rounded-lg bg-surface-main">
                                    <p className="font-bold text-text-main truncate">
                                        {userProfile?.fullName || user?.username || "Người dùng"}
                                    </p>
                                    <p className="text-xs text-text-secondary truncate">
                                        {user?.email || "user@example.com"}
                                    </p>
                                    <Link to="/dashboard/my-profile" className="mt-2 text-xs font-semibold text-primary block hover:underline">
                                        Xem trang cá nhân
                                    </Link>
                                </div>

                                <DropdownItem
                                    icon={<IconSettings size={18} />}
                                    label="Cài đặt & Quyền riêng tư"
                                    onClick={() => {
                                        navigate('/dashboard/settings/privacy');
                                        setShowUserMenu(false);
                                    }}
                                />

                                <div className="h-px bg-border-main my-2" />

                                <DropdownItem
                                    icon={<IconLogout size={18} />}
                                    label="Đăng xuất"
                                    onClick={handleLogout}
                                    danger
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

// Reusable Nav Item Component with Hover Effects
const NavItem = ({ icon, label, active, onClick, badge, customIcon, tooltip }) => {
    return (
        <div className="relative group/tooltip">
            <button
                onClick={onClick}
                className={`relative flex items-center justify-center gap-2 p-3 lg:px-10 lg:py-3 rounded-xl transition-all duration-300
        ${active
                        ? 'text-primary'
                        : 'hover:bg-surface-main text-text-secondary hover:text-text-main'
                    }
      `}
            >
                <div className="relative">
                    {customIcon ? customIcon : icon}
                    {badge > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-background-main">
                            {badge > 99 ? '99+' : badge}
                        </span>
                    )}
                </div>
                {label && <span className="font-medium text-sm hidden lg:block">{label}</span>}

                {/* Active Indicator (Bottom Bar) */}
                {active && (
                    <motion.div
                        layoutId="navbar-active"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
            </button>
            {tooltip && (
                <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity z-50 pointer-events-none">
                    {tooltip}
                </span>
            )}
        </div>
    );
};

const DropdownItem = ({ icon, label, onClick, danger }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${danger
                    ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5'
                }
            `}
        >
            {icon}
            {label}
        </button>
    );
};

export default UserNavbar;
