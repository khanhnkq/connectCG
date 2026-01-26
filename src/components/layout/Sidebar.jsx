import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from "react";
import { getMyNotifications, markAsRead, deleteNotification } from '../../services/NotificationService';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import UserProfileService from '../../services/user/UserProfileService';
import { fetchUserProfile } from '../../redux/slices/userSlice';

import { logout } from '../../redux/slices/authSlice'; // [NEW] Import action logout
export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);
  const { profile: userProfile, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const dropdownRef = useRef(null);


  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    // Chỉ gọi API nếu chưa có dữ liệu profile trong Redux
    const userId = user?.id || user?.userId || user?.sub;
    
    console.log("Sidebar Debug:", { 
      user, 
      userId, 
      userProfile, 
      hasToken: !!localStorage.getItem('accessToken') 
    });

    if (userId && !userProfile) {
      dispatch(fetchUserProfile(userId));
    }
  }, [user, userProfile, dispatch]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        const rolesRaw = decoded.role || '';
        const hasAdminRole = rolesRaw.includes('ROLE_ADMIN');
        setIsAdmin(hasAdminRole);
      } catch (error) {
        setIsAdmin(false);
      }
    }
  }, []);


  const fetchNotifications = async () => {
    try {
      const data = await getMyNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logout()); // Xóa state và localStorage
    navigate('/login'); // Chuyển hướng về trang đăng nhập
    toast.success('Đã đăng xuất'); // Optional: Import toast nếu muốn hiện thông báo
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const formatNotificationTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = async (n) => {
    // 1. Mark as read if it's new
    if (!n.isRead) {
      await handleMarkAsRead(n.id);
    }

    // 2. Navigate based on type
    // Group-related notifications are no longer handled here.

    setShowNotifications(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { icon: 'home', label: 'Trang chủ', path: '/dashboard/feed' },
    { icon: 'chat_bubble', label: 'Tin nhắn', path: '/dashboard/chat', badge: '3' },
    { icon: 'groups', label: 'Nhóm', path: '/dashboard/groups' },
    { icon: 'person_add', label: 'Lời mời kết bạn', path: '/dashboard/requests', badge: '4' },
    { icon: 'favorite', label: 'Gợi ý kết bạn', path: '/dashboard/suggestions' },
    { icon: 'person_search', label: 'Tìm bạn mới', path: '/search/members' },
    { icon: 'person', label: 'Hồ sơ', path: '/dashboard/my-profile' },
  ];

  return (
    <aside className="w-72 hidden lg:flex flex-col border-r border-[#342418] bg-background-dark h-full overflow-y-auto shrink-0 z-20">
      <div className="p-6 pb-2">
        <div className="flex gap-4 items-center mb-8">
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full size-12 shadow-lg ring-2 ring-[#342418]"
            style={{ backgroundImage: `url("${userProfile?.currentAvatarUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}")` }}
          ></div>
          <div className="flex flex-col">
            <h1 className="text-white text-lg font-bold leading-tight">
              {userProfile?.fullName || userProfile?.username || user?.username || 'Đang tải...'}
            </h1>
            <Link to="/dashboard/my-profile" className="text-text-secondary text-sm font-medium cursor-pointer hover:text-primary transition-colors flex items-center gap-1">
              Xem hồ sơ <span className="material-symbols-outlined text-sm">visibility</span>
            </Link>
          </div>

          {/* Notification Button */}
          <div className="relative ml-auto" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="size-10 rounded-full bg-[#342418] hover:bg-[#3e2b1d] text-white flex items-center justify-center transition-all relative"
            >
              <span className="material-symbols-outlined">notifications</span>

              {notifications.some(n => !n.isRead) && (
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-[#342418]"></span>
              )}
            </button>


            {/* DROPDOWN */}
            {showNotifications && (
              <div className="fixed top-[72px] left-[260px] w-80 bg-[#1E140D] border border-[#342418] rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[#342418] flex justify-between items-center">
                  <h4 className="text-white font-bold text-sm">Thông báo</h4>
                  {notifications.length > 0 && (
                    <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{notifications.filter(n => !n.isRead).length} Mới</span>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 && (
                    <p className="text-text-secondary text-sm p-4 text-center">
                      Không có thông báo nào
                    </p>
                  )}

                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`group px-4 py-3 flex gap-3 items-start border-b border-[#342418] hover:bg-[#2A1D15] transition-colors cursor-pointer ${!n.isRead ? "bg-[#2A1D15]" : ""
                        }`}
                    >
                      <img
                        src={n.actorAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                        alt=""
                        className="size-10 rounded-full object-cover mt-1"
                      />

                      <div className="flex-1">
                        <p className={`text-sm ${n.isRead ? "text-text-secondary" : "text-white font-medium italic"}`}>
                          {n.content}
                        </p>
                        <span className="text-[11px] text-text-secondary">
                          {formatNotificationTime(n.createdAt)}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        {!n.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(n.id)}
                            className="text-primary text-[10px] uppercase font-black tracking-widest hover:underline"
                          >
                            Đã xem
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(n.id)}
                          className="text-red-400 text-[10px] uppercase font-black tracking-widest hover:underline"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      <nav className="flex-1 px-4 flex flex-col gap-2">
        {menuItems.map((item, index) => {
          const active = isActive(item.path);

          let className = "flex items-center gap-4 px-4 py-3.5 rounded-full transition-all group ";
          if (active) {
            className += "bg-primary/20 text-primary";
          } else {
            className += "text-text-secondary hover:bg-[#342418] hover:text-white";
          }
          if (item.badge || active) className += " justify-between";

          return (
            <Link key={index} to={item.path} className={className}>
              <div className="flex items-center gap-4">
                <span className={`material-symbols-outlined ${!active && 'group-hover:scale-110'} transition-transform`}>
                  {item.icon}
                </span>
                <span className="text-sm font-bold tracking-wide">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`${active ? 'bg-primary text-[#231810] shadow-orange-500/20 shadow-lg' : 'bg-[#342418] text-white border border-[#493222]'} text-xs font-extrabold px-2 py-0.5 rounded-full`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
        {/* Admin Panel Button */}
        {isAdmin && (
          <Link
            to="/admin-website/groups"
            className="flex items-center gap-4 px-4 py-3.5 rounded-full transition-all group bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 mb-3 mt-auto"
          >
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                admin_panel_settings
              </span>
              <span className="text-sm font-bold tracking-wide">Admin Panel</span>
            </div>
          </Link>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-4 px-4 py-3.5 rounded-full transition-all group text-text-secondary hover:bg-[#342418] hover:text-red-500 mb-6 ${!isAdmin ? 'mt-auto' : ''}`}
        >
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
              logout
            </span>
            <span className="text-sm font-bold tracking-wide">Đăng xuất</span>
          </div>
        </button>
      </nav>
    </aside>
  );
}
