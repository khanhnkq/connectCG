import {
  History,
  ShieldCheck,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminLayout from "../../components/layout-admin/AdminLayout";
import reportService from "../../services/ReportService";
import UserProfileService from "../../services/user/UserProfileService";
import { lockUser } from "../../services/admin/AdminUserService";
import postService from "../../services/PostService";
import {
  findById as findGroupById,
  deleteGroup,
  getGroupPosts,
  findAllGroup,
  rejectPost,
} from "../../services/groups/GroupService";
import toast from "react-hot-toast";
import GroupInspectorModal from "../../components/admin/GroupInspectorModal";
import ReporterDetailModal from "../../components/admin/ReporterDetailModal";
import ReportTable from "../../components/admin/reports/ReportTable";
import ReportDetailModal from "../../components/admin/reports/ReportDetailModal";
import ReportConfirmDialog from "../../components/admin/reports/ReportConfirmDialog";

const TABS = {
  USER: "Báo cáo người dùng",
  GROUP: "Báo cáo nhóm",
  POST: "Báo cáo bài viết",
};

const statusMap = {
  PENDING: {
    label: "Chờ xử lý",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
  },
  UNDER_REVIEW: {
    label: "Đang xem xét",
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
  },
  RESOLVED: {
    label: "Đã giải quyết",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
  },
};

const AdminReportsManagement = () => {
  const [activeTab, setActiveTab] = useState("USER");
  const [filterStatus, setFilterStatus] = useState("PENDING"); // Default to pending
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc"); // desc (newest) | asc (oldest)
  const [currentUserId, setCurrentUserId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const PAGE_SIZE = 10;

  // Cache for all groups to allow fallback lookup for deleted groups
  const [allGroupsCache, setAllGroupsCache] = useState(null);

  // Redux: Listen for new notifications (Real-time updates)
  const { items: notifications } = useSelector((state) => state.notifications);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
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
  const [inspectingReports, setInspectingReports] = useState([]);
  const [inspectorInitialTab, setInspectorInitialTab] = useState("overview");
  const [viewingReporterId, setViewingReporterId] = useState(null); // For reporter modal

  // Confirm Dialog State
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "danger",
  });

  const fetchReports = React.useCallback(
    async (page = 0) => {
      setLoading(true);
      try {
        const params = {
          page,
          size: PAGE_SIZE,
          targetType: activeTab,
          status: filterStatus || undefined,
        };
        const res = await reportService.getReports(params);
        // Backend returns Page object with content, totalPages, totalElements
        const pageData = res.data;
        setReports(pageData.content || []);
        setTotalPages(pageData.totalPages || 0);
        setTotalElements(pageData.totalElements || 0);
        setCurrentPage(page);
      } catch (e) {
        console.error(e);
        toast.error("Không tải được danh sách báo cáo");
      } finally {
        setLoading(false);
      }
    },
    [activeTab, filterStatus],
  );

  // Filter effect: Fetch reports when filters change
  useEffect(() => {
    setCurrentPage(0);
    fetchReports(0);
  }, [activeTab, filterStatus]);

  // Real-time Update Effect
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      // If a new report is submitted, refresh the list
      if (latest.type === "REPORT_SUBMITTED") {
        console.log("🔔 New Report received, refreshing table...");
        fetchReports(currentPage);
      }
    }
  }, [notifications, fetchReports, currentPage]);

  // Client-side filtering is no longer needed as backend handles it
  const filteredReports = reports;

  // GROUP REPORTS BY TARGET ID
  const groupedReports = Object.values(
    filteredReports.reduce((acc, report) => {
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
          updatedAt: report.updatedAt || report.updated_at,
          reporterUsername: report.reporterUsername || report.reporter_username,
          status: report.status,
          groupId: report.groupId || report.group_id,
          reviewerId: report.reviewerId || report.reviewer_id, // Capture reviewer ID from DB
        };
      }

      acc[key].reports.push(report);
      // Keep latest date
      const reportDate = new Date(report.createdAt || report.created_at);
      const accDate = new Date(acc[key].createdAt);
      if (reportDate > accDate) {
        acc[key].createdAt = reportDate;
      }

      // Check for latest update time for resolution
      if (report.updatedAt) {
        const reportUpdate = new Date(report.updatedAt);
        const accUpdate = acc[key].updatedAt
          ? new Date(acc[key].updatedAt)
          : new Date(0);
        if (reportUpdate > accUpdate) acc[key].updatedAt = report.updatedAt;
      }

      return acc;
    }, {}),
  );

  const displayReports = [...groupedReports].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
  });

  const activeCount = totalElements;

  // History Logic
  const getViolationHistory = (targetId, type) => {
    return reports.filter(
      (r) =>
        r.status === "RESOLVED" &&
        String(r.targetId || r.target_id) === String(targetId) &&
        (r.targetType || r.target_type) === type,
    );
  };

  // METADATA FETCHING (Names & Avatars)
  const [targetMetadata, setTargetMetadata] = useState({});

  useEffect(() => {
    const fetchMetadata = async () => {
      const newMetadata = {};
      const promises = [];
      const groupsToFetch = []; // Track groups to potentially repair

      for (const group of displayReports) {
        if (targetMetadata[`${group.targetType}_${group.targetId}`]) continue;

        if (group.targetType === "USER") {
          promises.push(
            UserProfileService.getUserProfile(group.targetId)
              .then((res) => {
                newMetadata[`USER_${group.targetId}`] = {
                  name: res.data.fullName || res.data.username,
                  avatar:
                    res.data.currentAvatarUrl ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                  subtext: res.data.email,
                  status: res.data.status,
                  deleted: res.data.deleted,
                };
              })
              .catch(() => {
                newMetadata[`USER_${group.targetId}`] = {
                  name: `Unknown User #${group.targetId}`,
                  error: true,
                };
              }),
          );
        } else if (group.targetType === "GROUP") {
          groupsToFetch.push(group.targetId);
          promises.push(
            findGroupById(group.targetId)
              .then((res) => {
                newMetadata[`GROUP_${group.targetId}`] = {
                  name: res.name,
                  avatar:
                    res.image ||
                    "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000",
                  subtext: "",
                  status: res.status,
                  deleted: res.deleted,
                };
              })
              .catch(() => {
                newMetadata[`GROUP_${group.targetId}`] = {
                  name: `Unknown Group #${group.targetId}`,
                  error: true,
                };
              }),
          );
        }

        // Fetch Reporter Info
        if (group.reports.length === 1) {
          const reporterId = group.reports[0].reporterId;
          const reporterKey = `USER_${reporterId}`;
          if (
            reporterId &&
            !targetMetadata[reporterKey] &&
            !newMetadata[reporterKey]
          ) {
            promises.push(
              UserProfileService.getUserProfile(reporterId)
                .then((res) => {
                  newMetadata[reporterKey] = {
                    name: res.data.fullName || res.data.username,
                    avatar:
                      res.data.currentAvatarUrl ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                    subtext: res.data.email,
                  };
                })
                .catch(() => {
                  newMetadata[reporterKey] = {
                    name: `User #${reporterId}`,
                    error: true,
                  };
                }),
            );
          }
        }

        // Fetch Resolver/Reviewer Info
        if (group.reviewerId) {
          const resolverKey = `USER_${group.reviewerId}`;
          if (!targetMetadata[resolverKey] && !newMetadata[resolverKey]) {
            promises.push(
              UserProfileService.getUserProfile(group.reviewerId)
                .then((res) => {
                  newMetadata[resolverKey] = {
                    name: res.data.fullName || res.data.username,
                    avatar: res.data.currentAvatarUrl,
                  };
                })
                .catch(() => {
                  newMetadata[resolverKey] = { name: "Admin", error: true };
                }),
            );
          }
        }
      }

      if (promises.length > 0) {
        await Promise.allSettled(promises);

        // REPAIR PHASE for Groups
        // Check for groups that failed to load (likely soft-deleted and returned 404/error by strict findById)
        const failedGroupIds = groupsToFetch.filter((id) => {
          const meta = newMetadata[`GROUP_${id}`];
          return meta && meta.error;
        });

        if (failedGroupIds.length > 0) {
          console.log("Attempting repair for deleted groups:", failedGroupIds);
          try {
            // Check if we have cache or need to fetch all groups list
            let currentCache = allGroupsCache;
            if (
              !currentCache &&
              displayReports.some((r) => r.targetType === "GROUP")
            ) {
              // Only fetch if we really need to repair groups
              try {
                currentCache = await findAllGroup();
                setAllGroupsCache(currentCache);
              } catch (e) {
                console.error("Failed to fetch all groups for repair", e);
              }
            }

            if (currentCache) {
              failedGroupIds.forEach((id) => {
                const found = currentCache.find(
                  (g) => String(g.id) === String(id),
                );
                if (found) {
                  // Recovered from list!
                  newMetadata[`GROUP_${id}`] = {
                    name: found.name,
                    avatar:
                      found.image ||
                      "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000",
                    subtext: `Owner ID: ${found.ownerId}`,
                    status: "DELETED", // Force status to deleted since it failed standard fetch
                    deleted: true,
                    error: false, // Clear error flag
                  };
                } else {
                  // Truly unknown
                  newMetadata[`GROUP_${id}`].name = `Deleted Group #${id}`;
                }
              });
            }
          } catch (err) {
            console.error("Repair logic failed:", err);
          }
        }

        setTargetMetadata((prev) => ({ ...prev, ...newMetadata }));
      }
    };

    if (displayReports.length > 0) {
      fetchMetadata();
    }
  }, [displayReports, allGroupsCache]);

  const handleShowDetail = async (groupItem) => {
    if (!groupItem.targetId) {
      toast.error("Lỗi: Report không có targetId");
      console.error("Missing targetId in report:", groupItem);
      return;
    }

    // Fetch Reporters for this group
    const reporterIds = [
      ...new Set(groupItem.reports.map((r) => r.reporterId).filter((id) => id)),
    ];
    const newMeta = {};
    const promises = [];

    reporterIds.forEach((id) => {
      if (!targetMetadata[`USER_${id}`]) {
        promises.push(
          UserProfileService.getUserProfile(id)
            .then((res) => {
              newMeta[`USER_${id}`] = {
                name: res.data.fullName || res.data.username,
                avatar:
                  res.data.currentAvatarUrl ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                subtext: res.data.email,
              };
            })
            .catch(() => { }),
        );
      }
    });

    if (promises.length > 0) {
      Promise.allSettled(promises).then(() => {
        setTargetMetadata((prev) => ({ ...prev, ...newMeta }));
      });
    }

    setDetailModal({
      isOpen: true,
      report: groupItem,
      targetData: null,
      loading: true,
    });
    try {
      let data = null;
      if (groupItem.targetType === "USER") {
        const res = await UserProfileService.getUserProfile(groupItem.targetId);
        data = res.data;
      } else if (groupItem.targetType === "GROUP") {
        setInspectingGroupId(groupItem.targetId);
        setInspectingReports(groupItem.reports);
        setInspectorInitialTab("overview");
        setDetailModal((prev) => ({ ...prev, loading: false, isOpen: false }));
        return;
      } else if (groupItem.targetType === "POST") {
        try {
          // Attempt 1: Direct Fetch
          const res = await postService.getPostById(groupItem.targetId);
          data = res.data;
        } catch (error) {
          console.warn(
            "Direct post fetch failed, attempting fallback via GroupService",
            error,
          );
          if (groupItem.groupId) {
            const groupPosts = await getGroupPosts(groupItem.groupId);
            const foundPost = groupPosts.find(
              (p) => String(p.id) === String(groupItem.targetId),
            );
            if (foundPost) {
              data = foundPost;
              if (!data.userId && foundPost.authorId)
                data.userId = foundPost.authorId;
            } else {
              throw new Error(`Post ${groupItem.targetId} not found in group ${groupItem.groupId}`);
            }
          } else {
            console.error("Direct fetch failed and no groupId available for fallback", groupItem);
            throw error;
          }
        }
      }
      setDetailModal((prev) => ({ ...prev, targetData: data, loading: false }));
    } catch (error) {
      console.error("Failed to fetch detail:", error);
      console.log("Report Item causing error:", groupItem);
      // Don't toast error here to avoid spamming if user clicks multiple times or if it's expected
      // toast.error("Không thể tải thông tin chi tiết gốc");

      // Allow modal to stay open but with error state
      setDetailModal((prev) => ({
        ...prev,
        targetData: {
          error: true,
          msg: error.response?.status === 405 ? "API không hỗ trợ lấy chi tiết (405)" : "Không tìm thấy nội dung hoặc lỗi kết nối"
        },
        loading: false
      }));
    }
  };

  const closeDetailModal = () => {
    setDetailModal({
      isOpen: false,
      report: null,
      targetData: null,
      loading: false,
    });
  };

  const handleResolveReport = async (reportsOrId) => {
    try {
      if (Array.isArray(reportsOrId)) {
        await Promise.all(
          reportsOrId.map((r) =>
            reportService.updateReportStatus(r.id, "RESOLVED"),
          ),
        );
        toast.success(`Đã xử lý ${reportsOrId.length} báo cáo`);
      } else {
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
      toast.error("Không tìm thấy ID người dùng!");
      return;
    }

    if (currentUserId && Number(userId) === currentUserId) {
      toast.error("Bạn không thể tự cấm chính mình! (Client check)");
      return;
    }

    try {
      await lockUser(Number(userId));
      toast.success(`Đã khóa tài khoản người dùng #${userId}`);

      setTargetMetadata((prev) => ({
        ...prev,
        [`USER_${userId}`]: {
          ...prev[`USER_${userId}`],
          error: true,
          status: "LOCKED",
          deleted: true,
        },
      }));

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

      setTargetMetadata((prev) => ({
        ...prev,
        [`GROUP_${groupId}`]: {
          ...prev[`GROUP_${groupId}`],
          error: true,
          status: "DELETED",
          deleted: true,
        },
      }));

      if (reportsOrId) await handleResolveReport(reportsOrId);
      else fetchReports();
    } catch (error) {
      toast.error("Lỗi khi xóa nhóm");
    }
  };

  const onDeletePost = async (postId, reportsOrId, groupId) => {
    try {
      // Try standard delete first
      try {
        await postService.deletePost(postId);
      } catch (err) {
        // If standard delete fails and we have a groupId, try rejectPost (remove from group)
        if (groupId) {
          console.warn(
            "Standard delete failed, attempting group reject...",
            err,
          );
          await rejectPost(groupId, postId);
        } else {
          throw err; // Re-throw if no fallback available
        }
      }

      toast.success(`Đã xóa bài viết #${postId}`);

      setTargetMetadata((prev) => ({
        ...prev,
        [`POST_${postId}`]: {
          ...prev[`POST_${postId}`],
          error: true,
          status: "DELETED",
          deleted: true,
        },
      }));

      if (reportsOrId) await handleResolveReport(reportsOrId);
      else fetchReports();
    } catch (error) {
      console.error("Delete post error:", error);
      const msg = error.response?.data?.message || "Lỗi khi xóa bài viết";
      toast.error(msg);
    }
  };

  const confirmAction = (action, title, message) => {
    setConfirmConfig({
      isOpen: true,
      title,
      message,
      onConfirm: async () => {
        await action();
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
      type: "danger",
    });
  };

  return (
    <AdminLayout
      title="Quản lý báo cáo"
      activeTab="Reports"
      brandName="Social Admin"
    >
      <div className="p-8 space-y-6 relative min-h-screen">
        {/* HEADER */}
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-surface-main p-6 rounded-2xl border border-border-main shadow-sm">
          <div>
            <h2 className="text-2xl font-extrabold text-text-main tracking-tight flex items-center gap-3">
              Báo cáo vi phạm
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary border border-primary/20">
                {activeCount}{" "}
                {filterStatus === "RESOLVED" ? "đã xong" : "cần xử lý"}
              </span>
            </h2>
            <p className="text-text-secondary text-sm mt-1 font-medium">
              Kiểm tra và xử lý các báo cáo vi phạm tiêu chuẩn cộng đồng
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* STATUS FILTER */}
            <div className="flex bg-background-main p-1 rounded-xl border border-border-main">
              <button
                onClick={() => setFilterStatus("PENDING")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterStatus === "PENDING"
                  ? "bg-primary text-[#231810] shadow-sm"
                  : "text-text-secondary hover:text-text-main"
                  }`}
              >
                Đang chờ
              </button>
              <button
                onClick={() => setFilterStatus("RESOLVED")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterStatus === "RESOLVED"
                  ? "bg-green-500 text-white shadow-sm"
                  : "text-text-secondary hover:text-text-main"
                  }`}
              >
                Đã xong
              </button>
            </div>

            {/* SORT BUTTON */}
            <button
              onClick={() =>
                setSortOrder(sortOrder === "desc" ? "asc" : "desc")
              }
              className="px-4 py-2 rounded-xl bg-background-main border border-border-main text-text-secondary hover:text-text-main transition-all font-bold text-xs flex items-center gap-2"
              title={sortOrder === "desc" ? "Cũ nhất" : "Mới nhất"}
            >
              {sortOrder === "desc" ? (
                <ArrowDownWideNarrow size={16} />
              ) : (
                <ArrowUpNarrowWide size={16} />
              )}
              <span>{sortOrder === "desc" ? "Mới" : "Cũ"}</span>
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-10 px-6">
          {Object.entries(TABS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`pb-4 text-xs font-black uppercase tracking-[0.15em] transition-all relative ${activeTab === key
                ? "text-primary"
                : "text-text-muted hover:text-text-main"
                }`}
            >
              {label}
              {activeTab === key && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full shadow-lg shadow-primary/40" />
              )}
            </button>
          ))}
        </div>

        {/* TABLE */}
        {/* TABLE */}
        <ReportTable
          reports={displayReports}
          isLoading={loading}
          pagination={{ currentPage, totalPages }}
          targetMetadata={targetMetadata}
          statusMap={statusMap}
          onShowDetail={handleShowDetail}
          onResolve={handleResolveReport}
          isDeletedFunc={(r) => {
            const meta = targetMetadata[`${r.targetType}_${r.targetId}`];
            return (
              meta?.error ||
              meta?.status === "DELETED" ||
              meta?.status === "LOCKED" ||
              meta?.deleted
            );
          }}
          fetchReports={fetchReports}
        />

        {/* ... (Modals remain unchanged but are included in file content) */}
        {/* --- MODALS --- */}
        <ReportDetailModal
          isOpen={detailModal.isOpen}
          onClose={closeDetailModal}
          report={detailModal.report}
          targetData={detailModal.targetData}
          loading={detailModal.loading}
          targetMetadata={targetMetadata}
          violationHistory={
            detailModal.report
              ? getViolationHistory(
                detailModal.report.targetId,
                detailModal.report.targetType,
              )
              : []
          }
          onResolve={handleResolveReport}
          onReporterClick={(userId) => setViewingReporterId(userId)}
          onAction={(action) => {
            if (action.type === "BAN_USER") {
              confirmAction(
                () => onBanUser(action.targetId, action.reports),
                "Khóa tài khoản",
                "Xác nhận khóa tài khoản người dùng này?",
              );
            } else if (action.type === "DELETE_POST") {
              confirmAction(
                () =>
                  onDeletePost(action.targetId, action.reports, action.groupId),
                "Xóa bài viết",
                "Xác nhận xóa bài viết này?",
              );
            } else if (action.type === "DELETE_GROUP") {
              confirmAction(
                () => onDeleteGroup(action.targetId, action.reports),
                "Xóa nhóm",
                "Xác nhận xóa nhóm này?",
              );
            }
          }}
        />

        <ReportConfirmDialog
          isOpen={confirmConfig.isOpen}
          title={confirmConfig.title}
          message={confirmConfig.message}
          onConfirm={confirmConfig.onConfirm}
          onClose={() =>
            setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
          }
        />
      </div>

      {/* --- GROUP INSPECTOR MODAL --- */}
      {inspectingGroupId && (
        <GroupInspectorModal
          groupId={inspectingGroupId}
          reports={inspectingReports}
          reporterMetadata={targetMetadata}
          violationHistory={getViolationHistory(inspectingGroupId, "GROUP")}
          initialTab={inspectorInitialTab}
          onReporterClick={(userId) => setViewingReporterId(userId)}
          onClose={() => {
            setInspectingGroupId(null);
            setInspectingReports([]);
            setInspectorInitialTab("overview");
          }}
          onIgnore={() => {
            // Resolve reports and close
            handleResolveReport(inspectingReports);
            setInspectingGroupId(null);
            setInspectingReports([]);
            setInspectorInitialTab("overview");
          }}
          onAction={(group) => {
            confirmAction(
              () => onDeleteGroup(group.id, inspectingReports),
              "Xóa nhóm?",
              `Bạn có chắc muốn xóa nhóm ${group.name}?`,
            );
          }}
        />
      )}

      {/* --- REPORTER DETAIL MODAL (Reusing similar logic to User Detail) --- */}
      {viewingReporterId && (
        <ReporterDetailModal
          userId={viewingReporterId}
          onClose={() => setViewingReporterId(null)}
        />
      )}
    </AdminLayout>
  );
};

export default AdminReportsManagement;
