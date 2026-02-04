import {
  Shield,
  AlertTriangle,
  Inbox,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/layout-admin/AdminLayout";
import postService from "../../services/PostService";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";

const MainFeedManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending"); // 'pending' or 'audit'
  // Pagination state
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

  useEffect(() => {
    setCurrentPage(0); // Reset to first page when tab changes
    fetchPosts(0);
  }, [activeTab]);

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handlePostEvent = (e) => {
      fetchPosts(currentPage);
    };
    window.addEventListener("postEvent", handlePostEvent);
    return () => window.removeEventListener("postEvent", handlePostEvent);
  }, [activeTab, currentPage]);

  const fetchPosts = React.useCallback(
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
        setPosts([]); // Ensure array on error
        console.error("Error fetching homepage posts:", error);
        toast.error("Không thể tải danh sách bài viết");
      } finally {
        setLoading(false);
      }
    },
    [activeTab],
  );

  useEffect(() => {
    fetchPosts();
  }, [activeTab, fetchPosts]);

  useEffect(() => {
    const handlePostEvent = () => {
      fetchPosts();
    };
    window.addEventListener("postEvent", handlePostEvent);
    return () => window.removeEventListener("postEvent", handlePostEvent);
  }, [fetchPosts]);

  const handleApprove = async (postId) => {
    try {
      await postService.approvePost(postId);
      toast.success("Đã duyệt bài viết thành công!");
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (error) {
      toast.error("Không thể duyệt bài viết" + error);
    }
  };

  const handleDelete = (id) => {
    setConfirmConfig({
      isOpen: true,
      postId: id,
      title: "Xóa bài viết?",
      message:
        "Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.",
      onConfirm: async () => {
        try {
          await postService.deletePost(id);
          toast.success("Đã xóa bài viết thành công");
          setPosts(posts.filter((p) => p.id !== id));
        } catch (error) {
          toast.error("Lỗi dữ liệu: Không thể xóa bài viết" + error);
        }
        setConfirmConfig({ ...confirmConfig, isOpen: false });
      },
    });
  };

  return (
    <AdminLayout
      title="Hộp thư Duyệt"
      activeTab="Content"
      brandName="Social Admin"
    >
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-text-main tracking-tight">
              {activeTab === "pending"
                ? "Hộp thư Chờ Duyệt"
                : "Hộp thư Kiểm Tra (Toxic)"}
            </h2>
            <p className="text-text-muted text-sm font-medium">
              {activeTab === "pending"
                ? "Xử lý các bài viết bị AI đánh dấu vi phạm hoặc lỗi kiểm tra"
                : "Các bài viết ĐÃ DUYỆT nhưng AI phát hiện nội dung nhạy cảm"}
            </p>
          </div>

          <div className="flex bg-background-main p-1 rounded-xl border border-border-main">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "pending"
                  ? "bg-primary text-[#231810] shadow-sm"
                  : "text-text-secondary hover:text-text-main"
              }`}
            >
              <Shield size={14} />
              Chờ Duyệt
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "audit"
                  ? "bg-green-500 text-white shadow-sm"
                  : "text-text-secondary hover:text-text-main"
              }`}
            >
              <AlertTriangle size={14} />
              Kiểm Tra Lại
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-surface-main rounded-2xl overflow-hidden shadow-sm border border-border-main">
          <table className="w-full text-left">
            <thead className="bg-background-main text-xs uppercase font-bold text-text-secondary tracking-wider border-b border-border-main">
              <tr>
                <th className="px-6 py-4">Người đăng</th>
                <th className="px-6 py-4">Nội dung</th>
                <th className="px-6 py-4">Lý do AI</th>
                {activeTab === "audit" && (
                  <th className="px-6 py-4 text-orange-400">Người duyệt</th>
                )}
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-text-muted"
                  >
                    Đang tải danh sách...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-15 text-center text-text-muted"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Inbox size={48} className="opacity-20" />
                      <p>Hiện tại không có mục nào cần xử lý.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-surface-main/60 transition-colors text-text-main group border-b border-border-main/50 last:border-0"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black overflow-hidden shadow-sm border border-border-main">
                          {post.authorAvatar ? (
                            <img src={post.authorAvatar} alt="" />
                          ) : (
                            post.authorFullName?.charAt(0) || "U"
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-text-main">
                            {post.authorFullName || "Anonymous"}
                          </span>
                          <span className="text-xs text-text-secondary opacity-60 italic">
                            {post.visibility}
                          </span>
                          {post.authorLockedUntil &&
                            new Date(post.authorLockedUntil) > new Date() && (
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[10px] bg-red-500/10 text-red-500 px-1 rounded font-bold uppercase">
                                  Locked
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-sm">
                      <p className="truncate text-text-secondary italic text-sm">
                        "{post.content}"
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-3 py-1 text-xs font-bold uppercase rounded-lg border w-fit ${
                            post.aiStatus === "TOXIC"
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                          }`}
                        >
                          {post.aiStatus}
                        </span>
                        {post.aiReason && (
                          <span className="text-xs text-text-secondary italic max-w-[150px] truncate">
                            {post.aiReason}
                          </span>
                        )}
                      </div>
                    </td>
                    {activeTab === "audit" && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-orange-500/80">
                          <ShieldCheck size={14} />
                          {post.approvedByFullName || "System"}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                      {activeTab === "pending" && (
                        <button
                          onClick={() => handleApprove(post.id)}
                          className="size-10 bg-surface-main hover:bg-green-500 text-green-500 hover:text-white transition-all rounded-xl flex items-center justify-center shadow-sm border border-border-main hover:border-transparent"
                          title="Phê duyệt"
                        >
                          <CheckCircle2 size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="size-10 bg-surface-main hover:bg-red-500 text-red-500 hover:text-white transition-all rounded-xl flex items-center justify-center shadow-sm border border-border-main hover:border-transparent"
                        title="Xóa vĩnh viễn"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center bg-surface/20 p-6 rounded-2xl border border-border/50">
          <div className="text-text-muted text-xs font-bold">
            Hiển thị <span className="text-text-main">{posts.length}</span> trên{" "}
            <span className="text-text-main">{totalElements}</span> bài viết
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0 || loading}
              className="p-2 bg-background border border-border/50 rounded-lg text-text-muted hover:text-text-main disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center px-4 bg-background border border-border/50 rounded-lg text-[10px] font-black text-text-main uppercase tracking-widest">
              Trang {currentPage + 1} / {totalPages || 1}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
              }
              disabled={currentPage >= totalPages - 1 || loading}
              className="p-2 bg-background border border-border/50 rounded-lg text-text-muted hover:text-text-main disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
          type="danger"
          onConfirm={confirmConfig.onConfirm}
          onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
          confirmText="Xác nhận Xóa"
        />
      </div>
    </AdminLayout>
  );
};

export default MainFeedManager;
