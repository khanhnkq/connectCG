import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  Settings,
  LogOut,
  ShieldCheck,
  Users2,
  ChevronRight,
  ChevronDown,
  Moon,
  Sun,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// import { logout } from "../../services/AuthService"; // REMOVED
import { logout } from "../../redux/slices/authSlice"; // ADDED
// import { toggleTheme } from "../../redux/slices/themeSlice"; // REMOVED (Previous step)
import { useTheme } from "../../context/ThemeContext";
import { findMyGroups } from "../../services/groups/GroupService";

export default function MobileMenuDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile: userProfile } = useSelector((state) => state.user);
  // const { isDarkMode } = useSelector((state) => state.theme); // REMOVED
  const { theme, toggleTheme } = useTheme(); // ADDED
  const isDarkMode = theme === "dark"; // ADDED

  // Groups Logic
  const [managedGroups, setManagedGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [showManaged, setShowManaged] = useState(true);
  const [showJoined, setShowJoined] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);

  // Check Admin Role
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        const rolesRaw = decoded.role || "";
        setIsAdmin(rolesRaw.includes("ROLE_ADMIN"));
      } catch (error) {
        setIsAdmin(false);
      }
    }
  }, []);

  // Fetch Groups
  useEffect(() => {
    const fetchGroups = async () => {
      if (!user?.id) return;
      try {
        const response = await findMyGroups(0, 50);
        const groups = response.content || response || [];

        const managed = [];
        const joined = [];

        groups.forEach((g) => {
          const isManager =
            g.ownerId === user.id || g.currentUserRole === "ADMIN";
          if (isManager) managed.push(g);
          else joined.push(g);
        });

        setManagedGroups(managed);
        setJoinedGroups(joined);
      } catch (err) {
        console.error("Failed to fetch menu groups", err);
      }
    };
    if (isOpen) {
      fetchGroups();
    }
  }, [user?.id, isOpen]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    onClose();
  };

  const handleToggleTheme = () => {
    toggleTheme();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm md:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-[80%] max-w-sm bg-surface-main z-[70] shadow-2xl overflow-y-auto md:hidden border-l border-border-main"
          >
            {/* Header */}
            <div className="p-4 border-b border-border-main flex items-center justify-between sticky top-0 bg-surface-main/95 backdrop-blur z-10">
              <h2 className="text-xl font-bold text-text-main">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-background-main text-text-secondary transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4 space-y-6 pb-24">
              {/* User Profile Card */}
              <Link
                to={`/dashboard/member/${user?.id}`}
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-xl bg-background-main border border-border-main shadow-sm active:scale-95 transition-transform"
              >
                <img
                  src={
                    userProfile?.currentAvatarUrl ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  className="w-12 h-12 rounded-full object-cover border border-border-main"
                  alt="Profile"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-text-main truncate">
                    {userProfile?.fullName || user?.username}
                  </h3>
                </div>
              </Link>

              {/* Admin Link */}
              {isAdmin && (
                <Link
                  to="/admin-website/groups"
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 text-primary active:bg-primary/10 transition-colors"
                >
                  <Settings size={20} />
                  <span className="font-bold">Admin Panel</span>
                </Link>
              )}

              <hr className="border-border-main" />

              {/* Managed Groups */}
              {managedGroups.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowManaged(!showManaged)}
                    className="flex items-center justify-between w-full py-2 text-sm font-bold text-text-secondary uppercase tracking-wider hover:text-primary transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-primary" />
                      Quản lý nhóm
                    </span>
                    {showManaged ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>

                  <AnimatePresence>
                    {showManaged && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 mt-1 pl-2">
                          {managedGroups.map((group) => (
                            <Link
                              key={group.id}
                              to={`/dashboard/groups/${group.id}`}
                              onClick={onClose}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-background-main transition-colors group"
                            >
                              <img
                                src={
                                  group.image ||
                                  "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000"
                                }
                                className="w-8 h-8 rounded-lg object-cover border border-border-main"
                                alt={group.name}
                              />
                              <span className="text-sm font-medium text-text-main group-hover:text-primary truncate">
                                {group.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Joined Groups */}
              {joinedGroups.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowJoined(!showJoined)}
                    className="flex items-center justify-between w-full py-2 text-sm font-bold text-text-secondary uppercase tracking-wider hover:text-primary transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Users2 size={16} className="text-primary" />
                      Nhóm tham gia
                    </span>
                    {showJoined ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>

                  <AnimatePresence>
                    {showJoined && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 mt-1 pl-2">
                          {joinedGroups.map((group) => (
                            <Link
                              key={group.id}
                              to={`/dashboard/groups/${group.id}`}
                              onClick={onClose}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-background-main transition-colors group"
                            >
                              <img
                                src={
                                  group.image ||
                                  "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000"
                                }
                                className="w-8 h-8 rounded-lg object-cover border border-border-main"
                                alt={group.name}
                              />
                              <span className="text-sm font-medium text-text-main group-hover:text-primary truncate">
                                {group.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <hr className="border-border-main" />

              {/* Settings & Create Actions */}
              <div className="space-y-2">
                <button
                  onClick={handleToggleTheme}
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-background-main border border-transparent hover:border-border-main transition-all"
                >
                  <div className="p-2 rounded-full bg-surface-main border border-border-main">
                    {isDarkMode ? (
                      <Moon size={20} className="text-blue-400" />
                    ) : (
                      <Sun size={20} className="text-orange-500" />
                    )}
                  </div>
                  <span className="font-medium text-text-main">
                    {isDarkMode ? "Chế độ tối" : "Chế độ sáng"}
                  </span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-500/5 hover:text-red-600 border border-transparent hover:border-red-200 transition-all text-text-secondary"
                >
                  <div className="p-2 rounded-full bg-surface-main border border-border-main">
                    <LogOut size={20} />
                  </div>
                  <span className="font-medium">Đăng xuất</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
