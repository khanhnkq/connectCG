import {
  AlertTriangle,
  Eye,
  Pencil,
  Trash2,
  Search,
  Users,
  ChevronDown,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/layout-admin/AdminLayout";
import * as Yup from "yup";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";
import { findAllGroup, deleteGroup } from "../../services/groups/GroupService";
import GroupInspectorModal from "../../components/admin/GroupInspectorModal";

const AdminGroupsManager = () => {
  // 1. Initial State with Owners
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

  // Mock report data added to the second group
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await findAllGroup(0, 1000); // Fetch all for admin
        // Handle paginated response (Spring Boot Page<T>) or direct array
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
      message: `Bạn sắp vô hiệu hóa "${name}". Nhóm sẽ bị ẩn khỏi bảng tin công khai và hạn chế thành viên mới.`,
      onConfirm: async () => {
        try {
          await deleteGroup(id);
          setGroups(groups.filter((g) => g.id !== id));
          toast.success("Đã xóa nhóm thành công");
          // If expecting, close inspector too
          if (inspectingGroupId === id) {
            setInspectingGroupId(null);
          }
        } catch (error) {
          console.error("Failed to delete group:", error);
          toast.error("Không thể xóa nhóm");
        }
        setConfirmConfig({ ...confirmConfig, isOpen: false });
      },
    });
  };

  return (
    <AdminLayout
      title="Quản lý nhóm"
      activeTab="Groups"
      brandName="Social Admin"
    >
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-surface/20 p-6 rounded-2xl border border-border/50 shadow-xl">
          <div className="flex items-center gap-3">
            <Users className="text-primary size-8" />
            <h2 className="text-2xl font-black text-text-main tracking-tight">
              Danh sách cộng đồng
            </h2>
          </div>
          <div className="flex flex-wrap gap-4 w-full md:w-auto flex-1 max-w-2xl justify-end">
            <div className="relative min-w-[200px]">
              <select
                value={privacyFilter}
                onChange={(e) => setPrivacyFilter(e.target.value)}
                className="w-full bg-background/50 border border-border/50 rounded-xl py-2.5 px-4 text-sm text-text-main focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
              >
                <option value="">Tất cả quyền riêng tư</option>
                <option value="public">Công khai (Public)</option>
                <option value="private">Riêng tư (Private)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none size-4" />
            </div>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted size-4" />
              <input
                type="text"
                placeholder="Tìm kiếm nhóm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background/50 border border-border/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-text-main focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading && (
            <div className="col-span-full text-center py-12 text-text-muted animate-pulse">
              Đang tải dữ liệu...
            </div>
          )}

          {!loading && filteredGroups.length === 0 && (
            <div className="col-span-full text-center py-12 text-text-muted italic">
              Không tìm thấy nhóm nào
            </div>
          )}

          {!loading &&
            filteredGroups.map((group, index) => (
              <div
                key={group.id}
                className="bg-surface border border-border/50 rounded-3xl overflow-hidden group hover:border-primary/30 transition-all shadow-xl"
              >
                <div className="h-44 relative overflow-hidden">
                  <img
                    src={
                      group.image ||
                      `https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80`
                    }
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt=""
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80"></div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span
                      className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border backdrop-blur-md ${
                        group.privacy?.toLowerCase() === "public"
                          ? "bg-green-500/20 text-green-400 border-green-500/20"
                          : "bg-orange-500/20 text-orange-400 border-orange-500/20"
                      }`}
                    >
                      {group.privacy?.toLowerCase() === "public"
                        ? "CÔNG KHAI"
                        : "RIÊNG TƯ"}
                    </span>
                    {group.is_deleted && (
                      <span className="px-2.5 py-1 text-[9px] font-black uppercase rounded-lg bg-red-500 text-white border border-white/20">
                        Đã xóa
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-6 flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-[10px] text-white/60 font-black uppercase tracking-tighter leading-none">
                        Chủ sở hữu
                      </p>
                      <p className="text-xs text-white font-bold">
                        {group.ownerName}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-xl font-black text-text-main group-hover:text-primary transition-colors">
                        {group.name}
                      </h4>
                    </div>
                    <p className="text-xs text-text-secondary line-clamp-2 mt-2">
                      {group.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background/30 p-3 rounded-2xl border border-border/30">
                      <p className="text-[9px] text-text-muted font-black uppercase tracking-widest leading-none mb-1">
                        Ngày tạo
                      </p>
                      <p className="text-[11px] text-text-main font-black">
                        {group.createdAt
                          ? new Date(group.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div className="bg-background/30 p-3 rounded-2xl border border-border/30">
                      <p className="text-[9px] text-text-muted font-black uppercase tracking-widest leading-none mb-1">
                        Media ID
                      </p>
                      <p className="text-[11px] text-text-main font-black">
                        {group.cover_media_id || "None"}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border/30 flex justify-end items-center">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleInspect(group)}
                        className="p-2.5 hover:bg-background rounded-xl text-text-muted hover:text-text-main transition-all border border-transparent hover:border-border"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => handleDeactivate(group.id, group.name)}
                        className="p-2.5 hover:bg-red-500/10 rounded-xl text-text-muted hover:text-red-400 transition-all"
                        title="Xóa nhóm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Shared Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type="danger"
        onConfirm={confirmConfig.onConfirm}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        confirmText="Xác nhận"
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
