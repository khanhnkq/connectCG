import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconArrowLeft,
  IconHome,
  IconMessage,
  IconUsers,
  IconUserPlus,
  IconHeart,
  IconSearch,
  IconBell,
  IconSettings
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { fetchUserProfile } from '../../redux/slices/userSlice';
import { getMyNotifications } from '../../services/NotificationService';

export default function SidebarComponent() {
  const { user } = useSelector((state) => state.auth);
  const { profile: userProfile } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    const fetchNotificationsSync = async () => {
        try {
            const data = await getMyNotifications();
            setNotifications(data || []);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };
    fetchNotificationsSync();
  }, []);

  useEffect(() => {
    const userId = user?.id || user?.userId || user?.sub;
    if (userId && !userProfile) {
      dispatch(fetchUserProfile(userId));
    }
  }, [user, userProfile, dispatch]);

  const [isAdmin, setIsAdmin] = useState(false);

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

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [

    {
      label: "Trang chủ",
      href: "/dashboard/feed",
      icon: <IconHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Tin nhắn",
      href: "/dashboard/chat",
      icon: <IconMessage className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Nhóm",
      href: "/dashboard/groups",
      icon: <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Lời mời kết bạn",
      href: "/dashboard/requests",
      icon: <IconUserPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Gợi ý kết bạn",
      href: "/dashboard/suggestions",
      icon: <IconHeart className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Tìm bạn mới",
      href: "/search/members",
      icon: <IconSearch className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Thông báo",
      href: "/dashboard/feed",
      icon: (
        <div className="relative">
             <IconBell className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
             {notifications.some(n => !n.isRead) && <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>}
        </div>
      ),
    },
  ];

  // Add Admin Panel if user is admin
  if (isAdmin) {
      menuItems.push({
          label: "Admin Panel",
          href: "/admin-website/groups",
          icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      });
  }

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10 bg-background-light dark:bg-background-dark border-r border-[#342418]">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {menuItems.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
            
             <SidebarLink
                link={{
                label: "Đăng xuất",
                onClick: handleLogout,
                icon: <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
                }}
            />
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: userProfile?.fullName || user?.username || "StartUP",
              href: "/dashboard/my-profile",
              icon: (
                <img
                  src={userProfile?.currentAvatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  className="h-7 w-7 min-w-7 min-h-7 flex-shrink-0 !rounded-full object-cover aspect-square"
                  width={28}
                  height={28}
                  alt="Avatar"
                />
              ),
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

export const Logo = () => {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-5 w-6 bg-primary rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Connect CG
      </motion.span>
    </div>
  );
};

export const LogoIcon = () => {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-5 w-6 bg-primary rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </div>
  );
};
