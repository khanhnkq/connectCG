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
    pageSize: 10,
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(pagination.currentPage, searchTerm, roleFilter);
    }, 300); // Debounce name search

    return () => clearTimeout(delayDebounceFn);
  }, [pagination.currentPage, searchTerm, roleFilter]);

  const fetchUsers = async (page, keyword, role) => {
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
  };

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
    const action = currentStatus === "Active" ? "Ban" : "Unban";
    const actionLabel = currentStatus === "Active" ? "Khóa" : "Mở khóa";

    setConfirmConfig({
      isOpen: true,
      title: `${actionLabel} tài khoản?`,
      message: `Bạn có chắc muốn ${actionLabel.toLowerCase()} người dùng này? Họ sẽ ${currentStatus === "Active"
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-surface-dark/20 p-6 rounded-2xl border border-border-dark/50 shadow-xl">
          <div className="flex items-center gap-3">
            <Users className="text-primary size-8" />
            <h2 className="text-2xl font-black text-white tracking-tight">
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
                className="w-full bg-background-dark/50 border border-border-dark/50 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
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
                className="w-full bg-background-dark/50 border border-border-dark/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-surface-dark/20 rounded-2xl border border-border-dark/50 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-background-dark/60 border-b border-border-dark/50 text-[10px] uppercase font-black text-text-muted tracking-[0.15em]">
              <tr>
                <th className="px-6 py-5">STT</th>
                <th className="px-6 py-5">Thông tin</th>
                <th className="px-6 py-5">Vai trò</th>
                <th className="px-6 py-5">Trạng thái</th>
                <th className="px-6 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark/30 text-sm">
              {members.map((member, index) => (
                <tr
                  key={member.id}
                  className="hover:bg-surface-dark/40 transition-colors text-white/90 group"
                >
                  <td className="px-6 py-5 font-mono text-[10px] text-text-muted">
                    {index + 1}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl overflow-hidden border border-border-dark/50 shrink-0 group-hover:border-primary/50 transition-all">
                        <img
                          src={member.avatar}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold truncate">{member.name}</p>
                        <p className="text-[10px] text-text-muted uppercase font-bold tracking-tighter">
                          {member.username}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border flex items-center gap-1.5 w-fit ${
                        member.role === "ADMIN"
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700"
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
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border ${member.status === "Active"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                          }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right space-x-2">
                      {member.id !== currentUserId && (
                        <button
                          onClick={() =>
                            handleRoleUpdate(member.id, member.name, member.role)
                          }
                          className="p-2 hover:bg-primary/10 rounded-xl text-text-muted hover:text-primary transition-all"
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
                        className="p-2 hover:bg-background-dark rounded-xl text-text-muted hover:text-orange-400 transition-all"
                        title="Toggle Access"
                      >
                        {member.status === "Banned" ? (
                          <ShieldCheck size={18} />
                        ) : (
                          <Ban size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(member.id, member.name)}
                        className="p-2 hover:bg-red-500/10 rounded-xl text-text-muted hover:text-red-400 transition-all"
                        title="Purge Identity"
                      >
                        <UserX size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center bg-surface-dark/20 p-6 rounded-2xl border border-border-dark/50">
          <div className="text-text-muted text-xs font-bold">
            Hiển thị <span className="text-white">{members.length}</span> trên{" "}
            <span className="text-white">{pagination.totalElements}</span> người
            dùng
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage - 1,
                }))
              }
              disabled={pagination.currentPage === 0 || loading}
              className="p-2 bg-background-dark border border-border-dark/50 rounded-lg text-text-muted hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center px-4 bg-background-dark border border-border-dark/50 rounded-lg text-[10px] font-black text-white uppercase tracking-widest">
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
              className="p-2 bg-background-dark border border-border-dark/50 rounded-lg text-text-muted hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={20} />
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
