import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  UsersThree,
  MagnifyingGlass as Search,
  CaretDown as ChevronDown,
  UserPlus,
  UserMinus,
  Prohibit as Ban,
  UserMinus as UserX,
  CaretLeft,
  CaretRight,
  ShieldCheck,
} from "@phosphor-icons/react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layout-admin/AdminLayout";
import {
  getAllUsers,
  updateUserRole,
  lockUser,
  deleteUser,
} from "../../services/admin/AdminUserService";
import {
  Card,
  Badge,
  Avatar,
  IconButton,
  ConfirmDialog,
  Skeleton,
  EmptyState,
} from "../../components/ui";

const AdminMembersManager = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState(""); // '' for all
  const sessionUser = useSelector((state) => state.auth.user);
  const currentUserId = sessionUser?.id ? Number(sessionUser.id) : null;
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
    confirmText: "Xác nhận",
  });

  const fetchUsers = useCallback(
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
          avatar: user.currentAvatarUrl || "",
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
          totalPages: data.totalPages || 0,
          totalElements: data.totalElements || 0,
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
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [pagination.currentPage, searchTerm, roleFilter, fetchUsers]);

  // Realtime user event listener
  useEffect(() => {
    const handleUserEvent = (e) => {
      const payload = e.detail;
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
    };

    window.addEventListener("userEvent", handleUserEvent);
    return () => window.removeEventListener("userEvent", handleUserEvent);
  }, []);

  const handleRoleUpdate = (userId, userName, currentRole) => {
    const newRole = currentRole === "USER" ? "ADMIN" : "USER";
    const roleLabel =
      newRole === "ADMIN" ? "Quản trị viên" : "Người dùng thường";

    setConfirmConfig({
      isOpen: true,
      title: "Thay đổi vai trò?",
      message: `Bạn có chắc muốn đổi vai trò của người dùng "${userName}" thành ${roleLabel}?`,
      type: "info",
      confirmText: "Đổi vai trò",
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
      confirmText: actionLabel,
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
      confirmText: "Xóa tài khoản",
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
      title="Quản lý thành viên"
      activeTab="Users"
      brandName="Connect Admin"
    >
      <div className="p-6 md:p-8 space-y-6">
        {/* Search & Filter Header */}
        <Card className="p-6 bg-surface-main border-0 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-primary/10 border-0 flex items-center justify-center text-primary shrink-0">
                <UsersThree size={24} weight="bold" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-text-main tracking-tight">
                  Danh sách thành viên
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Quản lý phân quyền và kiểm soát trạng thái tài khoản người dùng ({pagination.totalElements} tài khoản)
                </p>
              </div>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1 max-w-2xl justify-end">
              <div className="relative min-w-[180px]">
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setPagination((prev) => ({ ...prev, currentPage: 0 }));
                  }}
                  className="w-full bg-surface-subtle rounded-xl py-2.5 px-4 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-primary/40 appearance-none cursor-pointer font-semibold border-0 transition-colors"
                >
                  <option value="">Tất cả vai trò</option>
                  <option value="USER">Người dùng (USER)</option>
                  <option value="ADMIN">Quản trị viên (ADMIN)</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none size-3.5" />
              </div>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted size-4" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, username, email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPagination((prev) => ({ ...prev, currentPage: 0 }));
                  }}
                  className="w-full bg-surface-subtle rounded-xl py-2.5 pl-10 pr-4 text-xs text-text-main focus:outline-none focus:ring-1 focus:ring-primary/40 font-medium border-0 transition-colors"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Flat Users Table */}
        <Card className="overflow-hidden border-0 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-subtle text-[11px] uppercase font-bold text-text-secondary tracking-wider border-0">
                <tr>
                  <th className="px-5 py-3.5 w-16">STT</th>
                  <th className="px-5 py-3.5">Thông tin thành viên</th>
                  <th className="px-5 py-3.5">Vai trò</th>
                  <th className="px-5 py-3.5">Trạng thái</th>
                  <th className="px-5 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-transparent">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-5 py-4">
                        <Skeleton className="h-4 w-6" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Skeleton rounded="full" className="size-10 shrink-0" />
                          <div className="space-y-1.5 flex-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Skeleton className="size-8 rounded-xl" />
                          <Skeleton className="size-8 rounded-xl" />
                          <Skeleton className="size-8 rounded-xl" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : members.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8">
                      <EmptyState
                        icon={UsersThree}
                        title="Không tìm thấy người dùng"
                        description={
                          searchTerm || roleFilter
                            ? "Không có tài khoản nào phù hợp với bộ lọc tìm kiếm."
                            : "Hiện tại chưa có người dùng nào trong danh sách."
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  members.map((member, index) => (
                    <tr
                      key={member.id}
                      className="hover:bg-surface-subtle/50 transition-colors text-text-main group"
                    >
                      <td className="px-5 py-4 font-mono text-xs text-text-muted">
                        {pagination.currentPage * pagination.pageSize + index + 1}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={member.avatar}
                            name={member.name}
                            size="md"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-sm truncate text-text-main">
                              {member.name}
                            </p>
                            <p className="text-xs text-text-muted font-medium truncate">
                              @{member.username} {member.email ? `• ${member.email}` : ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          variant={member.role === "ADMIN" ? "primary" : "default"}
                          size="sm"
                        >
                          {member.role === "ADMIN" ? "Quản trị viên" : "Thành viên"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col items-start gap-1">
                          <Badge
                            variant={
                              member.status === "Active"
                                ? "success"
                                : member.status === "Deleted"
                                ? "default"
                                : "danger"
                            }
                            size="sm"
                          >
                            {member.status === "Active"
                              ? "Hoạt động"
                              : member.status === "Deleted"
                              ? "Đã xóa"
                              : "Bị khóa"}
                          </Badge>
                          {member.lockedUntil &&
                            new Date(member.lockedUntil) > new Date() && (
                              <span className="text-[10px] text-orange-600 font-semibold bg-orange-500/10 px-1.5 py-0.5 rounded">
                                Mở: {new Date(member.lockedUntil).toLocaleDateString("vi-VN")}
                              </span>
                            )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {member.id !== currentUserId && (
                            <IconButton
                              variant="secondary"
                              size="sm"
                              icon={member.role === "USER" ? UserPlus : UserMinus}
                              aria-label={
                                member.role === "USER"
                                  ? "Nâng cấp lên ADMIN"
                                  : "Hạ cấp xuống USER"
                              }
                              onClick={() =>
                                handleRoleUpdate(
                                  member.id,
                                  member.name,
                                  member.role,
                                )
                              }
                            />
                          )}
                          <IconButton
                            variant={member.status === "Banned" ? "primary" : "secondary"}
                            size="sm"
                            icon={member.status === "Banned" ? ShieldCheck : Ban}
                            aria-label="Khóa hoặc mở khóa tài khoản"
                            onClick={() => toggleStatus(member.id, member.status)}
                          />
                          <IconButton
                            variant="danger"
                            size="sm"
                            icon={UserX}
                            aria-label="Xóa tài khoản"
                            onClick={() => handleDelete(member.id, member.name)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Flat Pagination Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-surface-subtle/30 px-5 py-3 border-0">
            <div className="text-text-muted text-xs font-medium">
              Trang{" "}
              <span className="text-text-main font-bold">
                {pagination.currentPage + 1}
              </span>{" "}
              /{" "}
              <span className="text-text-main font-bold">
                {pagination.totalPages || 1}
              </span>{" "}
              ({pagination.totalElements} tài khoản)
            </div>
            <div className="flex items-center gap-2">
              <IconButton
                variant="secondary"
                size="sm"
                icon={CaretLeft}
                aria-label="Trang trước"
                disabled={pagination.currentPage === 0 || loading}
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: Math.max(0, prev.currentPage - 1),
                  }))
                }
              />
              <span className="text-xs font-bold text-text-main px-3 py-1 bg-surface-main rounded-xl border-0 shadow-sm">
                {pagination.currentPage + 1}
              </span>
              <IconButton
                variant="secondary"
                size="sm"
                icon={CaretRight}
                aria-label="Trang sau"
                disabled={
                  pagination.currentPage >= pagination.totalPages - 1 || loading
                }
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage + 1,
                  }))
                }
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type || "danger"}
        confirmText={confirmConfig.confirmText || "Xác nhận"}
        cancelText="Hủy bỏ"
        onConfirm={confirmConfig.onConfirm}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </AdminLayout>
  );
};

export default AdminMembersManager;
