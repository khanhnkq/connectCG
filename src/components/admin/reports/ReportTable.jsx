import React from "react";
import {
  Info,
  CheckCircle,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import {
  Badge,
  Avatar,
  IconButton,
  Skeleton,
  EmptyState,
} from "../../ui";

const ReportTable = ({
  reports,
  isLoading,
  pagination,
  targetMetadata,
  onShowDetail,
  onResolve,
  statusMap,
  isDeletedFunc = () => false,
  fetchReports,
}) => {
  if (isLoading) {
    return (
      <div className="bg-surface-main rounded-2xl overflow-hidden border-0 shadow-sm p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-2">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-16 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <EmptyState
        icon={Info}
        title="Không có báo cáo nào"
        description="Hộp thư báo cáo hiện tại không có mục nào cần xử lý."
      />
    );
  }

  const { currentPage, totalPages } = pagination;

  return (
    <div className="bg-surface-main rounded-2xl overflow-hidden border-0 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-subtle text-[11px] uppercase font-bold text-text-secondary tracking-wider border-0">
            <tr>
              <th className="px-6 py-3.5">Mục tiêu</th>
              <th className="px-6 py-3.5">Người báo cáo</th>
              <th className="px-6 py-3.5">Lý do chính</th>
              <th className="px-6 py-3.5">Thời gian</th>
              <th className="px-6 py-3.5">Trạng thái</th>
              <th className="px-6 py-3.5 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {reports.map((r) => {
              const isItemDeleted = isDeletedFunc(r);

              return (
                <tr
                  key={`${r.targetType}_${r.targetId}_${r.createdAt}`}
                  className="hover:bg-surface-subtle/50 transition-colors text-text-main group"
                >
                  {/* TARGET */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <Badge variant="default" size="sm">
                        {r.targetType}
                      </Badge>
                      <span className="font-bold text-text-main text-sm truncate max-w-[180px]">
                        {targetMetadata[`${r.targetType}_${r.targetId}`]?.name ||
                          `#${r.targetId}`}
                      </span>
                    </div>
                  </td>

                  {/* REPORTER */}
                  <td className="px-6 py-4 font-semibold text-text-secondary">
                    {r.reports.length > 1 ? (
                      <span className="text-xs text-text-muted italic">
                        {r.reports.length} người báo cáo
                      </span>
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          src={targetMetadata[`USER_${r.reports[0].reporterId}`]?.avatar}
                          name={
                            targetMetadata[`USER_${r.reports[0].reporterId}`]?.name ||
                            r.reporterUsername ||
                            "?"
                          }
                          size="sm"
                        />
                        <span className="text-xs font-semibold text-text-main truncate max-w-[120px]">
                          {targetMetadata[`USER_${r.reports[0].reporterId}`]?.name ||
                            r.reporterUsername ||
                            "Ẩn danh"}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* REASON */}
                  <td className="px-6 py-4">
                    {r.reports.length > 1 ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold text-text-main max-w-[220px] truncate">
                          {r.reason}
                        </span>
                        <span className="text-[10px] text-text-muted">
                          và {r.reports.length - 1} báo cáo khác
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-text-main max-w-[220px] truncate block">
                        {r.reason}
                      </span>
                    )}
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-4 text-text-muted text-xs font-medium whitespace-nowrap">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString("vi-VN")
                      : "-"}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        r.status === "RESOLVED"
                          ? "success"
                          : r.status === "PENDING"
                          ? "warning"
                          : "default"
                      }
                      size="sm"
                    >
                      {statusMap[r.status]?.label || r.status}
                    </Badge>
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <IconButton
                        variant="secondary"
                        size="sm"
                        icon={Info}
                        aria-label="Xem chi tiết báo cáo"
                        onClick={() => onShowDetail(r)}
                      />
                      {r.status !== "RESOLVED" && !isItemDeleted && (
                        <IconButton
                          variant="secondary"
                          size="sm"
                          icon={CheckCircle}
                          aria-label="Đánh dấu đã xử lý"
                          onClick={() => onResolve(r.reports)}
                        />
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
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-surface-subtle/30 px-5 py-3 border-0">
            <div className="text-text-muted text-xs font-medium">
              Hiển thị trang{" "}
              <span className="text-text-main font-bold">
                {currentPage + 1}
              </span>{" "}
              / <span className="text-text-main font-bold">{totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconButton
                variant="secondary"
                size="sm"
                icon={CaretLeft}
                aria-label="Trang trước"
                disabled={currentPage === 0}
                onClick={() => fetchReports(currentPage - 1)}
              />
              <span className="text-xs font-bold text-text-main px-3 py-1 bg-surface-main rounded-xl border-0 shadow-sm">
                {currentPage + 1}
              </span>
              <IconButton
                variant="secondary"
                size="sm"
                icon={CaretRight}
                aria-label="Trang sau"
                disabled={currentPage >= totalPages - 1}
                onClick={() => fetchReports(currentPage + 1)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportTable;
