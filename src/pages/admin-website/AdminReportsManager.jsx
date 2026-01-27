import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout-admin/AdminLayout";
import reportService from "../../services/ReportService";
import userService from "../../services/UserService";
import postService from "../../services/PostService";
import { findById as findGroupById, deleteGroup } from "../../services/groups/GroupService";
import toast from "react-hot-toast";

const TABS = {
  USER: "Báo cáo người dùng",
  GROUP: "Báo cáo nhóm",
  POST: "Báo cáo bài viết",
};

const statusMap = {
  PENDING: {
    label: "Chờ xử lý",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20"
  },
  UNDER_REVIEW: {
    label: "Đang xem xét",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20"
  },
  RESOLVED: {
    label: "Đã giải quyết",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20"
  },
};

const AdminReportsManagement = () => {
  const [activeTab, setActiveTab] = useState("USER");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    report: null,
    targetData: null,
    loading: false,
  });

  // Confirm Dialog State
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'danger'
  });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await reportService.getReports();
      setReports(res.data || []);
    } catch (e) {
      console.error(e);
      toast.error("Không tải được danh sách báo cáo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports.filter(
    (r) => r.targetType === activeTab
  );

  const activeCount = filteredReports.filter(
    (r) => r.status !== "RESOLVED"
  ).length;

  const handleShowDetail = async (report) => {
    setDetailModal({ isOpen: true, report, targetData: null, loading: true });
    try {
      let data = null;
      if (report.targetType === "USER") {
        const res = await userService.getUserById(report.targetId);
        data = res.data;
      } else if (report.targetType === "GROUP") {
        data = await findGroupById(report.targetId);
      } else if (report.targetType === "POST") {
        const res = await postService.getPostById(report.targetId);
        data = res.data;
      }
      setDetailModal(prev => ({ ...prev, targetData: data, loading: false }));
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải thông tin chi tiết");
      setDetailModal(prev => ({ ...prev, loading: false }));
    }
  };

  const closeDetailModal = () => {
    setDetailModal({ isOpen: false, report: null, targetData: null, loading: false });
  };

  // --- ACTIONS ---

  const handleResolveReport = async (reportId) => {
    try {
      await reportService.updateReportStatus(reportId, "RESOLVED");
      toast.success("Đã đánh dấu báo cáo là đã giải quyết");
      fetchReports();
      closeDetailModal();
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  const onBanUser = async (userId, reportId) => {
    try {
      await userService.banUser(userId);
      toast.success(`Đã khóa tài khoản người dùng #${userId}`);
      if (reportId) await handleResolveReport(reportId);
      else fetchReports();
    } catch (error) {
      toast.error("Lỗi khi khóa tài khoản");
    }
  };

  const onDeleteGroup = async (groupId, reportId) => {
    try {
      await deleteGroup(groupId);
      toast.success(`Đã xóa/khóa nhóm #${groupId}`);
      if (reportId) await handleResolveReport(reportId);
      else fetchReports();
    } catch (error) {
      toast.error("Lỗi khi xóa nhóm");
    }
  };

  const onDeletePost = async (postId, reportId) => {
    try {
      await postService.deletePost(postId);
      toast.success(`Đã xóa bài viết #${postId}`);
      if (reportId) await handleResolveReport(reportId);
      else fetchReports();
    } catch (error) {
      toast.error("Lỗi khi xóa bài viết");
    }
  };

  const confirmAction = (action, title, message) => {
    setConfirmConfig({
      isOpen: true,
      title,
      message,
      onConfirm: async () => {
        await action();
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
      },
      type: 'danger'
    });
  };

  return (
    <AdminLayout
      title="Quản lý báo cáo"
      activeTab="Reports"
      brandName="AdminPanel"
    >
      <div className="p-8 space-y-6 relative min-h-screen">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              Quản lý báo cáo
              <span className="px-3 py-1 text-xs rounded-full bg-primary/20 text-primary border border-primary/20">
                {activeCount} đang xử lý
              </span>
            </h2>
            <p className="text-text-muted text-sm mt-1">
              Kiểm tra và xử lý các báo cáo vi phạm tiêu chuẩn cộng đồng
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-6 border-b border-border-dark/40">
          {Object.entries(TABS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`pb-3 text-sm font-bold transition-all ${activeTab === key
                ? "text-primary border-b-2 border-primary"
                : "text-text-muted hover:text-white"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-surface-dark/20 rounded-2xl border border-border-dark/50 overflow-hidden shadow-2xl backdrop-blur-sm">
          <table className="w-full text-left">
            <thead className="bg-background-dark/80 border-b border-border-dark/50 text-[11px] uppercase font-black text-text-muted tracking-wider">
              <tr>
                <th className="px-6 py-4">Đối tượng</th>
                <th className="px-6 py-4">Người báo cáo</th>
                <th className="px-6 py-4">Lý do</th>
                <th className="px-6 py-4">Ngày tạo</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-dark/30 text-sm">
              {loading && (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-text-muted animate-pulse">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              )}

              {!loading && filteredReports.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-text-muted italic">
                    Không có báo cáo nào
                  </td>
                </tr>
              )}

              {!loading &&
                filteredReports.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-dark/40 transition-colors">
                    {/* TARGET */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-10 rounded-full ${r.targetType === 'USER' ? 'bg-blue-500' :
                            r.targetType === 'GROUP' ? 'bg-purple-500' : 'bg-pink-500'
                          }`}></div>
                        <div>
                          <p className="font-bold text-white">
                            {r.targetType} #{r.targetId}
                          </p>
                          <span className="text-[10px] text-text-muted uppercase tracking-wide">ID: {r.targetId}</span>
                        </div>
                      </div>
                    </td>

                    {/* REPORTER */}
                    <td className="px-6 py-4 font-medium text-gray-300">
                      {r.reporterUsername || "Ẩn danh"}
                    </td>

                    {/* REASON */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-[11px] font-bold rounded-lg bg-surface-dark text-white border border-border-dark/50 shadow-sm inline-block max-w-[200px] truncate">
                        {r.reason}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-4 text-text-muted font-mono text-xs">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString('vi-VN')
                        : "-"}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border ${statusMap[r.status]?.bg || 'bg-gray-500/10'} ${statusMap[r.status]?.border || 'border-gray-500/20'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${statusMap[r.status]?.color?.replace('text-', 'bg-') || 'bg-gray-500'}`}></div>
                        <span className={`text-xs font-bold ${statusMap[r.status]?.color || 'text-gray-400'}`}>
                          {statusMap[r.status]?.label || r.status}
                        </span>
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleShowDetail(r)}
                          className="px-4 py-1.5 text-xs font-bold rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/20 hover:border-primary/50"
                        >
                          Chi tiết
                        </button>

                        {r.status !== 'RESOLVED' && (
                          <>
                            {r.targetType === 'USER' && (
                              <button
                                onClick={() => confirmAction(
                                  () => onBanUser(r.targetId, r.id),
                                  "Cấm người dùng?",
                                  `Bạn có chắc chắn muốn khóa tài khoản người dùng #${r.targetId}? Hành động này sẽ vô hiệu hóa quyền truy cập của họ.`
                                )}
                                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20 hover:border-red-500/50"
                              >
                                Cấm
                              </button>
                            )}
                            {r.targetType === 'GROUP' && (
                              <button
                                onClick={() => confirmAction(
                                  () => onDeleteGroup(r.targetId, r.id),
                                  "Xóa nhóm?",
                                  `Bạn có chắc chắn muốn xóa nhóm #${r.targetId}?`
                                )}
                                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20 hover:border-red-500/50"
                              >
                                Xóa Nhóm
                              </button>
                            )}
                            {r.targetType === 'POST' && (
                              <button
                                onClick={() => confirmAction(
                                  () => onDeletePost(r.targetId, r.id),
                                  "Xóa bài viết?",
                                  `Bạn có chắc chắn muốn xóa bài viết #${r.targetId}?`
                                )}
                                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20 hover:border-red-500/50"
                              >
                                Xóa Bài
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* --- DETAIL MODAL --- */}
        {detailModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-dark/50">
                <div>
                  <h3 className="text-xl font-bold text-white">Chi tiết báo cáo #{detailModal.report.id}</h3>
                  <p className="text-text-muted text-sm mt-1">Được tạo ngày {new Date(detailModal.report.createdAt).toLocaleString('vi-VN')}</p>
                </div>
                <button onClick={closeDetailModal} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-white transition-all">✕</button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Reporter Section */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-text-muted mb-3">Người báo cáo</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {detailModal.report.reporterUsername?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-white font-bold">{detailModal.report.reporterUsername || 'Ẩn danh'}</p>
                      <p className="text-xs text-text-muted">Lý do: <span className="text-primary">{detailModal.report.reason}</span></p>
                    </div>
                  </div>
                </div>

                {/* Target Section */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-text-muted mb-3">Thông tin đối tượng bị báo cáo ({detailModal.report.targetType})</h4>

                  {detailModal.loading ? (
                    <div className="py-8 text-center text-text-muted animate-pulse">Đang tải thông tin chi tiết...</div>
                  ) : detailModal.targetData ? (
                    <div className="space-y-4">
                      {/* RENDER BASED ON TYPE */}
                      {detailModal.report.targetType === 'USER' && (
                        <div className="flex items-start gap-4">
                          <img
                            src={detailModal.targetData.avatarUrl || "https://via.placeholder.com/150"}
                            alt="Avatar"
                            className="w-16 h-16 rounded-xl object-cover bg-black/20"
                          />
                          <div>
                            <p className="text-lg font-bold text-white">{detailModal.targetData.username || detailModal.targetData.fullName}</p>
                            <p className="text-text-muted text-sm">{detailModal.targetData.email}</p>
                            <p className="text-text-muted text-sm mt-1">ID: {detailModal.targetData.id}</p>
                            <div className="mt-3 flex gap-2">
                              <span className={`px-2 py-0.5 text-xs rounded-md ${detailModal.targetData.locked ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                {detailModal.targetData.locked ? 'Đã khóa' : 'Hoạt động'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {detailModal.report.targetType === 'GROUP' && (
                        <div className="flex items-start gap-4">
                          <img
                            src={detailModal.targetData.avatar || "https://via.placeholder.com/150"}
                            alt="Group Cover"
                            className="w-16 h-16 rounded-xl object-cover bg-black/20"
                          />
                          <div>
                            <p className="text-lg font-bold text-white">{detailModal.targetData.name}</p>
                            <p className="text-text-muted text-sm">{detailModal.targetData.description}</p>
                            <p className="text-text-muted text-sm mt-1">Thành viên: {detailModal.targetData.memberCount || 0}</p>
                          </div>
                        </div>
                      )}

                      {detailModal.report.targetType === 'POST' && (
                        <div>
                          <p className="text-white text-sm bg-black/20 p-4 rounded-lg border border-white/5 mb-3">
                            {detailModal.targetData.content}
                          </p>
                          {detailModal.targetData.imageUrl && (
                            <img
                              src={detailModal.targetData.imageUrl}
                              className="w-full h-48 object-cover rounded-lg border border-white/5"
                              alt="Post content"
                            />
                          )}
                          <div className="mt-2 text-xs text-text-muted">
                            Post ID: {detailModal.targetData.id} • Tác giả ID: {detailModal.targetData.userId}
                          </div>
                        </div>
                      )}

                      {!detailModal.targetData && !detailModal.loading && (
                        <div className="p-4 bg-red-500/10 text-red-400 rounded-lg text-sm text-center">
                          Không tìm thấy dữ liệu đối tượng (Có thể đã bị xóa)
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-red-500/10 text-red-400 rounded-lg text-sm text-center">
                      Không tìm thấy dữ liệu hoặc lỗi kết nối.
                    </div>
                  )}
                </div>

                {/* Quick Actions in Modal */}
                {!detailModal.loading && detailModal.targetData && detailModal.report.status !== 'RESOLVED' && (
                  <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/10 flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold text-sm">Hành động nhanh</p>
                      <p className="text-xs text-text-muted">Xử lý báo cáo này ngay lập tức</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResolveReport(detailModal.report.id)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10 transition-all"
                      >
                        Bỏ qua (Đóng Report)
                      </button>

                      {detailModal.report.targetType === 'USER' && (
                        <button
                          onClick={() => confirmAction(
                            () => onBanUser(detailModal.report.targetId, detailModal.report.id),
                            "Khóa tài khoản",
                            "Xác nhận khóa tài khoản người dùng này?"
                          )}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-red-500/20 transition-all"
                        >
                          Khóa Tài Khoản
                        </button>
                      )}

                      {detailModal.report.targetType === 'POST' && (
                        <button
                          onClick={() => confirmAction(
                            () => onDeletePost(detailModal.report.targetId, detailModal.report.id),
                            "Xóa bài viết",
                            "Xác nhận xóa bài viết này?"
                          )}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-red-500/20 transition-all"
                        >
                          Xóa Bài Viết
                        </button>
                      )}

                      {detailModal.report.targetType === 'GROUP' && (
                        <button
                          onClick={() => confirmAction(
                            () => onDeleteGroup(detailModal.report.targetId, detailModal.report.id),
                            "Xóa nhóm",
                            "Xác nhận xóa nhóm này?"
                          )}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-red-500/20 transition-all"
                        >
                          Xóa Nhóm
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- CONFIRM DIALOG --- */}
        {confirmConfig.isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in zoom-in-95 duration-200">
            <div className="bg-[#1e1e1e] w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4 text-2xl">
                !
              </div>
              <h3 className="text-xl font-black text-white mb-2">{confirmConfig.title}</h3>
              <p className="text-text-muted text-sm mb-6">{confirmConfig.message}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
                  className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={confirmConfig.onConfirm}
                  className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-lg shadow-red-500/20 transition-all"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAGINATION UI (Mock) */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-text-muted">Hiển thị {filteredReports.length} kết quả</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs font-bold rounded bg-primary text-black">1</button>
            {/* Add more pagination logic if needed */}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminReportsManagement;
