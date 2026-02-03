import { X, ShieldCheck, AlertCircle, History, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  findById as findGroupById,
  getGroupMembers,
  getGroupPosts,
} from "../../services/groups/GroupService";
import toast from "react-hot-toast";

const GroupInspectorModal = ({
  groupId,
  reports = [],
  reporterMetadata = {},
  violationHistory = [],
  onClose,
  onIgnore,
  onAction,
  onReporterClick,
  reporterStatsGetter,
  actionLabel = "Xóa nhóm",
}) => {
  const [inspectorData, setInspectorData] = useState({
    group: null,
    members: [],
    posts: [],
    loading: true,
    activeTab: "overview",
  });

  const isResolved =
    reports &&
    reports.length > 0 &&
    reports.every((r) => r.status === "RESOLVED");

  useEffect(() => {
    if (!groupId) return;

    const fetchData = async () => {
      setInspectorData((prev) => ({ ...prev, loading: true }));
      try {
        const [group, members, posts] = await Promise.all([
          findGroupById(groupId).catch((e) => {
            throw e;
          }),
          getGroupMembers(groupId).catch((e) => []),
          getGroupPosts(groupId).catch((e) => []),
        ]);
        setInspectorData({
          group,
          members,
          posts,
          loading: false,
          activeTab: "overview",
        });
      } catch (error) {
        console.error("Inspector error:", error);
        toast.error("Không thể tải thông tin nhóm");
        onClose();
      }
    };

    fetchData();
  }, [groupId]);

  if (!groupId) return null;

  const hasReports = reports && reports.length > 0;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-background/95 backdrop-blur-md animate-in fade-in duration-300">
      {inspectorData.loading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="text-text-main font-bold tracking-widest uppercase text-xs">
            ĐANG TẢI THÔNG TIN NHÓM
          </div>
        </div>
      ) : (
        <div
          className={`bg-surface w-full ${hasReports ? "max-w-[75rem]" : "max-w-5xl"
            } h-[85vh] rounded-[2.5rem] border border-border/50 shadow-2xl overflow-hidden flex animate-in zoom-in-95 duration-300`}
        >
          {/* MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Modal Header */}
            <div className="relative h-48 shrink-0">
              <img
                src={
                  inspectorData.group?.image ||
                  `https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80`
                }
                className="w-full h-full object-cover"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent"></div>

              {!hasReports && (
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 size-10 rounded-full bg-black/40 text-white backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-all border border-white/10 z-10"
                >
                  <X size={20} />
                </button>
              )}

              <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-black text-text-main tracking-tight">
                      {inspectorData.group?.name}
                    </h2>
                    <span
                      className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border backdrop-blur-md ${inspectorData.group?.privacy === "PUBLIC"
                          ? "bg-green-500/20 text-green-400 border-green-500/20"
                          : "bg-orange-500/20 text-orange-400 border-orange-500/20"
                        }`}
                    >
                      {inspectorData.group?.privacy === "PUBLIC"
                        ? "CÔNG KHAI"
                        : "RIÊNG TƯ"}
                    </span>
                  </div>
                  <p className="text-text-main/80 text-sm max-w-2xl line-clamp-1">
                    {inspectorData.group?.description || "Chưa có mô tả."}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs & Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-8 border-b border-border/50 flex gap-6 shrink-0">
                {[
                  { id: "overview", label: "Tổng quan" },
                  { id: "members", label: "Thành viên" },
                  { id: "posts", label: "Bài viết" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setInspectorData((prev) => ({
                        ...prev,
                        activeTab: tab.id,
                      }))
                    }
                    className={`py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${inspectorData.activeTab === tab.id
                        ? "text-primary border-primary"
                        : "text-text-muted border-transparent hover:text-text-main"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-background/30">
                {inspectorData.activeTab === "overview" && (
                  <div
                    className={`grid grid-cols-1 ${hasReports ? "" : "md:grid-cols-2"
                      } gap-6`}
                  >
                    <div className="bg-surface p-6 rounded-3xl border border-border/50 space-y-4">
                      <h3 className="text-xl font-bold text-text-main">
                        Thông tin chung
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-border/30">
                          <span className="text-text-muted">Chủ sở hữu</span>
                          <span className="text-text-main font-bold">
                            {inspectorData.members.find(
                              (m) => m.userId === inspectorData.group?.ownerId,
                            )?.fullName ||
                              inspectorData.group?.ownerName ||
                              "Không rõ"}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/30">
                          <span className="text-text-muted">Ngày tạo</span>
                          <span className="text-text-main font-bold">
                            {inspectorData.group?.createdAt
                              ? new Date(
                                inspectorData.group.createdAt,
                              ).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/30">
                          <span className="text-text-muted">
                            Số lượng thành viên
                          </span>
                          <span className="text-text-main font-bold">
                            {inspectorData.members.length}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/30">
                          <span className="text-text-muted">
                            Số lượng bài viết
                          </span>
                          <span className="text-text-main font-bold">
                            {inspectorData.posts.length}
                          </span>
                        </div>
                      </div>
                    </div>

                    {!hasReports && (
                      <div className="bg-surface p-6 rounded-3xl border border-border/50 space-y-4 flex flex-col items-center justify-center text-center">
                        <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                          <ShieldCheck size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-text-main">
                          Hành động quản trị
                        </h3>
                        <p className="text-text-muted text-sm">
                          Thực hiện các biện pháp xử lý đối với nhóm này.
                        </p>
                        <div className="flex gap-3 w-full mt-4">
                          <button
                            onClick={() =>
                              onAction && onAction(inspectorData.group)
                            }
                            className="flex-1 py-3 bg-red-500/10 text-red-500 font-bold rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                          >
                            {actionLabel}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {inspectorData.activeTab === "members" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inspectorData.members.map((member) => (
                      <div
                        key={member.userId}
                        className="bg-surface p-4 rounded-2xl border border-border/50 flex items-center gap-3"
                      >
                        <img
                          src={member.avatarUrl}
                          className="size-10 rounded-full bg-surface border border-border"
                          alt=""
                        />
                        <div className="overflow-hidden">
                          <p className="text-text-main font-bold truncate">
                            {member.fullName}
                          </p>
                          <span
                            className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${member.role === "ADMIN"
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-background text-text-muted"
                              }`}
                          >
                            {member.role === "ADMIN"
                              ? "QUẢN TRỊ VIÊN"
                              : "THÀNH VIÊN"}
                          </span>
                        </div>
                      </div>
                    ))}
                    {inspectorData.members.length === 0 && (
                      <div className="col-span-full py-10 text-center text-text-muted">
                        Không tìm thấy thành viên nào.
                      </div>
                    )}
                  </div>
                )}

                {inspectorData.activeTab === "posts" && (
                  <div className="space-y-4 max-w-3xl mx-auto">
                    {inspectorData.posts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-surface p-6 rounded-3xl border border-border/50 space-y-4"
                      >
                        <div className="flex items-center gap-3 border-b border-border/30 pb-4">
                          <img
                            src={post.authorAvatar}
                            className="size-10 rounded-full"
                            alt=""
                          />
                          <div>
                            <p className="text-text-main font-bold">
                              {post.authorFullName}
                            </p>
                            <p className="text-text-muted text-xs">
                              {new Date(post.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <span
                            className={`ml-auto px-2 py-1 rounded-lg text-[10px] font-black uppercase ${post.status === "APPROVED"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                              }`}
                          >
                            {post.status === "APPROVED" ? "ĐÃ DUYỆT" : "CHỜ DUYỆT"}
                          </span>
                        </div>
                        <div className="text-text-main/90 whitespace-pre-wrap text-sm leading-relaxed">
                          {post.content}
                        </div>
                        {post.images && post.images.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {post.images.map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                className="rounded-xl w-full h-40 object-cover border border-border/30"
                                alt=""
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {inspectorData.posts.length === 0 && (
                      <div className="py-10 text-center text-text-muted">
                        Không tìm thấy bài viết nào.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SIDEBAR (Only rendered if reports exist) */}
          {hasReports && (
            <div className="w-[450px] bg-background border-l border-border/50 flex flex-col shrink-0">
              {/* Sidebar Header */}
              <div className="p-5 border-b border-border/50 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-text-main flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">
                    verified_user
                  </span>
                  Chi tiết báo cáo ({reports.length})
                </h3>
                <button
                  onClick={onClose}
                  className="text-text-muted hover:text-text-main transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">
                    close
                  </span>
                </button>
              </div>

              {/* History Block */}
              <div className="p-4 bg-orange-500/5 mx-4 mt-4 mb-0 rounded-md border border-orange-500/10">
                <h4 className="text-[10px] font-black uppercase text-orange-400 tracking-wider mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    history
                  </span>
                  Lịch sử bị báo cáo ({violationHistory.length})
                </h4>
                {violationHistory.length > 0 ? (
                  <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                    {violationHistory.map((h, i) => (
                      <div
                        key={i}
                        className="text-[10px] text-text-muted border-l-2 border-orange-500/20 pl-2"
                      >
                        <span className="text-text-main font-bold block truncate">
                          {h.reason}
                        </span>
                        <span>
                          {new Date(h.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-text-muted italic">
                    Nhóm này chưa có tiền án nào.
                  </p>
                )}
              </div>

              {/* Reports List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {reports.map((report, idx) => {
                  const reporterInfo =
                    reporterMetadata[`USER_${report.reporterId}`];
                  const parts = (report.reason || "").split("|");
                  const mainReason = parts[0].trim();
                  const detailReason =
                    parts.length > 1 ? parts.slice(1).join("|").trim() : null;

                  // Calculate reporter stats (Global if provided, else Local)
                  const reporterStats = reporterStatsGetter
                    ? reporterStatsGetter(report.reporterId)
                    : reports.filter((r) => r.reporterId === report.reporterId)
                      .length;

                  const isHighRisk = reporterStats > 10;
                  const isMediumRisk = reporterStats > 5;

                  return (
                    <div
                      key={idx}
                      className="bg-surface p-4 rounded-lg border border-border/50 flex gap-3 hover:bg-surface/80 transition-colors"
                    >
                      <div
                        className="shrink-0 relative group cursor-pointer"
                        onClick={() =>
                          onReporterClick && onReporterClick(report.reporterId)
                        }
                        title="Xem thông tin người báo cáo"
                      >
                        {/* Avatar Wrapper */}
                        <div className="relative shrink-0">
                          {reporterInfo?.avatar ? (
                            <img
                              src={reporterInfo.avatar}
                              className="size-8 rounded-full object-cover border border-border shadow-sm group-hover:border-primary/50 transition-colors"
                              alt=""
                            />
                          ) : (
                            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0 border border-border">
                              {(
                                reporterInfo?.name ||
                                report.reporterUsername ||
                                "R"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}

                          {/* Spam Warning Badge */}
                          {isMediumRisk && (
                            <div
                              className={`absolute -top-1.5 -right-1.5 size-5 rounded-full flex items-center justify-center border-2 border-[#1e120f] ${isHighRisk ? "bg-red-500" : "bg-orange-500"
                                }`}
                              title={`Đã gửi ${reporterStats} báo cáo`}
                            >
                              <span className="material-symbols-outlined text-[14px] text-white leading-none">
                                priority_high
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2 max-w-[80%]">
                            <p
                              className="text-text-main font-bold text-sm hover:underline cursor-pointer truncate"
                              onClick={() =>
                                onReporterClick &&
                                onReporterClick(report.reporterId)
                              }
                            >
                              {reporterInfo?.name ||
                                report.reporterUsername ||
                                "Người Báo Cáo"}
                            </p>
                            {reporterStats > 1 && (
                              <span
                                className={`text-[9px] px-1.5 py-0.5 rounded border ${isHighRisk
                                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                                    : "bg-background text-text-muted border-border"
                                  }`}
                              >
                                {reporterStats} báo cáo
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-text-muted shrink-0 ml-2">
                            {new Date(report.createdAt).toLocaleString("vi-VN")}
                          </span>
                        </div>

                        <div className="mt-1.5 flex flex-wrap gap-2 items-center">
                          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                            {mainReason}
                          </span>
                        </div>

                        {detailReason && (
                          <p className="text-xs text-text-muted mt-1.5 leading-relaxed bg-background p-2 rounded-lg italic">
                            "{detailReason}"
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sidebar Footer Actions or Resolution Info */}
              <div className="p-5 border-t border-border/50 bg-surface/50 space-y-3">
                {isResolved ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
                        Biện pháp
                      </p>
                      <p className="text-sm font-bold text-green-400 bg-green-400/10 px-3 py-2 rounded-lg border border-green-400/20">
                        Đã xử lý / Giữ nguyên
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
                        Người thực hiện
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                          A
                        </div>
                        <p className="text-text-main font-bold text-sm">
                          Admin
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-[10px] text-text-muted text-center uppercase tracking-widest font-bold mb-2">
                      Hành động quản trị viên cho Nhóm này
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={onIgnore}
                        className="flex-1 py-3 bg-surface hover:bg-surface/80 text-text-main/80 font-bold rounded-xl transition-all border border-border text-xs"
                      >
                        Bỏ qua (Đã xử lý)
                      </button>
                      <button
                        onClick={() =>
                          onAction && onAction(inspectorData.group)
                        }
                        className="flex-1 py-3 bg-[#ff3b3b] hover:bg-[#ff3b3b]/90 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(255,59,59,0.3)] text-xs"
                      >
                        <Trash2 size={16} />
                        {actionLabel}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupInspectorModal;
