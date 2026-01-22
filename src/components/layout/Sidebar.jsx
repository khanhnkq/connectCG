import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from "react";

export default function Sidebar() {
    const location = useLocation();
      const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      content: "Sarah Jenkins đã thích bài viết của bạn",
      time: "2 phút trước",
      read: false,
    },
    {
      id: 2,
      content: "David Kim đã bình luận về bài viết của bạn",
      time: "1 giờ trước",
      read: false,
    },
    {
      id: 3,
      content: "Bạn có một lời mời kết bạn mới",
      time: "Hôm qua",
      read: true,
    },
  ]);

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

    const isActive = (path) => {
        return location.pathname === path;
    };

    const menuItems = [
        { icon: 'home', label: 'Home', path: '/dashboard/feed' },
        { icon: 'person', label: 'Profile', path: '/dashboard/profile/public' },
        { icon: 'explore', label: 'Explore', path: '/dashboard/explore' }, // Mapping to groups for now as explore
        { icon: 'groups', label: 'Groups', path: '/dashboard/groups' },
        { icon: 'chat_bubble', label: 'Messages', path: '/dashboard/chat', badge: '3' },
        { icon: 'favorite', label: 'Matches', path: '/dashboard/newsfeed-1' }, // Placeholder
        { icon: 'star', label: 'VIP Upgrade', path: '#', highlight: true },
    ];

    return (
        <aside className="w-72 hidden lg:flex flex-col border-r border-[#342418] bg-background-dark h-full overflow-y-auto shrink-0 z-20">
            <div className="p-6 pb-2">
                <div className="flex gap-4 items-center mb-8">
                    <div className="bg-center bg-no-repeat bg-cover rounded-full size-12 shadow-lg ring-2 ring-[#342418]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAUO2YNLAxc1Nl_nCWaGx0Dwt8BIkrV0WsFtsI9ePfpuH2QDYaR2IL1U-BCix40iXmHOlV6rzlHb2YzzlKUEpD183YkjDBCAQtHPFoSaXz638Vjta7H-NlTtKESwQOh_CcHQs-rhd6cbbiyxlQVatQS90HHg710X2WFSTAS7LkytHfywWdbhdy-IVBZk0wtKYnjblM6Vy6IA3R_7kOjPY04ZFIVnhosSED60xtTRmy2ylVAGG80CffMYIEPaZ6iQHq6uonwSSfKBJw")' }}></div>
                    <div className="flex flex-col">
                        <h1 className="text-white text-lg font-bold leading-tight">Alex Doe</h1>
                        <Link to="/dashboard/profile" className="text-text-secondary text-sm font-medium cursor-pointer hover:text-primary transition-colors flex items-center gap-1">
                            Edit Profile <span className="material-symbols-outlined text-[14px]">edit</span>
                        </Link>
                    </div>

                    {/* Notification Button */}
                    <div className="relative ml-auto" ref={dropdownRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="size-10 rounded-full bg-[#342418] hover:bg-[#3e2b1d] text-white flex items-center justify-center transition-all relative"
                >
                  <span className="material-symbols-outlined">notifications</span>

                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-[#342418]"></span>
                  )}
                </button>

                {/* DROPDOWN */}
                {showNotifications && (
                  <div className="fixed top-[72px] left-[260px] w-80 bg-[#1E140D] border border-[#342418] rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#342418]">
                      <h4 className="text-white font-bold text-sm">Thông báo</h4>
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
                          className={`group px-4 py-3 flex gap-3 items-start border-b border-[#342418] hover:bg-[#2A1D15] transition-colors ${!n.read ? "bg-[#2A1D15]" : ""
                            }`}
                        >

                          {!n.read && (
                            <span className="mt-2 size-2 bg-primary rounded-full"></span>
                          )}

                          <div className="flex-1">
                            <p className={`text-sm ${n.read ? "text-text-secondary" : "text-white font-medium"}`}>
                              {n.content}
                            </p>
                            <span className="text-[11px] text-text-secondary">
                              {n.time}
                            </span>
                          </div>

                          <div className="flex flex-col gap-1">
                            {!n.read && (
                              <button
                                onClick={() =>
                                  setNotifications((prev) =>
                                    prev.map((x) =>
                                      x.id === n.id ? { ...x, read: true } : x
                                    )
                                  )
                                }
                                className="text-primary text-[11px] hover:underline"
                              >
                                Đã xem
                              </button>
                            )}
                            <button
                              onClick={() =>
                                setNotifications((prev) =>
                                  prev.filter((x) => x.id !== n.id)
                                )
                              }
                              className="text-red-400 text-[11px] hover:underline"
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
                    const isVip = item.label === 'VIP Upgrade';

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
                                <span className={`material-symbols-outlined ${!active && 'group-hover:scale-110'} transition-transform ${isVip ? 'text-yellow-500 group-hover:rotate-12' : ''}`}>
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
            </nav>
            <div className="p-6 mt-auto">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#342418] to-[#493222] rounded-2xl p-5 flex flex-col gap-3 border border-[#493222] shadow-xl">
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-primary/20 rounded-full blur-xl"></div>
                    <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-1">
                        <span className="material-symbols-outlined">diamond</span>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-base">Go Premium</h3>
                        <p className="text-text-secondary text-xs mt-1 leading-relaxed">Boost your profile and see who likes you instantly.</p>
                    </div>
                    <button className="w-full mt-2 bg-primary hover:bg-orange-600 text-[#231810] font-bold text-sm py-3 rounded-full transition-all shadow-lg shadow-orange-500/20 transform hover:-translate-y-0.5">
                        Get VIP Access
                    </button>
                </div>
            </div>
        </aside>
    );
}
