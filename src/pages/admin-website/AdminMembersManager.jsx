import {
  Users,
  Search,
  ChevronDown,
  ShieldCheck,
  ShieldAlert,
  User,
  UserPlus,
  UserMinus,
  Ban,
  UserX,
  ChevronLeft,
  ChevronRight,
  ShieldHalf,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/layout-admin/AdminLayout";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";
import {
  getAllUsers,
  updateUserRole,
  lockUser,
  deleteUser,
} from "../../services/admin/AdminUserService";

const AdminMembersManager = () => {
  // 1. Initial State with Roles
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState(""); // '' for all
  const [currentUserId, setCurrentUserId] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    today: new Date(),
    pageSize: 5,
  });
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "danger",
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUserId(Number(user.id)); // Ensure it's a number for strict comparison
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  const fetchUsers = React.useCallback(
    async (page, keyword, role) => {
      try {
        setLoading(true);
        const data = await getAllUsers({
          page,
          keyword,
          role,
          size: pagination.pageSize,
        });
        const content = data.content || [];
        const mappedMembers = content.map((user) => ({
          id: user.userId,
          name: user.fullName || user.username,
          username: user.username,
          email: user.email,
          avatar:
            user.currentAvatarUrl ||
            `https://ui-avatars.com/api/?name=${user.username}&background=random`,
          status:
            user.isDeleted || user.is_deleted
              ? "Deleted"
              : user.isLocked
              ? "Banned"
              : "Active",
          role: user.role,
          joinedDate: "N/A",
          lockedUntil: user.lockedUntil,
          permanentLocked: user.permanentLocked || false,
        }));
        setMembers(mappedMembers);
        setPagination((prev) => ({
          ...prev,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
        }));
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Không thể tải danh sách người dùng");
      } finally {
        setLoading(false);
      }
    },
    [pagination.pageSize],
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(pagination.currentPage, searchTerm, roleFilter);
    }, 300); // Debounce name search

    return () => clearTimeout(delayDebounceFn);
  }, [pagination.currentPage, searchTerm, roleFilter, fetchUsers]);

  // 3. Listen for Realtime User Events (Locks)
  useEffect(() => {
    const handleUserEvent = (e) => {
      const payload = e.detail;
      // Update specific user in the list if they exist
      setMembers((prev) =>
        prev.map((member) => {
          if (member.id === payload.userId) {
            return {
              ...member,
              permanentLocked: payload.permanentLocked,
              status: payload.permanentLocked
                ? "Banned (Perm)"
                : payload.lockedUntil &&
                  new Date(payload.lockedUntil) > new Date()
                ? "Locked (Temp)"
                : member.status,
            };
          }
          return member;
        }),
      );

      // If it's a major lock update, maybe refresh the whole list to be safe
      // fetchUsers(pagination.currentPage, searchTerm, roleFilter);
    };

    window.addEventListener("userEvent", handleUserEvent);
    return () => window.removeEventListener("userEvent", handleUserEvent);
  }, [fetchUsers]);

  const handleRoleUpdate = (userId, userName, currentRole) => {
    const newRole = currentRole === "USER" ? "ADMIN" : "USER";
    const roleLabel =
      newRole === "ADMIN" ? "Quản trị viên" : "Người dùng thường";

    setConfirmConfig({
      isOpen: true,
      title: "Thay đổi vai trò?",
      message: `Bạn có chắc muốn đổi vai trò của người dùng "${userName}" thành ${roleLabel}?`,
      type: "info",
      onConfirm: async () => {
        try {
          await updateUserRole(userId, newRole);
          toast.success("Cập nhật vai trò thành công");
          fetchUsers(pagination.currentPage, searchTerm, roleFilter);
        } catch (error) {
          const errorMsg =
            error.response?.data?.message ||
            error.message ||
            "Không thể cập nhật vai trò";
          toast.error(errorMsg);
        }
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const toggleStatus = (id, currentStatus) => {
    const actionLabel = currentStatus === "Active" ? "Khóa" : "Mở khóa";

    setConfirmConfig({
      isOpen: true,
      title: `${actionLabel} tài khoản?`,
      message: `Bạn có chắc muốn ${actionLabel.toLowerCase()} người dùng này? Họ sẽ ${
        currentStatus === "Active"
          ? "không thể truy cập"
          : "có thể truy cập lại"
      } vào hệ thống.`,
      type: currentStatus === "Active" ? "danger" : "info",
      onConfirm: async () => {
        try {
          await lockUser(id);
          toast.success(`Đã ${actionLabel.toLowerCase()} tài khoản thành công`);
          fetchUsers(pagination.currentPage, searchTerm, roleFilter);
        } catch (error) {
          console.error("Failed to lock/unlock user:", error);
          toast.error("Không thể thay đổi trạng thái người dùng");
        }
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleDelete = (id, name) => {
    setConfirmConfig({
      isOpen: true,
      title: "Xóa tài khoản?",
      message: `Bạn có chắc muốn xóa tài khoản "${name}"? Tài khoản sẽ được chuyển vào thùng rác.`,
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteUser(id);
          toast.success("Đã chuyển tài khoản vào thùng rác");
          fetchUsers(pagination.currentPage, searchTerm, roleFilter);
        } catch (error) {
          console.error("Failed to delete user:", error);
          toast.error("Không thể xóa người dùng");
        }
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <AdminLayout
      title="Quản lý người dùng"
      activeTab="Users"
      brandName="Social Admin"
    >
      <div className="p-8 space-y-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-surface-main p-6 rounded-2xl border border-border-main shadow-sm">
          <div className="flex items-center gap-3">
            <Users className="text-primary size-8" />
            <h2 className="text-2xl font-extrabold text-text-main tracking-tight">
              Danh sách người dùng
            </h2>
          </div>
          <div className="flex flex-wrap gap-4 w-full md:w-auto flex-1 max-w-2xl justify-end">
            <div className="relative min-w-[200px]">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, currentPage: 0 }));
                }}
                className="w-full bg-background-main rounded-2xl py-3 px-5 text-sm text-text-main focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all appearance-none cursor-pointer font-bold border border-border-main"
              >
                <option value="">Tất cả vai trò</option>
                <option value="USER">Người dùng (USER)</option>
                <option value="ADMIN">Quản trị viên (ADMIN)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none size-4" />
            </div>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted size-4" />
              <input
                type="text"
                placeholder="Tìm theo tên, email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPagination((prev) => ({ ...prev, currentPage: 0 }));
                }}
                className="w-full bg-background-main rounded-2xl py-3 pl-12 pr-5 text-sm text-text-main focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-medium border border-border-main"
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-surface-main rounded-2xl overflow-hidden shadow-sm border border-border-main">
          <table className="w-full text-left">
            <thead className="bg-background-main text-xs uppercase font-bold text-text-secondary tracking-wider border-b border-border-main">
              <tr>
                <th className="px-6 py-4">STT</th>
                <th className="px-6 py-4">Thông tin</th>
                <th className="px-6 py-4">Vai trò</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {members.map((member, index) => (
                <tr
                  key={member.id}
                  className="hover:bg-surface-main/60 transition-colors text-text-main group border-b border-border-main/50 last:border-0"
                >
                  <td className="px-6 py-4 font-mono text-sm text-text-muted">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-2xl overflow-hidden shrink-0 group-hover:scale-105 transition-all shadow-sm border border-border-main">
                        <img
                          src={member.avatar}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate text-text-main">
                          {member.name}
                        </p>
                        <p className="text-xs text-text-secondary font-medium">
                          @{member.username}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border flex items-center gap-2 w-fit ${
                        member.role === "ADMIN"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-surface-main text-text-secondary border-border-main"
                      }`}
                    >
                      {member.role === "ADMIN" ? (
                        <ShieldCheck size={14} />
                      ) : (
                        <User size={14} />
                      )}
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start gap-1">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-lg border w-fit ${
                          member.status === "Active"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-red-500/10 text-red-500 border-red-500/20"
                        }`}
                      >
                        {member.status}
                      </span>
                      {member.lockedUntil &&
                        new Date(member.lockedUntil) > new Date() && (
                          <span className="text-xs text-orange-500 font-medium bg-orange-500/10 px-2 py-0.5 rounded-md">
                            Mở:{" "}
                            {new Date(member.lockedUntil).toLocaleDateString()}
                          </span>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {member.id !== currentUserId && (
                        <button
                          onClick={() =>
                            handleRoleUpdate(
                              member.id,
                              member.name,
                              member.role,
                            )
                          }
                          className="size-10 hover:bg-primary hover:text-white rounded-xl text-text-secondary flex items-center justify-center transition-all bg-surface-main border border-border-main shadow-sm"
                          title={
                            member.role === "USER"
                              ? "Nâng cấp lên ADMIN"
                              : "Hạ cấp xuống USER"
                          }
                        >
                          {member.role === "USER" ? (
                            <UserPlus size={18} />
                          ) : (
                            <UserMinus size={18} />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => toggleStatus(member.id, member.status)}
                        className="size-10 hover:bg-orange-500 hover:text-white rounded-xl text-text-secondary flex items-center justify-center transition-all bg-surface-main border border-border-main shadow-sm"
                        title="Khóa/Mở khóa tài khoản"
                      >
                        {member.status === "Banned" ? (
                          <ShieldCheck size={18} />
                        ) : (
                          <Ban size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(member.id, member.name)}
                        className="size-10 hover:bg-red-500 hover:text-white rounded-xl text-text-secondary flex items-center justify-center transition-all bg-surface-main border border-border-main shadow-sm"
                        title="Xóa vĩnh viễn"
                      >
                        <UserX size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center bg-surface-main p-4 border-t border-border-main">
          <div className="text-text-secondary text-sm font-medium pl-2">
            Hiển thị trang{" "}
            <span className="text-text-main font-bold">
              {pagination.currentPage + 1}
            </span>{" "}
            /{" "}
            <span className="text-text-main font-bold">
              {pagination.totalPages || 1}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage - 1,
                }))
              }
              disabled={pagination.currentPage === 0 || loading}
              className="size-10 flex items-center justify-center bg-background-main border border-border-main rounded-xl text-text-secondary hover:text-primary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <div className="rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </button>
            <div className="h-10 px-4 flex items-center justify-center bg-background-main border border-border-main rounded-xl text-sm font-bold text-text-main shadow-sm min-w-[100px]">
              Trang {pagination.currentPage + 1} / {pagination.totalPages || 1}
            </div>
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage + 1,
                }))
              }
              disabled={
                pagination.currentPage >= pagination.totalPages - 1 || loading
              }
              className="size-10 flex items-center justify-center bg-background-main border border-border-main rounded-xl text-text-secondary hover:text-primary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Shared Confirmation Modal */}
        <ConfirmModal
          isOpen={confirmConfig.isOpen}
          title={confirmConfig.title}
          message={confirmConfig.message}
          type={confirmConfig.type || "danger"}
          onConfirm={confirmConfig.onConfirm}
          onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminMembersManager;
