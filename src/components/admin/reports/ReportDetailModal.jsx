import React from "react";
import { X, ShieldCheck, ChevronRight, History, Lock } from "lucide-react";

const ReportDetailModal = ({
  isOpen,
  onClose,
  report, // Grouped/Detail report object
  targetData,
  loading,
  targetMetadata,
  violationHistory, // array or function if fetching async
  onResolve,
  onAction, // Generic action handler (props: actionType, targetId, reports)
  onReporterClick, // Handler when clicking on a user (reporter or target user)
}) => {
  if (!isOpen) return null;

  // Helper to handle actions based on target type
  const handleActionClick = (actionType) => {
    if (onAction) {
      onAction({
        type: actionType,
        targetId: report.targetId,
        reports: report.reports,
        groupId: report.groupId,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-4xl max-h-[90vh] rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-surface/50">
          <h3 className="text-xl font-black text-text-main flex items-center gap-3">
            <ShieldCheck className="text-primary size-6" />
            Chi tiết báo cáo
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-background hover:bg-border/50 flex items-center justify-center text-text-muted hover:text-text-main transition-all"
          >
            <X size={14} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* LEFT: TARGET INFO */}
              <div>
                <h4 className="text-sm font-black text-text-muted uppercase tracking-wider mb-4">
                  Thông tin đối tượng
                </h4>
                {targetData ? (
                  <div className="bg-background/40 border border-border/50 rounded-2xl p-5 overflow-hidden relative">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    {/* Target Header */}
                    <div
                      className={`flex items-center gap-4 mb-6 relative z-10 ${report.targetType === "USER"
                          ? "cursor-pointer hover:bg-background/20 p-2 -m-2 rounded-lg transition-colors"
                          : ""
                        }`}
                      onClick={() =>
                        report.targetType === "USER" &&
                        onReporterClick &&
                        onReporterClick(report.targetId)
                      }
                    >
                      {(targetData.avatar ||
                        targetData.currentAvatarUrl ||
                        targetData.image) && (
                          <div className="relative">
                            <img
                              src={
                                targetData.avatar ||
                                targetData.currentAvatarUrl ||
                                targetData.image
                              }
                              className="w-16 h-16 rounded-xl object-cover bg-background border-2 border-border shadow-lg"
                              alt=""
                            />
                            {report.targetType === "USER" &&
                              targetData.locked && (
                                <div className="absolute -bottom-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg border-2 border-[#1e1e1e]">
                                  <Lock size={12} />
                                </div>
                              )}
                          </div>
                        )}
                      <div>
                        <h3 className="text-xl font-bold text-text-main">
                          {targetData.fullName ||
                            targetData.name ||
                            targetData.username ||
                            `ID: ${report.targetId}`}
                        </h3>
                        <p className="text-text-muted text-sm">
                          {report.targetType} #{report.targetId}
                        </p>
                      </div>
                      {report.targetType === "USER" && (
                        <ChevronRight className="text-text-muted ml-auto size-5" />
                      )}
                    </div>

                    {/* Content Preview for Post */}
                    {report.targetType === "POST" && (
                      <div className="space-y-4">
                        {/* Author Info */}
                        <div className="flex items-center gap-3 bg-background/50 p-3 rounded-xl border border-border/50">
                          <img
                            src={
                              targetData.authorAvatar ||
                              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            className="w-10 h-10 rounded-full object-cover bg-background"
                            alt=""
                          />
                          <div>
                            <h5 className="text-sm font-bold text-text-main">
                              {targetData.authorFullName ||
                                targetData.authorName ||
                                "Người dùng"}
                            </h5>
                            <div className="text-xs text-text-muted flex flex-wrap items-center gap-x-2">
                              <span>
                                {new Date(
                                  targetData.createdAt,
                                ).toLocaleDateString("vi-VN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>

                              {(targetData.groupName || targetData.groupId) && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1 text-primary">
                                    Đăng trong nhóm
                                    <span className="font-bold underline cursor-pointer">
                                      {targetData.groupName ||
                                        `#${targetData.groupId}`}
                                    </span>
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="bg-background/20 p-4 rounded-xl text-sm text-text-secondary border-l-2 border-primary">
                          <p className="whitespace-pre-wrap italic">
                            "{targetData.content}"
                          </p>
                          {targetData.images?.length > 0 && (
                            <div className="mt-3 grid grid-cols-2 gap-2">
                              {targetData.images.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  className="rounded-lg w-full h-32 object-cover border border-border"
                                  alt=""
                                />
                              ))}
                            </div>
                          )}

                          {targetData.media?.some(
                            (m) => m.type === "VIDEO",
                          ) && (
                              <div className="mt-2 text-xs text-text-muted flex items-center gap-1">
                                <span className="bg-white/10 px-2 py-0.5 rounded">
                                  Có đính kèm video
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    Không tìm thấy dữ liệu đối tượng (Có thể đã bị xóa)
                  </div>
                )}

                {/* HISTORY SECTION */}
                <div className="mt-6 bg-orange-500/5 border border-orange-500/10 rounded-lg p-5">
                  <h4 className="text-sm font-black text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <History className="size-5" />
                    Lịch sử vi phạm ({violationHistory?.length || 0})
                  </h4>
                  {violationHistory?.length > 0 ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                      {violationHistory.map((h, i) => (
                        <div
                          key={i}
                          className="text-xs text-text-muted border-l-2 border-orange-500/20 pl-3 py-1"
                        >
                          <span className="font-bold text-text-main">
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
              </div>

              {/* RIGHT: REPORTS LIST */}
              <div className="space-y-6">
                <h4 className="text-sm font-black text-text-muted uppercase tracking-wider mb-4">
                  Danh sách báo cáo ({report.reports.length})
                </h4>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {report.reports.map((r, idx) => {
                    const parts = (r.reason || "").split("|");
                    const mainReason = parts[0].trim();
                    const detailReason =
                      parts.length > 1 ? parts.slice(1).join("|").trim() : null;

                    return (
                      <div
                        key={idx}
                        className="bg-background/40 p-4 rounded-xl border border-border/50 flex gap-3 hover:bg-background/60 transition-colors"
                      >
                        <div className="shrink-0">
                          {targetMetadata[`USER_${r.reporterId}`]?.avatar ? (
                            <img
                              src={
                                targetMetadata[`USER_${r.reporterId}`].avatar
                              }
                              className="w-8 h-8 rounded-full object-cover border border-border"
                              alt=""
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0 border border-border">
                              {(
                                targetMetadata[`USER_${r.reporterId}`]?.name ||
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
                              className="text-text-main font-bold text-sm hover:underline cursor-pointer truncate"
                              onClick={() =>
                                onReporterClick && onReporterClick(r.reporterId)
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

                          <div className="mt-1.5 flex flex-wrap gap-2 items-center">
                            <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                              {mainReason}
                            </span>
                          </div>

                          {detailReason && (
                            <p className="text-xs text-text-muted mt-1.5 leading-relaxed bg-black/20 p-2 rounded-lg italic">
                              "{detailReason}"
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions - Sticky Bottom */}
        {!loading && targetData && report.status !== "RESOLVED" && (
          <div className="p-6 border-t border-border bg-surface/90 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-main font-bold text-sm">
                  Hành động nhanh
                </p>
                <p className="text-xs text-text-muted">
                  Xử lý {report.reports?.length} báo cáo này ngay lập tức
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onResolve(report.reports)}
                  className="px-4 py-2 bg-background hover:bg-border text-text-main text-xs font-bold rounded-lg border border-border transition-all"
                >
                  Bỏ qua (Đã xử lý)
                </button>

                {report.targetType === "USER" && (
                  <button
                    onClick={() => handleActionClick("BAN_USER")}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-red-500/20 transition-all"
                  >
                    Khóa Tài Khoản
                  </button>
                )}

                {report.targetType === "POST" && (
                  <button
                    onClick={() => handleActionClick("DELETE_POST")}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg shadow-lg shadow-red-500/20 transition-all"
                  >
                    Xóa Bài Viết
                  </button>
                )}

                {report.targetType === "GROUP" && (
                  <button
                    onClick={() => handleActionClick("DELETE_GROUP")}
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
  );
};

export default ReportDetailModal;
