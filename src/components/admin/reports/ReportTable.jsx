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
    <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-background/80 text-xs font-black uppercase text-text-muted tracking-wider border-b border-border">
            <tr>
              <th className="px-6 py-4">Mục tiêu</th>
              <th className="px-6 py-4">Người báo cáo</th>
              <th className="px-6 py-4">Lý do chính</th>
              <th className="px-6 py-4">Thời gian</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {reports.map((r) => {
              const isItemDeleted = isDeletedFunc(r);

              return (
                <tr
                  key={`${r.targetType}_${r.targetId}_${r.createdAt}`}
                  className="hover:bg-background transition-all group"
                >
                  {/* TARGET */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        {targetMetadata[`${r.targetType}_${r.targetId}`]
                          ?.avatar ? (
                          <img
                            src={
                              targetMetadata[`${r.targetType}_${r.targetId}`]
                                .avatar
                            }
                            className="w-10 h-10 rounded-lg object-cover border border-primary/20 bg-background"
                            alt=""
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                            <span className="font-black text-primary text-xs">
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
                        <p className="font-bold text-text-main text-sm truncate max-w-[150px]">
                          {r.targetType === "USER"
                            ? targetMetadata[`USER_${r.targetId}`]?.name ||
                              "Người dùng"
                            : `ID: ${r.targetId}`}
                        </p>
                        <p className="text-[10px] text-text-muted">
                          #{r.targetId}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* REPORTER */}
                  <td className="px-6 py-4 font-medium text-text-secondary">
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
                            className="w-8 h-8 rounded-full object-cover border border-border/20"
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
                  <td className="px-6 py-4">
                    {r.reports.length > 1 ? (
                      <div className="flex flex-col gap-1">
                        <span className="px-3 py-1 text-[11px] font-bold rounded-lg bg-surface text-text-main border border-border/50 shadow-sm inline-block max-w-[200px] truncate">
                          {r.reason}
                        </span>
                        <span className="text-[10px] text-text-muted">
                          và {r.reports.length - 1} lý do khác...
                        </span>
                      </div>
                    ) : (
                      <span className="px-3 py-1 text-[11px] font-bold rounded-lg bg-surface text-text-main border border-border/50 shadow-sm inline-block max-w-[200px] truncate">
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
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                        statusMap[r.status]?.color || "text-text-main"
                      } ${statusMap[r.status]?.bg || "bg-gray-500/10"} ${
                        statusMap[r.status]?.border || "border-gray-500/20"
                      }`}
                    >
                      {statusMap[r.status]?.label || r.status}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-4 text-right">
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
        {totalPages > 0 && (
          <div className="flex items-center justify-between px-6 py-4 bg-background/80 border-t border-border/50">
            <span className="text-sm text-text-muted">
              Hiển thị trang{" "}
              <span className="text-text-main font-bold">
                {currentPage + 1}
              </span>{" "}
              trên{" "}
              <span className="text-text-main font-bold">{totalPages}</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => fetchReports(currentPage - 1)}
                disabled={currentPage === 0}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  currentPage === 0
                    ? "bg-transparent text-gray-600 border-gray-700 cursor-not-allowed"
                    : "bg-surface text-text-muted hover:text-text-main border-border hover:border-primary"
                }`}
              >
                Trước
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pNum = i;
                  if (totalPages > 5) {
                    if (currentPage < 3) pNum = i;
                    else if (currentPage >= totalPages - 3)
                      pNum = totalPages - 5 + i;
                    else pNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pNum}
                      onClick={() => fetchReports(pNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border ${
                        currentPage === pNum
                          ? "bg-primary text-black border-primary"
                          : "bg-surface text-text-muted hover:text-text-main border-border hover:border-primary"
                      }`}
                    >
                      {pNum + 1}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => fetchReports(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  currentPage === totalPages - 1
                    ? "bg-transparent text-gray-600 border-gray-700 cursor-not-allowed"
                    : "bg-surface text-text-muted hover:text-text-main border-border hover:border-primary"
                }`}
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportTable;
