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
  IconSettings,
  IconUserSearch,
  IconUserHeart
} from "@tabler/icons-react";

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { fetchUserProfile } from '../../redux/slices/userSlice';


export default function SidebarComponent() {
  const { user } = useSelector((state) => state.auth);
  const { profile: userProfile } = useSelector((state) => state.user);
  const { items: notifications, unreadCount } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);



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
      icon: <IconHome className="text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Tin nhắn",
      href: "/dashboard/chat",
      icon: <IconMessage className="text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Nhóm",
      href: "/dashboard/groups",
      icon: <IconUsers className="text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Lời mời kết bạn",
      href: "/dashboard/requests",
      icon: <IconUserPlus className="text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Bạn bè",
      href: "/dashboard/friends",
      icon: <IconUserHeart className="text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Tìm bạn mới",
      href: "/search/members",
      icon: <IconSearch className="text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Tìm kiếm bạn bè",
      href: "/dashboard/friends-search",
      icon: <IconUserSearch className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },


  ];

  // Add Admin Panel if user is admin
  if (isAdmin) {
    menuItems.push({
      label: "Admin Panel",
      href: "/admin-website/groups",
      icon: <IconSettings className="text-neutral-200 h-5 w-5 flex-shrink-0" />
    });
  }

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10 bg-background-dark border-r border-[#342418]">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mt-4 flex flex-col gap-2">
            {menuItems.map((link, idx) => (
              <div key={idx}>
                <SidebarLink link={link} />

              </div>
            ))}

            <SidebarLink
              link={{
                label: "Đăng xuất",
                onClick: handleLogout,

                icon: <IconArrowLeft className="text-neutral-200 h-5 w-5 flex-shrink-0" />,
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
