import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
            className="sticky top-0 z-40 w-full px-6 py-3 bg-white/5 dark:bg-black/10 backdrop-blur-xl border-b border-white/10 dark:border-white/5 flex items-center justify-between"
        >
            {/* Left Section: Page Title or Breadcrumbs (Optional) */}
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/dashboard/feed')}>
                <div className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20">
                    <img src="/logo.png" className="h-8 w-auto object-contain flex-shrink-0" alt="Connect Logo" />
                    <span className="font-bold text-lg bg-gradient-to-r from-[#f47b25] to-[#ea580c] bg-clip-text text-transparent hidden md:block whitespace-pre">
                        Connect CG
                    </span>
                </div>
            </div>

            {/* Right Section: Navigation Actions */}
            <div className="flex items-center gap-3">
                {/* Home Button */}
                <NavItem
                    icon={<IconHome size={22} />}
                    label="Trang chủ"
                    active={!showNotifications && isActive('/dashboard/feed')}
                    onClick={() => {
                        navigate('/dashboard/feed');
                        setShowNotifications(false);
                    }}
                />

                {/* Groups Management Button */}
                <NavItem
                    icon={<IconUsers size={22} />}
                    label="Quản lý nhóm"
                    active={!showNotifications && isActive('/dashboard/groups')}
                    onClick={() => {
                        navigate('/dashboard/groups');
                        setShowNotifications(false);
                    }}
                />

                {/* Notifications Button */}
                <div className="relative" ref={notificationRef}>
                    <NavItem
                        icon={<IconBell size={22} />}
                        label="Thông báo"
                        active={showNotifications}
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            setShowUserMenu(false);
                        }}
                        badge={unreadCount}
                    />

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 top-full mt-2 w-80 md:w-96 z-50 origin-top-right"
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

                {/* User Dropdown */}
                <div className="relative ml-2" ref={userMenuRef}>
                    <button
                        onClick={() => {
                            setShowUserMenu(!showUserMenu);
                            setShowNotifications(false);
                        }}
                        className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full hover:bg-white/10 transition-colors border border-white/5"
                    >
                        <img
                            src={userProfile?.currentAvatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <IconChevronDown size={16} className={`text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {showUserMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#1A120B] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-50 p-1"
                            >
                                <div className="p-3 border-b border-gray-100 dark:border-white/5 mb-1">
                                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                                        {userProfile?.fullName || user?.username || "Người dùng"}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {user?.email || "user@example.com"}
                                    </p>
                                </div>

                                <DropdownItem
                                    icon={<IconUser size={18} />}
                                    label="Trang cá nhân"
                                    onClick={() => {
                                        navigate('/dashboard/my-profile');
                                        setShowUserMenu(false);
                                    }}
                                />
                                <DropdownItem
                                    icon={<IconSettings size={18} />}
                                    label="Cài đặt quyền riêng tư"
                                    onClick={() => {
                                        navigate('/dashboard/settings/privacy');
                                        setShowUserMenu(false);
                                    }}
                                />

                                <div className="h-px bg-gray-100 dark:bg-white/5 my-1" />

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
const NavItem = ({ icon, label, active, onClick, badge }) => {
    return (
        <button
            onClick={onClick}
            className={`relative group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300
        ${active
                    ? 'bg-orange-500/10 text-orange-600 dark:text-orange-500'
                    : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300'
                }
      `}
        >
            <div className="relative">
                {icon}
                {badge > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-black">
                        {badge > 99 ? '99+' : badge}
                    </span>
                )}
            </div>
            <span className="font-medium text-sm hidden sm:block">{label}</span>

            {/* Active Indicator */}
            {active && (
                <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 rounded-xl bg-orange-500/10 border border-orange-500/20"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
        </button>
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
