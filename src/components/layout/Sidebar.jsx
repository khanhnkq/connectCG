import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  Settings,
  ShieldCheck,
  Users2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../../redux/slices/userSlice";
import { findMyGroups } from "../../services/groups/GroupService";

export default function SidebarComponent() {
  const { user } = useSelector((state) => state.auth);
  const { profile: userProfile } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  // Groups Logic
  const [managedGroups, setManagedGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [showManaged, setShowManaged] = useState(true);
  const [showJoined, setShowJoined] = useState(true);

  useEffect(() => {
    const userId = user?.id || user?.userId || user?.sub;
    if (userId && !userProfile) {
      dispatch(fetchUserProfile(userId));
    }
  }, [user, userProfile, dispatch]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!user?.id) return;
      try {
        const response = await findMyGroups(0, 50); // Fetch up to 50 groups
        const groups = response.content || response || [];

        // Filter groups
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
        console.error("Failed to fetch sidebar groups", err);
      }
    };
    fetchGroups();
  }, [user?.id]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        const rolesRaw = decoded.role || "";
        const hasAdminRole = rolesRaw.includes("ROLE_ADMIN");
        setIsAdmin(hasAdminRole);
      } catch (error) {
        setIsAdmin(false);
      }
    }
  }, []);

  const menuItems = [
    // Redundant items removed (Home, Friends, Groups, Search)
    // Sidebar now serves for utilities and admin features
  ];

  // Add Admin Panel if user is admin
  if (isAdmin) {
    menuItems.push({
      label: "Admin Panel",
      href: "/admin-website/groups",

      icon: <Settings className="text-text-secondary h-5 w-5 flex-shrink-0" />,
    });
  }

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10 bg-background-main border-r border-border-main transition-colors duration-300">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col gap-2">
            {menuItems.map((link, idx) => (
              <div key={idx}>
                <SidebarLink link={link} />
              </div>
            ))}

            <div className="my-2 border-t border-border-main/50" />

            {/* Managed Groups */}
            {managedGroups.length > 0 && (
              <div className="mb-2">
                {open ? (
                  <button
                    onClick={() => setShowManaged(!showManaged)}
                    className="flex items-center justify-between w-full px-2 py-2 text-xs font-bold text-text-secondary uppercase tracking-wider hover:text-primary transition-colors mb-1 group"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-primary" />
                      Quản lý nhóm
                    </span>
                    {showManaged ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowManaged(!showManaged)}
                    className="flex items-center justify-center w-full py-2 hover:bg-surface-main/50 rounded-md transition-colors"
                    title="Quản lý nhóm"
                  >
                    <ShieldCheck size={18} className="text-primary" />
                  </button>
                )}

                {showManaged &&
                  managedGroups.map((group) => (
                    <SidebarLink
                      key={group.id}
                      link={{
                        label: group.name,
                        href: `/dashboard/groups/${group.id}`,
                        icon: (
                          <div className="relative">
                            <img
                              src={
                                group.image ||
                                "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000"
                              }
                              alt={group.name}
                              className="h-6 w-6 !rounded-lg object-cover flex-shrink-0 border border-border-main"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-[2px] border border-background-main">
                              <ShieldCheck size={8} className="text-white" />
                            </div>
                          </div>
                        ),
                      }}
                    />
                  ))}
              </div>
            )}

            {/* Joined Groups */}
            {joinedGroups.length > 0 && (
              <div className="mb-2">
                {open ? (
                  <button
                    onClick={() => setShowJoined(!showJoined)}
                    className="flex items-center justify-between w-full px-2 py-2 text-xs font-bold text-text-secondary uppercase tracking-wider hover:text-primary transition-colors mb-1 group"
                  >
                    <span className="flex items-center gap-2">
                      <Users2 size={14} className="text-primary" />
                      Nhóm tham gia
                    </span>
                    {showJoined ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowJoined(!showJoined)}
                    className="flex items-center justify-center w-full py-2 hover:bg-surface-main/50 rounded-md transition-colors"
                    title="Nhóm tham gia"
                  >
                    <Users2 size={18} className="text-primary" />
                  </button>
                )}

                {showJoined &&
                  joinedGroups.map((group) => (
                    <SidebarLink
                      key={group.id}
                      link={{
                        label: group.name,
                        href: `/dashboard/groups/${group.id}`,
                        icon: (
                          <img
                            src={
                              group.image ||
                              "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000"
                            }
                            alt={group.name}
                            className="h-6 w-6 !rounded-lg object-cover flex-shrink-0 border border-border-main"
                          />
                        ),
                      }}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
