import React, { useState, useEffect } from "react";
import {
  Users,
  Eye,
  Trash as Trash2,
  MagnifyingGlass as Search,
  CaretDown as ChevronDown,
} from "@phosphor-icons/react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layout-admin/AdminLayout";
import { findAllGroup, deleteGroup } from "../../services/groups/GroupService";
import GroupInspectorModal from "../../components/admin/GroupInspectorModal";
import {
  Card,
  Badge,
  Button,
  IconButton,
  ConfirmDialog,
  Skeleton,
  EmptyState,
} from "../../components/ui";

/**
 * Modern Flat Skeleton for Group Cards in Admin
 */
function GroupCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col h-full border-border-main">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-5 space-y-4 flex flex-col flex-1">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
        <div className="pt-4 border-t border-border-main flex justify-end gap-2 mt-auto">
          <Skeleton className="h-8 w-20 rounded-xl" />
          <Skeleton className="size-8 rounded-xl" />
        </div>
      </div>
    </Card>
  );
}

const AdminGroupsManager = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [privacyFilter, setPrivacyFilter] = useState(""); // '' | 'public' | 'private'
  const [inspectingGroupId, setInspectingGroupId] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const handleInspect = (group) => {
    setInspectingGroupId(group.id);
  };

  const closeInspector = () => {
    setInspectingGroupId(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await findAllGroup(0, 1000);
        const list = Array.isArray(response)
          ? response
          : response.content || [];
        setGroups(list);
      } catch (error) {
        console.error("Failed to fetch groups", error);
        toast.error("Không thể tải danh sách nhóm");
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredGroups = groups.filter(
    (group) =>
      (group.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (privacyFilter === "" || group.privacy?.toLowerCase() === privacyFilter),
  );

  const handleDeactivate = (id, name) => {
    setConfirmConfig({
      isOpen: true,
      title: "Vô hiệu hóa nhóm?",
      message: `Bạn sắp vô hiệu hóa "${name}". Nhóm sẽ bị ẩn khỏi danh sách công khai và hạn chế thành viên mới.`,
      onConfirm: async () => {
        try {
          await deleteGroup(id);
          setGroups((prev) => prev.filter((g) => g.id !== id));
          toast.success("Đã xóa nhóm thành công");
          if (inspectingGroupId === id) {
            setInspectingGroupId(null);
          }
        } catch (error) {
          console.error("Failed to delete group:", error);
          toast.error("Không thể xóa nhóm");
        }
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <AdminLayout
      title="Quản lý nhóm"
      activeTab="Groups"
      brandName="Connect Admin"
    >
      <div className="p-6 md:p-8 space-y-6">
        {/* Header & Filter Card */}
        <Card className="p-6 bg-surface-main border-border-main">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Users size={24} weight="bold" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-text-main tracking-tight">
                  Danh sách cộng đồng
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Quản lý và kiểm duyệt các hội nhóm đang hoạt động trên hệ thống ({groups.length} nhóm)
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1 max-w-2xl justify-end">
              <div className="relative min-w-[180px]">
                <select
                  value={privacyFilter}
                  onChange={(e) => setPrivacyFilter(e.target.value)}
                  className="w-full bg-surface-subtle rounded-xl py-2.5 px-4 text-xs text-text-main focus:outline-none focus:border-border-strong appearance-none cursor-pointer font-semibold border border-border-main transition-colors"
                >
                  <option value="">Tất cả quyền riêng tư</option>
                  <option value="public">Công khai (Public)</option>
                  <option value="private">Riêng tư (Private)</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none size-3.5" />
              </div>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted size-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm nhóm theo tên, mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-surface-subtle rounded-xl py-2.5 pl-10 pr-4 text-xs text-text-main focus:outline-none focus:border-border-strong font-medium border border-border-main transition-colors"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <GroupCardSkeleton key={i} />
            ))
          ) : filteredGroups.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                icon={Users}
                title="Không tìm thấy nhóm nào"
                description={
                  searchTerm || privacyFilter
                    ? "Không có nhóm nào phù hợp với điều kiện lọc hiện tại."
                    : "Hệ thống chưa có nhóm nào được tạo."
                }
              />
            </div>
          ) : (
            filteredGroups.map((group, index) => (
              <Card
                key={group.id}
                className="overflow-hidden flex flex-col h-full border-border-main hover:border-border-strong transition-colors"
              >
                {/* Cover Image */}
                <div className="h-44 relative overflow-hidden bg-surface-subtle">
                  <img
                    src={
                      group.image ||
                      `https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80`
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    alt=""
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-main via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <Badge
                      variant={
                        group.privacy?.toLowerCase() === "public"
                          ? "success"
                          : "warning"
                      }
                      size="sm"
                    >
                      {group.privacy?.toLowerCase() === "public"
                        ? "Công khai"
                        : "Riêng tư"}
                    </Badge>
                    {group.is_deleted && (
                      <Badge variant="danger" size="sm">
                        Đã xóa
                      </Badge>
                    )}
                  </div>

                  {/* Owner Label */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-2.5">
                    <div className="size-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider leading-none">
                        Chủ nhóm
                      </p>
                      <p className="text-xs text-white font-bold truncate max-w-[180px]">
                        {group.ownerName || "Chưa rõ"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-4 flex flex-col flex-1">
                  <div>
                    <h4 className="text-base font-bold text-text-main line-clamp-1">
                      {group.name}
                    </h4>
                    <p className="text-xs text-text-secondary line-clamp-2 mt-1.5 leading-relaxed">
                      {group.description || "Chưa có mô tả cho nhóm này."}
                    </p>
                  </div>

                  {/* Info Cards */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="bg-surface-subtle p-3 rounded-xl border border-border-main">
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1">
                        Ngày tạo
                      </p>
                      <p className="text-xs text-text-main font-semibold">
                        {group.createdAt
                          ? new Date(group.createdAt).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </p>
                    </div>
                    <div className="bg-surface-subtle p-3 rounded-xl border border-border-main">
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1">
                        Ảnh bìa ID
                      </p>
                      <p className="text-xs text-text-main font-semibold truncate">
                        {group.cover_media_id || "Mặc định"}
                      </p>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-4 border-t border-border-main flex justify-end items-center gap-2 mt-auto">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleInspect(group)}
                    >
                      Chi tiết
                    </Button>
                    <IconButton
                      variant="danger"
                      size="sm"
                      icon={Trash2}
                      aria-label="Xóa nhóm"
                      onClick={() => handleDeactivate(group.id, group.name)}
                    />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type="danger"
        onConfirm={confirmConfig.onConfirm}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        confirmText="Xác nhận"
        cancelText="Hủy bỏ"
      />

      {/* Group Inspector Modal */}
      {inspectingGroupId && (
        <GroupInspectorModal
          groupId={inspectingGroupId}
          onClose={closeInspector}
          actionLabel="Vô hiệu hóa nhóm"
          onAction={(group) => handleDeactivate(group.id, group.name)}
        />
      )}
    </AdminLayout>
  );
};

export default AdminGroupsManager;
