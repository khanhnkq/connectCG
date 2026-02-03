import {
  Shield,
  AlertTriangle,
  Inbox,
  ShieldCheck,
  CheckCircle2,
  Trash2,
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
  const [giveStrike, setGiveStrike] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  useEffect(() => {
    const handlePostEvent = (e) => {
      const { action, post, postId } = e.detail;
      if (action === "DELETED" && postId) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      } else if (action === "CREATED" && post) {
        // If a post is approved (CREATED in terms of newsfeed), remove from moderation lists
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
      }
    };

    window.addEventListener("postEvent", handlePostEvent);
    return () => window.removeEventListener("postEvent", handlePostEvent);
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response =
        activeTab === "pending"
          ? await postService.getPendingHomepagePosts()
          : await postService.getAuditHomepagePosts();
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching homepage posts:", error);
      toast.error("Không thể tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (postId) => {
    try {
      await postService.approvePost(postId);
      toast.success("Đã duyệt bài viết thành công!");
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (error) {
      toast.error("Không thể duyệt bài viết");
    }
  };

  const handleDelete = (id) => {
    setGiveStrike(false);
    setConfirmConfig({
      isOpen: true,
      title: "Xác nhận xóa bài viết?",
      message:
        "Bạn muốn xử lý bài viết này như thế nào? Xóa thường sẽ không tính gậy vi phạm cho người dùng.",
      onConfirm: async () => {
        try {
          setIsProcessing(true);
          if (giveStrike) {
            await postService.rejectPost(id, true);
            toast.success("Đã xóa và cộng gậy vi phạm thành công");
          } else {
            await postService.deletePost(id);
            toast.success("Đã xóa bài viết thành công");
          }
          setPosts((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
          const errorMsg = error.response?.data?.message || "Thao tác thất bại (Có thể bài viết đã được xử lý)";
          toast.error(errorMsg);
        } finally {
          setIsProcessing(false);
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        }
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

          <div className="flex bg-background/50 p-1.5 rounded-2xl border border-border/30">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === "pending"
                ? "bg-red-500 text-white shadow-lg"
                : "text-text-muted hover:text-white"
                }`}
            >
              <Shield size={14} />
              Chờ Duyệt
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === "audit"
                ? "bg-orange-500 text-white shadow-lg"
                : "text-text-muted hover:text-white"
                }`}
            >
              <AlertTriangle size={14} />
              Kiểm Tra Lại
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-surface/20 rounded-2xl border border-border/50 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-background/60 border-b border-border/50 text-[10px] uppercase font-black text-text-muted tracking-widest">
              <tr>
                <th className="px-6 py-5">Người đăng</th>
                <th className="px-6 py-5">Nội dung</th>
                <th className="px-6 py-5">AI Status</th>
                {activeTab === "audit" && (
                  <th className="px-6 py-5 text-orange-400">Người duyệt</th>
                )}
                <th className="px-6 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 text-sm">
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
                    className="hover:bg-surface/40 transition-colors text-text-main group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden border border-border/50">
                          {post.authorAvatar ? (
                            <img src={post.authorAvatar} alt="" />
                          ) : (
                            post.authorFullName?.charAt(0) || "U"
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs">
                              {post.authorFullName || "Anonymous"}
                            </span>
                            {post.authorViolationCount > 0 && (
                              <span className="px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-500 text-[9px] font-black border border-red-500/20">
                                {post.authorViolationCount} 🚩
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-text-muted opacity-60 italic">
                            {post.visibility}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 max-w-sm">
                      <p className="truncate text-text-muted italic">
                        "{post.content}"
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-2 py-0.5 text-[9px] font-black uppercase rounded border w-fit ${post.aiStatus === "TOXIC"
                            ? "bg-red-500/20 text-red-500 border-red-500/40"
                            : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                            }`}
                        >
                          {post.aiStatus}
                        </span>
                        {post.aiReason && (
                          <span className="text-[8px] text-text-muted italic truncate max-w-[100px]">
                            {post.aiReason}
                          </span>
                        )}
                      </div>
                    </td>
                    {activeTab === "audit" && (
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-xs font-bold text-orange-600/80 dark:text-orange-400/80">
                          <ShieldCheck size={14} />
                          {post.approvedByFullName || "System"}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-5 text-right flex justify-end gap-3">
                      {activeTab === "pending" && (
                        <button
                          onClick={() => handleApprove(post.id)}
                          className="size-9 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white transition-all rounded-xl flex items-center justify-center shadow-lg"
                          title="Phê duyệt"
                        >
                          <CheckCircle2 size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="size-9 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all rounded-xl flex items-center justify-center shadow-lg"
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

        {/* Shared Confirmation Modal */}
        <ConfirmModal
          isOpen={confirmConfig.isOpen}
          title={confirmConfig.title}
          message={confirmConfig.message}
          type="danger"
          onConfirm={confirmConfig.onConfirm}
          onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
          confirmText={giveStrike ? "Xóa & Tính Gậy" : "Xác nhận Xóa"}
          isLoading={isProcessing}
        >
          <div className="mt-4 p-4 rounded-2xl bg-background-dark/30 border border-border-dark/30">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="peer hidden"
                  checked={giveStrike}
                  onChange={(e) => setGiveStrike(e.target.checked)}
                />
                <div className="size-5 rounded-md border-2 border-border-dark group-hover:border-red-500/50 peer-checked:bg-red-500 peer-checked:border-red-500 transition-all flex items-center justify-center">
                  <AlertTriangle className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={12} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                  Cộng gậy vi phạm cho người dùng
                </span>
                <span className="text-[10px] text-text-muted italic">
                  Chỉ chọn nếu bài viết thực sự toxic/vi phạm tiêu chuẩn.
                </span>
              </div>
            </label>
          </div>
        </ConfirmModal>
      </div>
    </AdminLayout>
  );
};

export default MainFeedManager;
