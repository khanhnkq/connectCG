import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout-admin/AdminLayout";
import reportService from "../../services/ReportService";
import UserProfileService from "../../services/user/UserProfileService";
import { lockUser } from "../../services/admin/AdminUserService";
import postService from "../../services/PostService";
import { findById as findGroupById, deleteGroup } from "../../services/groups/GroupService";
import toast from "react-hot-toast";
import GroupInspectorModal from "../../components/admin/GroupInspectorModal";

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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("USER");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUserId(Number(user.id));
        console.log("Current Admin ID:", Number(user.id));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  // Modal State
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    report: null,
    targetData: null,
    loading: false,
  });

  // Inspector State
  const [inspectingGroupId, setInspectingGroupId] = useState(null);

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

  // GROUP REPORTS BY TARGET ID
  const groupedReports = Object.values(filteredReports.reduce((acc, report) => {
    // Only group Pending/Under Review reports. Resolved ones might stay separate or also grouped?
    // Let's group all non-resolved ones together to process them.
    if (report.status === 'RESOLVED') return acc; // Or handle resolved separately? 
    // Usually admin wants to see pending stuff grouped.

    // For this request, let's group everything by target, but maybe filter by status first?
    // The previous code filtered by ACTIVE (non-resolved) for the count.

    const tType = report.targetType || report.target_type;
    const tId = report.targetId || report.target_id || report.targetID;
    const key = `${tType}_${tId}`;

    if (!acc[key]) {
      acc[key] = {
        id: `group_${report.targetId || report.target_id || report.targetID}`, // Fake ID for key
        targetType: report.targetType || report.target_type,
        targetId: report.targetId || report.target_id || report.targetID, // Standardize to targetId
        targetData: null, // Fetched later
        reports: [],
        reason: report.reason, // Show first reason as display
        createdAt: report.createdAt || report.created_at,
        reporterUsername: report.reporterUsername || report.reporter_username,
        status: report.status
      };
    }

    acc[key].reports.push(report);
    // Keep latest date
    const reportDate = new Date(report.createdAt || report.created_at);
    const accDate = new Date(acc[key].createdAt);
    if (reportDate > accDate) {
      acc[key].createdAt = reportDate;
    }

    return acc;
  }, {}));


  const displayReports = [...groupedReports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const activeCount = displayReports.length;

  // METADATA FETCHING (Names & Avatars)
  const [targetMetadata, setTargetMetadata] = useState({});

  useEffect(() => {
    const fetchMetadata = async () => {
      const newMetadata = {};
      const promises = [];

      for (const group of displayReports) {
        // Skip if already fetched
        if (targetMetadata[`${group.targetType}_${group.targetId}`]) continue;

        if (group.targetType === 'USER') {
          promises.push(
            UserProfileService.getUserProfile(group.targetId)
              .then(res => {
                newMetadata[`USER_${group.targetId}`] = {
                  name: res.data.fullName || res.data.username,
                  avatar: res.data.currentAvatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                  subtext: res.data.email
                };
              })
              .catch(() => {
                newMetadata[`USER_${group.targetId}`] = { name: `Unknown User #${group.targetId}`, error: true };
              })
          );
        } else if (group.targetType === 'GROUP') {
          promises.push(
            findGroupById(group.targetId)
              .then(res => {
                newMetadata[`GROUP_${group.targetId}`] = {
                  name: res.name,
                  avatar: res.image || "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000",
                  subtext: `Owner ID: ${res.ownerId}`
                };
              })
              .catch(() => {
                newMetadata[`GROUP_${group.targetId}`] = { name: `Unknown Group #${group.targetId}`, error: true };
              })
          );
        }

        // Fetch Reporter Info (for single reporter display)
        if (group.reports.length === 1) {
          const reporterId = group.reports[0].reporterId;
          const reporterKey = `USER_${reporterId}`;
          if (reporterId && !targetMetadata[reporterKey] && !newMetadata[reporterKey]) {
            promises.push(
              UserProfileService.getUserProfile(reporterId)
                .then(res => {
                  newMetadata[reporterKey] = {
                    name: res.data.fullName || res.data.username,
                    avatar: res.data.currentAvatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                    subtext: res.data.email
                  };
                })
                .catch(() => {
                  newMetadata[reporterKey] = { name: `User #${reporterId}`, error: true };
                })
            );
          }
        }
      }

      if (promises.length > 0) {
        await Promise.allSettled(promises);
        setTargetMetadata(prev => ({ ...prev, ...newMetadata }));
      }
    };

    if (displayReports.length > 0) {
      fetchMetadata();
    }
  }, [displayReports]); // Re-run when list changes


  const handleShowDetail = async (groupItem) => {
    if (!groupItem.targetId) {
      toast.error("Lỗi: Report không có targetId");
      console.error("Missing targetId in report:", groupItem);
      return;
    }

    // Fetch Reporters for this group (for Modal display)
    const reporterIds = [...new Set(groupItem.reports.map(r => r.reporterId).filter(id => id))];
    const newMeta = {};
    const promises = [];

    reporterIds.forEach(id => {
      if (!targetMetadata[`USER_${id}`]) {
        promises.push(
          UserProfileService.getUserProfile(id).then(res => {
            newMeta[`USER_${id}`] = {
              name: res.data.fullName || res.data.username,
              avatar: res.data.currentAvatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
              subtext: res.data.email
            };
          }).catch(() => { })
        );
      }
    });

    if (promises.length > 0) {
      // Non-blocking fetch for UI update
      Promise.allSettled(promises).then(() => {
        setTargetMetadata(prev => ({ ...prev, ...newMeta }));
      });
    }

    // groupItem has .reports array
    setDetailModal({ isOpen: true, report: groupItem, targetData: null, loading: true });
    try {
      let data = null;
      if (groupItem.targetType === "USER") {
        const res = await UserProfileService.getUserProfile(groupItem.targetId);
        data = res.data;
      } else if (groupItem.targetType === "GROUP") {
        const res = await findGroupById(groupItem.targetId);
        data = res; // GroupService returns data directly
      } else if (groupItem.targetType === "POST") {
        const res = await postService.getPostById(groupItem.targetId);
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


  const handleResolveReport = async (reportsOrId) => {
    try {
      if (Array.isArray(reportsOrId)) {
        // Bulk resolve
        await Promise.all(reportsOrId.map(r => reportService.updateReportStatus(r.id, "RESOLVED")));
        toast.success(`Đã xử lý ${reportsOrId.length} báo cáo`);
      } else {
        // Single resolve
        await reportService.updateReportStatus(reportsOrId, "RESOLVED");
        toast.success("Đã đánh dấu báo cáo là đã giải quyết");
      }
      fetchReports();
      closeDetailModal();
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };



  const onBanUser = async (userId, reportsOrId) => {
    if (!userId) {
      toast.error("User ID is missing!");
      return;
    }

    console.log(`Attempting to ban User ID: ${userId} (Type: ${typeof userId})`);
    console.log(`Current Admin ID: ${currentUserId} (Type: ${typeof currentUserId})`);

    if (currentUserId && Number(userId) === currentUserId) {
      toast.error("Bạn không thể tự cấm chính mình! (Client check)");
      return;
    }

    try {
      await lockUser(Number(userId));
      toast.success(`Đã khóa tài khoản người dùng #${userId}`);
      if (reportsOrId) await handleResolveReport(reportsOrId);
      else fetchReports();
    } catch (error) {
      console.error("Ban user error:", error);
      toast.error(error.response?.data?.message || "Lỗi khi khóa tài khoản");
    }
  };

  const onDeleteGroup = async (groupId, reportsOrId) => {
    try {
      await deleteGroup(groupId);
      toast.success(`Đã xóa/khóa nhóm #${groupId}`);
      if (reportsOrId) await handleResolveReport(reportsOrId);
      else fetchReports();
    } catch (error) {
      toast.error("Lỗi khi xóa nhóm");
    }
  };

  const onDeletePost = async (postId, reportsOrId) => {
    try {
      await postService.deletePost(postId);
      toast.success(`Đã xóa bài viết #${postId}`);
      if (reportsOrId) await handleResolveReport(reportsOrId);
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
                displayReports.map((r) => (
                  <tr key={`${r.targetType}_${r.targetId}`} className="hover:bg-surface-dark/40 transition-colors">
                    {/* TARGET */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {targetMetadata[`${r.targetType}_${r.targetId}`]?.avatar ? (
                          <img src={targetMetadata[`${r.targetType}_${r.targetId}`].avatar} className="w-10 h-10 rounded-full object-cover bg-black/20" alt="" />
                        ) : (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${r.targetType === 'USER' ? 'bg-blue-500/20 text-blue-500' : 'bg-purple-500/20 text-purple-500'}`}>
                            {r.targetType === 'USER' ? 'U' : r.targetType === 'GROUP' ? 'G' : 'P'}
                          </div>
                        )}

                        <div>
                          <p className="font-bold text-white">
                            {targetMetadata[`${r.targetType}_${r.targetId}`]?.name || `${r.targetType} #${r.targetId}`}
                          </p>
                          <span className="text-[10px] text-text-muted uppercase tracking-wide">
                            {targetMetadata[`${r.targetType}_${r.targetId}`]?.subtext || `ID: ${r.targetId}`}
                          </span>
                          {r.reports.length > 1 && (
                            <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                              +{r.reports.length} báo cáo
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* REPORTER */}
                    <td className="px-6 py-4 font-medium text-gray-300">
                      {r.reports.length > 1 ? (
                        <span className="italic text-text-muted">Nhiều người báo cáo</span>
                      ) : (
                        targetMetadata[`USER_${r.reports[0].reporterId}`]?.name || r.reporterUsername || "Ẩn danh"
                      )}
                    </td>

                    {/* REASON */}
                    <td className="px-6 py-4">
                      {r.reports.length > 1 ? (
                        <div className="flex flex-col gap-1">
                          <span className="px-3 py-1 text-[11px] font-bold rounded-lg bg-surface-dark text-white border border-border-dark/50 shadow-sm inline-block max-w-[200px] truncate">
                            {r.reason}
                          </span>
                          <span className="text-[10px] text-text-muted">và {r.reports.length - 1} lý do khác...</span>
                        </div>
                      ) : (
                        <span className="px-3 py-1 text-[11px] font-bold rounded-lg bg-surface-dark text-white border border-border-dark/50 shadow-sm inline-block max-w-[200px] truncate">
                          {r.reason}
                        </span>
                      )}
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

                        {/* View Group Button (Direct Link) */}
                        {r.groupId && (
                          <button
                            onClick={() => setInspectingGroupId(r.groupId)}
                            className="px-2 py-1.5 text-xs font-bold rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all border border-blue-500/20 hover:border-blue-500/50"
                            title="Xem Nhóm"
                          >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                          </button>
                        )}

                        {r.status !== 'RESOLVED' && (
                          <>
                            {r.targetType === 'USER' && (
                              <button
                                onClick={() => confirmAction(
                                  () => onBanUser(r.targetId, r.reports[0].id), // Just pass one report ID for now or need bulk resolve
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
                                  () => onDeleteGroup(r.targetId, r.reports[0].id),
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
                                  () => onDeletePost(r.targetId, r.reports[0].id),
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
                ))
              }
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
                {/* Reporter Section - UPDATED FOR AGGREGATION */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-text-muted mb-3">
                    Người báo cáo ({detailModal.report.reports?.length || 1})
                  </h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {detailModal.report.reports?.map((r, index) => (
                      <div key={index}
                        className="flex items-center gap-3 pb-3 border-b border-white/5 last:border-0 last:pb-0 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
                        onClick={() => r.reporterId ? navigate(`/dashboard/member/${r.reporterId}`) : toast.error("Không tìm thấy ID người báo cáo (Cần update Backend)")}
                      >
                        {targetMetadata[`USER_${r.reporterId}`]?.avatar ? (
                          <img src={targetMetadata[`USER_${r.reporterId}`].avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                            {(targetMetadata[`USER_${r.reporterId}`]?.name || r.reporterUsername || '?').charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div>
                          <p className="text-white font-bold text-sm hover:underline">
                            {targetMetadata[`USER_${r.reporterId}`]?.name || r.reporterUsername || 'Ẩn danh'}
                          </p>
                          <p className="text-xs text-text-muted">
                            <span className="text-primary font-medium">{r.reason}</span>
                            <span className="mx-1">•</span>
                            {new Date(r.createdAt).toLocaleString('vi-VN')}
                          </p>
                        </div>
                        <span className="ml-auto text-[10px] text-text-muted border border-white/10 px-2 py-1 rounded">Xem Profile</span>
                      </div>
                    ))}
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
                        <div className="flex items-start gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => navigate(`/dashboard/member/${detailModal.targetData.id || detailModal.report.targetId}`)}>
                          <img
                            src={detailModal.targetData.currentAvatarUrl || "https://via.placeholder.com/150"}
                            alt="Avatar"
                            className="w-16 h-16 rounded-xl object-cover bg-black/20"
                          />
                          <div>
                            <p className="text-lg font-bold text-white hover:underline">{detailModal.targetData.fullName || detailModal.targetData.username}</p>
                            <p className="text-text-muted text-sm">{detailModal.targetData.email}</p>
                            <p className="text-text-muted text-sm mt-1">ID: {detailModal.targetData.id || detailModal.report.targetId}</p>
                            <div className="mt-3 flex gap-2">
                              <span className={`px-2 py-0.5 text-xs rounded-md ${detailModal.targetData.locked ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                {detailModal.targetData.locked ? 'Đã khóa' : 'Hoạt động'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {detailModal.report.targetType === 'GROUP' && (
                        <div className="space-y-4">
                          {/* Group Info */}
                          <div className="flex items-start gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => navigate(`/dashboard/groups/${detailModal.targetData.id}`)}>
                            <img
                              src={detailModal.targetData.image || "https://via.placeholder.com/150"}
                              alt="Group Cover"
                              className="w-16 h-16 rounded-xl object-cover bg-black/20"
                            />
                            <div>
                              <p className="text-lg font-bold text-white hover:underline">{detailModal.targetData.name}</p>
                              <p className="text-text-muted text-sm">{detailModal.targetData.description}</p>
                              <p className="text-text-muted text-sm mt-1">Thành viên: {detailModal.targetData.memberCount || 0}</p>
                            </div>
                          </div>

                          {/* Group Owner Info */}
                          {detailModal.targetData.ownerId && (
                            <div className="p-3 rounded-lg bg-black/20 border border-white/5 cursor-pointer hover:bg-black/30 transition-colors"
                              onClick={() => navigate(`/dashboard/member/${detailModal.targetData.ownerId}`)}>
                              <p className="text-[10px] text-text-muted uppercase font-bold mb-2">Chủ sở hữu nhóm</p>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                                  {detailModal.targetData.ownerName?.charAt(0) || 'O'}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-white hover:underline">{detailModal.targetData.ownerFullName || detailModal.targetData.ownerName}</p>
                                  <p className="text-xs text-text-muted">ID: {detailModal.targetData.ownerId}</p>
                                </div>
                                <span className="ml-auto text-[10px] text-indigo-400">Xem Profile</span>
                              </div>
                            </div>
                          )}
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
                          <div className="mt-2 text-xs text-text-muted flex gap-2">
                            <span>Post ID: {detailModal.targetData.id}</span>
                            <span>•</span>
                            <span className="cursor-pointer hover:text-white hover:underline"
                              onClick={() => navigate(`/dashboard/member/${detailModal.targetData.userId}`)}>
                              Tác giả ID: {detailModal.targetData.userId} (Xem Profile)
                            </span>
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
                      <p className="text-xs text-text-muted">Xử lý {detailModal.report.reports?.length} báo cáo này ngay lập tức</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResolveReport(detailModal.report.reports)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10 transition-all"
                      >
                        Bỏ qua (Đóng tất cả)
                      </button>

                      {detailModal.report.targetType === 'USER' && (
                        <button
                          onClick={() => confirmAction(
                            () => onBanUser(detailModal.report.targetId, detailModal.report.reports),
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
                            () => onDeletePost(detailModal.report.targetId, detailModal.report.reports),
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
                            () => onDeleteGroup(detailModal.report.targetId, detailModal.report.reports),
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

        {/* --- GROUP INSPECTOR MODAL --- */}
        {inspectingGroupId && (
          <GroupInspectorModal
            groupId={inspectingGroupId}
            onClose={() => setInspectingGroupId(null)}
            onAction={(group) => confirmAction(
              () => onDeleteGroup(group.id, null),
              "Xóa nhóm?",
              `Bạn có chắc chắn muốn xóa nhóm "${group.name}"?`
            )}
          />
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminReportsManagement;
