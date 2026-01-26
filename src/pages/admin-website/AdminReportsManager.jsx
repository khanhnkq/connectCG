import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout-admin/AdminLayout";
import reportService from "../../services/reportService";
import toast from "react-hot-toast";

const TABS = {
  USER: "Báo cáo người dùng",
  GROUP: "Báo cáo nhóm",
  POST: "Báo cáo bài viết",
};


const statusMap = {
  PENDING: {
    label: "Pending",
    color: "text-orange-400",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    color: "text-yellow-400",
  },
  RESOLVED: {
    label: "Resolved",
    color: "text-green-400",
  },
};

const AdminReportsManagement = () => {
  const [activeTab, setActiveTab] = useState("USER");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [targetDetail, setTargetDetail] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'danger'
  });

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await reportService.getReports();
        console.log("API REPORTS:", res.data);
        setReports(res.data || []);
      } catch (e) {
        console.error(e);
        toast.error("Không tải được danh sách báo cáo");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // DTO backend trả: targetType = "USER" | "GROUP" | "POST"
  const filteredReports = reports.filter(
    (r) => r.targetType === activeTab
  );

  const activeCount = filteredReports.filter(
    (r) => r.status !== "RESOLVED"
  ).length;

  return (
    <AdminLayout
      title="Reports Management"
      activeTab="Reports"
      brandName="AdminPanel"
    >
      <div className="p-8 space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Reports Management{" "}
              <span className="ml-2 px-2 py-0.5 text-[10px] rounded-full bg-primary/20 text-primary">
                {activeCount} đang xử lý
              </span>
            </h2>
            <p className="text-text-muted text-sm">
              Quản lý các báo cáo vi phạm từ người dùng, nhóm và bài viết
            </p>
          </div>

          <input
            placeholder="Search reports..."
            className="bg-background-dark/60 border border-border-dark/50 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-primary"
          />
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
        <div className="bg-surface-dark/20 rounded-2xl border border-border-dark/50 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-background-dark/60 border-b border-border-dark/50 text-[10px] uppercase font-black text-text-muted tracking-[0.15em]">
              <tr>
                <th>Đối tượng</th>
                <th>Người báo cáo</th>
                <th>Lý do</th>
                <th>Ngày</th>
                <th>Trạng thái</th>
                <th className="text-right">Hành động</th>

              </tr>
            </thead>

            <tbody className="divide-y divide-border-dark/30 text-sm">
              {loading && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-text-muted">
                    Loading reports...
                  </td>
                </tr>
              )}

              {!loading && filteredReports.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-text-muted">
                    No reports found
                  </td>
                </tr>
              )}

              {!loading &&
                filteredReports.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-dark/40">
                    {/* TARGET */}
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-bold">
                          {r.targetType} #{r.targetId}
                        </p>
                        <p className="text-[10px] text-text-muted font-bold">
                          Target ID
                        </p>
                      </div>
                    </td>

                    {/* REPORTER (DTO FIELD) */}
                    <td className="px-6 py-5">
                      {r.reporterUsername || "Unknown"}
                    </td>

                    {/* REASON */}
                    <td className="px-6 py-5">
                      <span className="px-2.5 py-1 text-[9px] font-black rounded-lg bg-primary/10 text-primary border border-primary/30">
                        {r.reason}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-5 text-text-muted">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">
                      <span
                        className={`font-bold ${statusMap[r.status]?.color
                          }`}
                      >
                        ● {statusMap[r.status]?.label}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-5 text-right space-x-2">
                      <button className="px-4 py-2 text-xs font-bold rounded-full bg-primary/20 text-primary hover:bg-primary/30">
                        Chi tiết
                      </button>

                      {activeTab === "USER" && (
                        <button className="px-4 py-2 text-xs rounded-full bg-red-500/10 text-red-400">
                          Cấm người dùng
                        </button>
                      )}

                      {activeTab === "GROUP" && (
                        <button className="px-4 py-2 text-xs rounded-full bg-orange-500/10 text-orange-400">
                          Tắt nhóm
                        </button>
                      )}

                      {activeTab === "POST" && (
                        <button className="px-4 py-2 text-xs rounded-full bg-yellow-500/10 text-yellow-400">
                          Xóa bài viết
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION (UI ONLY) */}
        <div className="flex justify-end gap-2 text-sm text-text-muted">
          <span>Showing {filteredReports.length} results</span>
          <button className="w-8 h-8 rounded-full bg-primary text-black font-bold">
            1
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReportsManagement;
