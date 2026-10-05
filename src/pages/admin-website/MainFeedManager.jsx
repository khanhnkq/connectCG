import React, { useState, useEffect, useCallback } from "react";
import {
  Shield,
  Warning as AlertTriangle,
  Tray as Inbox,
  ShieldCheck,
  CheckCircle,
  Trash as Trash2,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import toast from "react-hot-toast";
import AdminLayout from "../../components/layout-admin/AdminLayout";
import postService from "../../services/PostService";
import {
  Card,
  Badge,
  Avatar,
  IconButton,
  ConfirmDialog,
  Skeleton,
  EmptyState,
} from "../../components/ui";

const MainFeedManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending"); // 'pending' or 'audit'
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const PAGE_SIZE = 10;

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const fetchPosts = useCallback(
    async (page = 0) => {
      try {
        setLoading(true);
        const response =
          activeTab === "pending"
            ? await postService.getPendingHomepagePosts(page, PAGE_SIZE)
            : await postService.getAuditHomepagePosts(page, PAGE_SIZE);

        const pageData = response.data;
        setPosts(pageData.content || []);
        setTotalPages(pageData.totalPages || 0);
        setTotalElements(pageData.totalElements || 0);
        setCurrentPage(page);
      } catch (error) {
        setPosts([]);
        console.error("Error fetching homepage posts:", error);
        toast.error("Không thể tải danh sách bài viết");
      } finally {
        setLoading(false);
      }
    },
    [activeTab],
  );

  useEffect(() => {
    setCurrentPage(0);
    fetchPosts(0);
  }, [activeTab, fetchPosts]);

  useEffect(() => {
    const handlePostEvent = () => {
      fetchPosts(currentPage);
    };
    window.addEventListener("postEvent", handlePostEvent);
    return () => window.removeEventListener("postEvent", handlePostEvent);
  }, [currentPage, fetchPosts]);

  const handleApprove = async (postId) => {
    try {
      await postService.approvePost(postId);
      toast.success("Đã duyệt bài viết thành công!");
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setTotalElements((prev) => Math.max(0, prev - 1));
    } catch (error) {
      toast.error("Không thể duyệt bài viết: " + error);
    }
  };

  const handleDelete = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Xóa bài viết?",
      message:
        "Bạn có chắc chắn muốn xóa bài viết này? Hành động này sẽ gỡ bỏ hoàn toàn bài viết khỏi hệ thống.",
      onConfirm: async () => {
        try {
          await postService.deletePost(id);
          toast.success("Đã xóa bài viết thành công");
          setPosts((prev) => prev.filter((p) => p.id !== id));
          setTotalElements((prev) => Math.max(0, prev - 1));
        } catch (error) {
          toast.error("Lỗi dữ liệu: Không thể xóa bài viết " + error);
        }
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <AdminLayout
      title="Nội dung & Bài viết"
      activeTab="Content"
      brandName="Connect Admin"
    >
      <div className="p-6 md:p-8 space-y-6">
        {/* Header & Tab Selector */}
        <Card className="p-6 bg-surface-main border-border-main">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Shield size={24} weight="bold" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-text-main tracking-tight">
                  {activeTab === "pending"
                    ? "Hộp thư chờ duyệt"
                    : "Hộp thư kiểm tra lại (AI Flagged)"}
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  {activeTab === "pending"
                    ? "Kiểm duyệt các bài viết bị hệ thống AI đánh dấu nghi vấn vi phạm"
                    : "Rà soát các bài viết đã duyệt nhưng phát hiện dấu hiệu nhạy cảm"}
                </p>
              </div>
            </div>

            {/* Pill Tab Switcher */}
            <div className="flex bg-surface-subtle p-1 rounded-xl border border-border-main shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("pending")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === "pending"
                    ? "bg-primary text-white"
                    : "text-text-muted hover:text-text-main"
                }`}
              >
                <Shield size={14} />
                <span>Chờ duyệt</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("audit")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === "audit"
                    ? "bg-primary text-white"
                    : "text-text-muted hover:text-text-main"
                }`}
              >
                <AlertTriangle size={14} />
                <span>Kiểm tra lại</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Content Table */}
        <Card className="overflow-hidden border-border-main">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-subtle text-[11px] uppercase font-bold text-text-secondary tracking-wider border-b border-border-main">
                <tr>
                  <th className="px-5 py-3.5">Người đăng</th>
                  <th className="px-5 py-3.5">Nội dung bài viết</th>
                  <th className="px-5 py-3.5">Cảnh báo AI</th>
                  {activeTab === "audit" && (
                    <th className="px-5 py-3.5">Người duyệt</th>
                  )}
                  <th className="px-5 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-border-main">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Skeleton rounded="full" className="size-10 shrink-0" />
                          <div className="space-y-1.5">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="h-4 w-64" />
                      </td>
                      <td className="px-5 py-4">
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </td>
                      {activeTab === "audit" && (
                        <td className="px-5 py-4">
                          <Skeleton className="h-4 w-24" />
                        </td>
                      )}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Skeleton className="size-8 rounded-xl" />
                          <Skeleton className="size-8 rounded-xl" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={activeTab === "audit" ? 5 : 4} className="p-8">
                      <EmptyState
                        icon={Inbox}
                        title="Không có mục nào cần xử lý"
                        description={
                          activeTab === "pending"
                            ? "Hiện tại không có bài viết nào đang chờ kiểm duyệt."
                            : "Không có bài viết nào trong danh sách kiểm tra lại."
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  posts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-surface-subtle/50 transition-colors text-text-main group"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={post.authorAvatar}
                            name={post.authorFullName || "User"}
                            size="md"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-sm truncate text-text-main">
                              {post.authorFullName || "Người dùng ẩn danh"}
                            </p>
                            <span className="text-xs text-text-muted font-medium">
                              {post.visibility || "PUBLIC"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 max-w-sm">
                        <p className="line-clamp-2 text-text-secondary text-xs leading-relaxed font-medium">
                          "{post.content}"
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col items-start gap-1">
                          <Badge
                            variant={post.aiStatus === "TOXIC" ? "danger" : "warning"}
                            size="sm"
                          >
                            {post.aiStatus || "Cảnh báo"}
                          </Badge>
                          {post.aiReason && (
                            <span className="text-[11px] text-text-muted truncate max-w-[160px]">
                              {post.aiReason}
                            </span>
                          )}
                        </div>
                      </td>
                      {activeTab === "audit" && (
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
                            <ShieldCheck size={14} className="text-primary" />
                            <span>{post.approvedByFullName || "Hệ thống"}</span>
                          </div>
                        </td>
                      )}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {activeTab === "pending" && (
                            <IconButton
                              variant="secondary"
                              size="sm"
                              icon={CheckCircle}
                              aria-label="Phê duyệt bài viết"
                              onClick={() => handleApprove(post.id)}
                            />
                          )}
                          <IconButton
                            variant="danger"
                            size="sm"
                            icon={Trash2}
                            aria-label="Xóa bài viết vi phạm"
                            onClick={() => handleDelete(post.id)}
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
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-surface-subtle/30 px-5 py-3 border-t border-border-main">
            <div className="text-text-muted text-xs font-medium">
              Hiển thị <span className="text-text-main font-bold">{posts.length}</span>{" "}
              trên <span className="text-text-main font-bold">{totalElements}</span> bài viết
            </div>
            <div className="flex items-center gap-2">
              <IconButton
                variant="secondary"
                size="sm"
                icon={CaretLeft}
                aria-label="Trang trước"
                disabled={currentPage === 0 || loading}
                onClick={() => fetchPosts(Math.max(0, currentPage - 1))}
              />
              <span className="text-xs font-bold text-text-main px-3 py-1 bg-surface-main rounded-xl border border-border-main">
                {currentPage + 1} / {totalPages || 1}
              </span>
              <IconButton
                variant="secondary"
                size="sm"
                icon={CaretRight}
                aria-label="Trang sau"
                disabled={currentPage >= totalPages - 1 || loading}
                onClick={() => fetchPosts(currentPage + 1)}
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
        type="danger"
        confirmText="Xác nhận xóa"
        cancelText="Hủy bỏ"
        onConfirm={confirmConfig.onConfirm}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </AdminLayout>
  );
};

export default MainFeedManager;
