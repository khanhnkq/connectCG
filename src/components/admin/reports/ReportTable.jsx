import React from "react";
import { Info, CheckCircle2 } from "lucide-react";

const ReportTable = ({
  reports,
  isLoading,
  pagination,
  targetMetadata,
  onShowDetail,
  onResolve,
  statusMap,
  isDeletedFunc = () => false,
  fetchReports, // Function to change page
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-text-muted">
        <div className="w-16 h-16 rounded-full bg-text-main/5 flex items-center justify-center mb-4">
          <Info className="w-8 h-8 text-text-muted/50" />
        </div>
        <p>Không có báo cáo nào</p>
      </div>
    );
  }

  const { currentPage, totalPages } = pagination;

  return (
    <div className="bg-surface-main rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-background-main text-sm font-extrabold uppercase text-text-secondary tracking-wider">
            <tr>
              <th className="px-8 py-5">Mục tiêu</th>
              <th className="px-8 py-5">Người báo cáo</th>
              <th className="px-8 py-5">Lý do chính</th>
              <th className="px-8 py-5">Thời gian</th>
              <th className="px-8 py-5">Trạng thái</th>
              <th className="px-8 py-5 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-base">
            {reports.map((r) => {
              const isItemDeleted = isDeletedFunc(r);

              return (
                <tr
                  key={`${r.targetType}_${r.targetId}_${r.createdAt}`}
                  className="hover:bg-surface-main/60 transition-all group border-b border-border-main/40 last:border-0"
                >
                  {/* TARGET */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        {targetMetadata[`${r.targetType}_${r.targetId}`]
                          ?.avatar ? (
                          <img
                            src={
                              targetMetadata[`${r.targetType}_${r.targetId}`]
                                .avatar
                            }
                            className="w-12 h-12 rounded-xl object-cover bg-background"
                            alt=""
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="font-black text-primary text-base">
                              {r.targetType === "USER"
                                ? "U"
                                : r.targetType === "GROUP"
                                ? "G"
                                : "P"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-text-main text-base truncate max-w-[200px]">
                          {r.targetType === "USER"
                            ? targetMetadata[`USER_${r.targetId}`]?.name ||
                              "Người dùng"
                            : r.targetType === "GROUP"
                            ? targetMetadata[`GROUP_${r.targetId}`]?.name ||
                              `Nhóm ${r.targetId}`
                            : `Post #${r.targetId}`}
                        </p>
                        <p className="text-xs text-text-muted font-bold mt-0.5">
                          #{r.targetId}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* REPORTER */}
                  <td className="px-8 py-5 font-bold text-text-secondary">
                    {r.reports.length > 1 ? (
                      <span className="italic text-text-muted">
                        Nhiều người báo cáo
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        {targetMetadata[`USER_${r.reports[0].reporterId}`]
                          ?.avatar ? (
                          <img
                            src={
                              targetMetadata[`USER_${r.reports[0].reporterId}`]
                                .avatar
                            }
                            className="w-10 h-10 rounded-full object-cover"
                            alt=""
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-text-main/5 flex items-center justify-center text-[10px] font-bold">
                            {(
                              targetMetadata[`USER_${r.reports[0].reporterId}`]
                                ?.name ||
                              r.reporterUsername ||
                              "?"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                        <span className="truncate max-w-[120px]">
                          {targetMetadata[`USER_${r.reports[0].reporterId}`]
                            ?.name ||
                            r.reporterUsername ||
                            "Ẩn danh"}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* REASON */}
                  <td className="px-8 py-5">
                    {r.reports.length > 1 ? (
                      <div className="flex flex-col gap-1.5">
                        <span className="px-4 py-1.5 text-sm font-extrabold rounded-xl bg-surface text-text-main inline-block max-w-[250px] truncate">
                          {r.reason}
                        </span>
                        <span className="text-[10px] text-text-muted">
                          và {r.reports.length - 1} lý do khác...
                        </span>
                      </div>
                    ) : (
                      <span className="px-3 py-1 text-[11px] font-extrabold rounded-lg bg-surface text-text-main inline-block max-w-[200px] truncate">
                        {r.reason}
                      </span>
                    )}
                  </td>

                  {/* DATE */}
                  <td className="px-8 py-5 text-text-muted font-bold text-sm">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString("vi-VN")
                      : "-"}
                  </td>

                  {/* STATUS */}
                  <td className="px-8 py-5">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap ${
                        statusMap[r.status]?.color || "text-text-main"
                      } ${statusMap[r.status]?.bg || "bg-gray-500/10"} `}
                    >
                      {statusMap[r.status]?.label || r.status}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onShowDetail(r)}
                        className="p-2 rounded-lg bg-surface border border-border/50 hover:bg-primary/20 hover:text-primary hover:border-primary/50 transition-all text-text-muted"
                        title="Xem chi tiết"
                      >
                        <Info size={16} />
                      </button>
                      {r.status !== "RESOLVED" && !isItemDeleted && (
                        <button
                          onClick={() => onResolve(r.reports)}
                          className="p-2 rounded-lg bg-surface border border-border/50 hover:bg-green-500/20 hover:text-green-500 hover:border-green-500/50 transition-all text-text-muted"
                          title="Đánh dấu đã xử lý"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* PAGINATION CONTROLS */}
        {/* PAGINATION CONTROLS */}
        {totalPages > 0 && (
          <div className="flex justify-between items-center bg-surface-main p-4 border-t border-border-main">
            <div className="text-text-secondary text-sm font-medium pl-2">
              Hiển thị trang{" "}
              <span className="text-text-main font-bold">
                {currentPage + 1}
              </span>{" "}
              / <span className="text-text-main font-bold">{totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchReports(currentPage - 1)}
                disabled={currentPage === 0}
                className="size-10 flex items-center justify-center bg-background-main border border-border-main rounded-xl text-text-secondary hover:text-primary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <div className="rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </button>
              <div className="h-10 px-4 flex items-center justify-center bg-background-main border border-border-main rounded-xl text-sm font-bold text-text-main shadow-sm min-w-[100px]">
                Trang {currentPage + 1} / {totalPages}
              </div>
              <button
                onClick={() => fetchReports(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="size-10 flex items-center justify-center bg-background-main border border-border-main rounded-xl text-text-secondary hover:text-primary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportTable;
