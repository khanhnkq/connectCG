import {
  History,
  ShieldCheck,
  X,
  ChevronRight,
  User,
  ShieldAlert,
  Search,
  CheckCircle2,
  Lock,
  Flag,
  MoreVertical,
  Info,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "../../services/groups/GroupService";
import toast from "react-hot-toast";
import GroupInspectorModal from "../../components/admin/GroupInspectorModal";
import ReporterDetailModal from "../../components/admin/ReporterDetailModal";

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
    border: "border-orange-400/20",
  },
  UNDER_REVIEW: {
    label: "Đang xem xét",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
  },
  RESOLVED: {
    label: "Đã giải quyết",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
  },
};

const AdminReportsManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("USER");
  const [filterStatus, setFilterStatus] = useState("PENDING"); // PENDING | RESOLVED | ALL
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Cache for all groups to allow fallback lookup for deleted groups
  const [allGroupsCache, setAllGroupsCache] = useState(null);

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

  const filteredReports = reports.filter((r) => {
    const typeMatch = r.targetType === activeTab;
    const statusMatch =
      filterStatus === "ALL"
        ? true
        : filterStatus === "RESOLVED"
        ? r.status === "RESOLVED"
        : r.status !== "RESOLVED";
    return typeMatch && statusMatch;
  });

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
          groupId: report.groupId,
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

  const displayReports = [...groupedReports].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const activeCount = displayReports.length;

  // HISTORY LOGIC
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
                  subtext: `Owner ID: ${res.ownerId}`,
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
            .catch(() => {}),
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
              (p) => p.id === groupItem.targetId,
            );
            if (foundPost) {
              data = foundPost;
              if (!data.userId && foundPost.authorId)
                data.userId = foundPost.authorId;
            } else {
              throw new Error("Post not found in group");
            }
          } else {
            throw error;
          }
        }
      }
      setDetailModal((prev) => ({ ...prev, targetData: data, loading: false }));
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải thông tin chi tiết");
      setDetailModal((prev) => ({ ...prev, loading: false }));
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
      toast.error("User ID is missing!");
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

  const onDeletePost = async (postId, reportsOrId) => {
    try {
      await postService.deletePost(postId);
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
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
      type: "danger",
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
                {activeCount}{" "}
                {filterStatus === "RESOLVED" ? "đã giải quyết" : "đang xử lý"}
              </span>
            </h2>
            <p className="text-text-muted text-sm mt-1">
              Kiểm tra và xử lý các báo cáo vi phạm tiêu chuẩn cộng đồng
            </p>
          </div>

          {/* STATUS FILTER */}
          <div className="flex bg-surface-dark border border-border-dark/50 p-1 rounded-xl">
            <button
              onClick={() => setFilterStatus("PENDING")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === "PENDING"
                  ? "bg-primary text-black"
                  : "text-text-muted hover:text-white"
              }`}
            >
              Chờ xử lý
            </button>
            <button
              onClick={() => setFilterStatus("RESOLVED")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === "RESOLVED"
                  ? "bg-green-500 text-white"
                  : "text-text-muted hover:text-white"
              }`}
            >
              Đã giải quyết
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-6 border-b border-border-dark/40">
          {Object.entries(TABS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`pb-3 text-sm font-bold transition-all ${
                activeTab === key
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
                  <td
                    colSpan="6"
                    className="text-center py-12 text-text-muted animate-pulse"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              )}

              {!loading && filteredReports.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-12 text-text-muted italic"
                  >
                    Không có báo cáo nào
                  </td>
                </tr>
              )}

              {!loading &&
                displayReports.map((r) => {
                  const meta = targetMetadata[`${r.targetType}_${r.targetId}`];
                  const isDeleted =
                    meta?.error ||
                    meta?.status === "DELETED" ||
                    meta?.status === "LOCKED" ||
                    meta?.deleted;

                  return (
                    <tr
                      key={`${r.targetType}_${r.targetId}`}
                      className="hover:bg-surface-dark/40 transition-colors"
                    >
                      {/* TARGET */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {meta?.avatar ? (
                            <img
                              src={meta.avatar}
                              className="w-10 h-10 rounded-full object-cover bg-black/20"
                              alt=""
                            />
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                                r.targetType === "USER"
                                  ? "bg-blue-500/20 text-blue-500"
                                  : "bg-purple-500/20 text-purple-500"
                              }`}
                            >
                              {r.targetType === "USER"
                                ? "U"
                                : r.targetType === "GROUP"
                                ? "G"
                                : "P"}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-white">
                                {meta?.name || `${r.targetType} #${r.targetId}`}
                              </p>
                              {getViolationHistory(r.targetId, r.targetType)
                                .length > 0 && (
                                <div
                                  className="group relative"
                                  title="Đối tượng này đã có vi phạm trước đó"
                                >
                                  <History className="text-orange-500 size-4 cursor-help" />
                                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    {
                                      getViolationHistory(
                                        r.targetId,
                                        r.targetType,
                                      ).length
                                    }{" "}
                                    vi phạm trước đó
                                  </span>
                                </div>
                              )}
                            </div>
                            <span className="text-[10px] text-text-muted uppercase tracking-wide">
                              {meta?.subtext || `ID: ${r.targetId}`}
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
                          <span className="italic text-text-muted">
                            Nhiều người báo cáo
                          </span>
                        ) : (
                          targetMetadata[`USER_${r.reports[0].reporterId}`]
                            ?.name ||
                          r.reporterUsername ||
                          "Ẩn danh"
                        )}
                      </td>

                      {/* REASON */}
                      <td className="px-6 py-4">
                        {r.reports.length > 1 ? (
                          <div className="flex flex-col gap-1">
                            <span className="px-3 py-1 text-[11px] font-bold rounded-lg bg-surface-dark text-white border border-border-dark/50 shadow-sm inline-block max-w-[200px] truncate">
                              {r.reason}
                            </span>
                            <span className="text-[10px] text-text-muted">
                              và {r.reports.length - 1} lý do khác...
                            </span>
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
                          ? new Date(r.createdAt).toLocaleDateString("vi-VN")
                          : "-"}
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border ${
                            statusMap[r.status]?.bg || "bg-gray-500/10"
                          } ${
                            statusMap[r.status]?.border || "border-gray-500/20"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              statusMap[r.status]?.color?.replace(
                                "text-",
                                "bg-",
                              ) || "bg-gray-500"
                            }`}
                          ></div>
                          <span
                            className={`text-xs font-bold ${
                              statusMap[r.status]?.color || "text-gray-400"
                            }`}
                          >
                            {statusMap[r.status]?.label || r.status}
                          </span>
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4 text-right">
                        {r.status === "RESOLVED" ? (
                          <div className="flex flex-col items-end gap-1">
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded border ${
                                isDeleted
                                  ? "bg-red-500/10 text-red-500 border-red-500/20"
                                  : "bg-green-500/10 text-green-500 border-green-500/20"
                              }`}
                            >
                              {isDeleted ? "Vô hiệu hóa" : "Đang hoạt động"}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-text-muted mt-1">
                              <User size={12} />
                              <span className="font-bold">
                                {targetMetadata[`USER_${r.reviewerId}`]?.name ||
                                  "Admin"}
                              </span>
                              <span className="mx-1">•</span>
                              <span>
                                {new Date(
                                  r.updatedAt || r.createdAt,
                                ).toLocaleDateString("vi-VN")}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleShowDetail(r)}
                              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/20 hover:border-primary/50"
                            >
                              Chi tiết
                            </button>

                            {r.status !== "RESOLVED" && (
                              <>
                                {r.targetType === "USER" && (
                                  <button
                                    onClick={() =>
                                      confirmAction(
                                        () =>
                                          onBanUser(
                                            r.targetId,
                                            r.reports[0].id,
                                          ),
                                        "Cấm người dùng?",
                                        `Bạn có chắc chắn muốn khóa tài khoản người dùng #${r.targetId}? Hành động này sẽ vô hiệu hóa quyền truy cập của họ.`,
                                      )
                                    }
                                    className="px-4 py-1.5 text-xs font-bold rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20 hover:border-red-500/50"
                                  >
                                    Cấm
                                  </button>
                                )}
                                {r.targetType === "GROUP" && (
                                  <button
                                    onClick={() =>
                                      confirmAction(
                                        () =>
                                          onDeleteGroup(
                                            r.targetId,
                                            r.reports[0].id,
                                          ),
                                        "Xóa nhóm?",
                                        `Bạn có chắc chắn muốn xóa nhóm #${r.targetId}?`,
                                      )
                                    }
                                    className="px-4 py-1.5 text-xs font-bold rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20 hover:border-red-500/50"
                                  >
                                    Xóa Nhóm
                                  </button>
                                )}
                                {r.targetType === "POST" && (
                                  <button
                                    onClick={() =>
                                      confirmAction(
                                        () =>
                                          onDeletePost(
                                            r.targetId,
                                            r.reports[0].id,
                                          ),
                                        "Xóa bài viết?",
                                        `Bạn có chắc chắn muốn xóa bài viết #${r.targetId}?`,
                                      )
                                    }
                                    className="px-4 py-1.5 text-xs font-bold rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20 hover:border-red-500/50"
                                  >
                                    Xóa Bài Viết
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* ... (Modals remain unchanged but are included in file content) */}
        {detailModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-surface-dark w-full max-w-4xl max-h-[90vh] rounded-3xl border border-border-dark shadow-2xl overflow-hidden flex flex-col">
              {/* HEADER */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
                <h3 className="text-xl font-black text-white flex items-center gap-3">
                  <ShieldCheck className="text-primary size-6" />
                  Chi tiết báo cáo
                </h3>
                <button
                  onClick={closeDetailModal}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-white transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              {/* CONTENT */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* LEFT: TARGET INFO */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-text-muted uppercase tracking-wider mb-4">
                      Thông tin đối tượng
                    </h4>

                    {detailModal.loading ? (
                      <div className="flex items-center gap-3 text-text-muted">
                        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        Đang tải thông tin...
                      </div>
                    ) : detailModal.targetData ? (
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/5 space-y-4">
                        {/* Dynamic Render based on type */}
                        <div
                          className={`flex items-center gap-4 ${
                            detailModal.report.targetType === "USER"
                              ? "cursor-pointer hover:bg-white/5 p-2 -m-2 rounded-lg transition-colors"
                              : ""
                          }`}
                          onClick={() =>
                            detailModal.report.targetType === "USER" &&
                            setViewingReporterId(detailModal.report.targetId)
                          }
                        >
                          {detailModal.report.targetType === "USER" && (
                            <img
                              src={
                                detailModal.targetData.avatarUrl ||
                                detailModal.targetData.currentAvatarUrl
                              }
                              className="w-16 h-16 rounded-full bg-black/30 object-cover"
                              alt=""
                            />
                          )}
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {detailModal.targetData.fullName ||
                                detailModal.targetData.name ||
                                detailModal.targetData.username ||
                                `ID: ${detailModal.report.targetId}`}
                            </h3>
                            <p className="text-text-muted text-sm">
                              {detailModal.report.targetType} #
                              {detailModal.report.targetId}
                            </p>
                          </div>
                          {detailModal.report.targetType === "USER" && (
                            <ChevronRight className="text-text-muted ml-auto size-5" />
                          )}
                        </div>

                        {/* Content Preview for Post */}
                        {detailModal.report.targetType === "POST" && (
                          <div className="bg-black/20 p-4 rounded-xl text-sm italic text-gray-300 border-l-2 border-primary">
                            "{detailModal.targetData.content}"
                            {detailModal.targetData.images?.length > 0 && (
                              <img
                                src={detailModal.targetData.images[0]}
                                className="mt-2 rounded-lg max-h-40 object-cover"
                                alt=""
                              />
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                        Không tìm thấy dữ liệu đối tượng (Có thể đã bị xóa)
                      </div>
                    )}

                    {/* HISTORY SECTION */}
                    {(() => {
                      const history = getViolationHistory(
                        detailModal.report.targetId,
                        detailModal.report.targetType,
                      );
                      return (
                        <div className="mt-6 bg-orange-500/5 border border-orange-500/10 rounded-lg p-5">
                          <h4 className="text-sm font-black text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <History className="size-5" />
                            Lịch sử vi phạm ({history.length})
                          </h4>
                          {history.length > 0 ? (
                            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                              {history.map((h, i) => (
                                <div
                                  key={i}
                                  className="text-xs text-text-muted border-l-2 border-orange-500/20 pl-3 py-1"
                                >
                                  <span className="font-bold text-gray-300">
                                    {h.reason}
                                  </span>
                                  <span className="mx-2 text-[10px]">•</span>
                                  <span className="text-[10px]">
                                    {new Date(
                                      h.createdAt || h.created_at,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-text-muted italic">
                              Không có vi phạm nào trước đây.
                            </p>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* RIGHT: REPORTS LIST */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-text-muted uppercase tracking-wider mb-4">
                      Danh sách báo cáo ({detailModal.report.reports.length})
                    </h4>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {detailModal.report.reports.map((r, idx) => (
                        <div
                          key={idx}
                          className="bg-white/5 p-4 rounded-xl border border-white/5 flex gap-3 hover:bg-white/10 transition-colors"
                        >
                          <div className="shrink-0">
                            {targetMetadata[`USER_${r.reporterId}`]?.avatar ? (
                              <img
                                src={
                                  targetMetadata[`USER_${r.reporterId}`].avatar
                                }
                                className="w-8 h-8 rounded-full object-cover border border-white/10"
                                alt=""
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0 border border-white/10">
                                {(
                                  targetMetadata[`USER_${r.reporterId}`]
                                    ?.name ||
                                  r.reporterUsername ||
                                  "?"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p
                                className="text-white font-bold text-sm hover:underline cursor-pointer truncate"
                                onClick={() =>
                                  r.reporterId &&
                                  setViewingReporterId(r.reporterId)
                                }
                              >
                                {targetMetadata[`USER_${r.reporterId}`]?.name ||
                                  r.reporterUsername ||
                                  "Ẩn danh"}
                              </p>
                              <span className="text-[10px] text-text-muted shrink-0 ml-2">
                                {new Date(r.createdAt).toLocaleString("vi-VN")}
                              </span>
                            </div>

                            <p className="text-xs text-primary mt-0.5 break-words font-medium bg-primary/5 inline-block px-1.5 py-0.5 rounded">
                              {r.reason}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions in Modal */}
              </div>

              {/* Quick Actions - Sticky Bottom */}
              {!detailModal.loading &&
                detailModal.targetData &&
                detailModal.report.status !== "RESOLVED" && (
                  <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-bold text-sm">
                          Hành động nhanh
                        </p>
                        <p className="text-xs text-text-muted">
                          Xử lý {detailModal.report.reports?.length} báo cáo này
                          ngay lập tức
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleResolveReport(detailModal.report.reports)
                          }
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10 transition-all"
                        >
                          Bỏ qua (Đã xử lý)
                        </button>

                        {detailModal.report.targetType === "USER" && (
                          <button
                            onClick={() =>
                              confirmAction(
                                () =>
                                  onBanUser(
                                    detailModal.report.targetId,
                                    detailModal.report.reports,
                                  ),
                                "Khóa tài khoản",
                                "Xác nhận khóa tài khoản người dùng này?",
                              )
                            }
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-red-500/20 transition-all"
                          >
                            Khóa Tài Khoản
                          </button>
                        )}

                        {detailModal.report.targetType === "POST" && (
                          <button
                            onClick={() =>
                              confirmAction(
                                () =>
                                  onDeletePost(
                                    detailModal.report.targetId,
                                    detailModal.report.reports,
                                  ),
                                "Xóa bài viết",
                                "Xác nhận xóa bài viết này?",
                              )
                            }
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-red-500/20 transition-all"
                          >
                            Xóa Bài Viết
                          </button>
                        )}

                        {detailModal.report.targetType === "GROUP" && (
                          <button
                            onClick={() =>
                              confirmAction(
                                () =>
                                  onDeleteGroup(
                                    detailModal.report.targetId,
                                    detailModal.report.reports,
                                  ),
                                "Xóa nhóm",
                                "Xác nhận xóa nhóm này?",
                              )
                            }
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-red-500/20 transition-all"
                          >
                            Xóa Nhóm
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* --- CONFIRM DIALOG --- */}
        {confirmConfig.isOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in zoom-in-95 duration-200">
            <div className="bg-[#1e1e1e] w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4 text-2xl">
                !
              </div>
              <h3 className="text-xl font-black text-white mb-2">
                {confirmConfig.title}
              </h3>
              <p className="text-text-muted text-sm mb-6">
                {confirmConfig.message}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() =>
                    setConfirmConfig((prev) => ({ ...prev, isOpen: false }))
                  }
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
          <p className="text-sm text-text-muted">
            Hiển thị {filteredReports.length} kết quả
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs font-bold rounded bg-primary text-black">
              1
            </button>
            {/* Add more pagination logic if needed */}
          </div>
        </div>
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
              "Delete Group?",
              `Are you sure you want to delete ${group.name}?`,
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
