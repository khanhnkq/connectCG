import React, { useState } from "react";
import AdminLayout from "../../components/layout-admin/AdminLayout";

const TABS = {
  USER: "User Reports",
  GROUP: "Group Reports",
  POST: "Post Reports",
};

const AdminReportsManagement = () => {
  const [activeTab, setActiveTab] = useState("USER");

  // 🔒 FIX CỨNG DATA TẠM THỜI
  const reports = [
    {
      id: 1,
      type: "USER",
      target: {
        name: "Emma W.",
        subtitle: "@emma_wilson",
        avatar: "https://i.pravatar.cc/100?u=emma",
      },
      reporter: "Jordan Smith",
      reason: "Harassment",
      date: "Oct 24, 2023",
      status: "Pending",
    },
    {
      id: 2,
      type: "USER",
      target: {
        name: "Marcus Chen",
        subtitle: "@marcus_c",
        avatar: "https://i.pravatar.cc/100?u=marcus",
      },
      reporter: "Sarah Miller",
      reason: "Spam",
      date: "Oct 23, 2023",
      status: "Under Review",
    },
    {
      id: 3,
      type: "GROUP",
      target: {
        name: "Night Owls Club",
        subtitle: "Late night social group",
        avatar:
          "https://ui-avatars.com/api/?name=Night+Owls&background=2b1a0f&color=fff",
      },
      reporter: "Mike Thompson",
      reason: "Inappropriate Content",
      date: "Oct 22, 2023",
      status: "Pending",
    },
    {
      id: 4,
      type: "POST",
      target: {
        name: "Post #P-1024",
        subtitle: "Spam / quảng cáo link",
        avatar:
          "https://ui-avatars.com/api/?name=Post&background=3b2a1a&color=fff",
      },
      reporter: "David Lee",
      reason: "Spam",
      date: "Oct 22, 2023",
      status: "Resolved",
    },
  ];

  const filteredReports = reports.filter(r => r.type === activeTab);

  const statusColor = {
    Pending: "text-orange-400",
    "Under Review": "text-yellow-400",
    Resolved: "text-green-400",
  };

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
                {filteredReports.length} Active
              </span>
            </h2>
            <p className="text-text-muted text-sm">
              Manage abuse reports across users, groups and posts
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
        <div className="bg-surface-dark/20 rounded-2xl border border-border-dark/50 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-background-dark/60 border-b border-border-dark/50 text-[10px] uppercase font-black text-text-muted tracking-[0.15em]">
              <tr>
                <th className="px-6 py-5">Reported Target</th>
                <th className="px-6 py-5">Reporter</th>
                <th className="px-6 py-5">Reason</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-dark/30 text-sm">
              {filteredReports.map(r => (
                <tr key={r.id} className="hover:bg-surface-dark/40">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={r.target.avatar}
                        className="w-10 h-10 rounded-full border border-border-dark/50"
                        alt=""
                      />
                      <div>
                        <p className="font-bold">{r.target.name}</p>
                        <p className="text-[10px] text-text-muted font-bold">
                          {r.target.subtitle}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">{r.reporter}</td>

                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 text-[9px] font-black rounded-lg bg-primary/10 text-primary border border-primary/30">
                      {r.reason}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-text-muted">{r.date}</td>

                  <td className="px-6 py-5">
                    <span className={`font-bold ${statusColor[r.status]}`}>
                      ● {r.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right space-x-2">
                    <button className="px-4 py-2 text-xs font-bold rounded-full bg-primary/20 text-primary hover:bg-primary/30">
                      Review Details
                    </button>

                    {activeTab === "USER" && (
                      <button className="px-4 py-2 text-xs rounded-full bg-red-500/10 text-red-400">
                        Ban User
                      </button>
                    )}

                    {activeTab === "GROUP" && (
                      <button className="px-4 py-2 text-xs rounded-full bg-orange-500/10 text-orange-400">
                        Disable Group
                      </button>
                    )}

                    {activeTab === "POST" && (
                      <button className="px-4 py-2 text-xs rounded-full bg-yellow-500/10 text-yellow-400">
                        Remove Post
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-end gap-2 text-sm text-text-muted">
          <span>Showing 1–{filteredReports.length} results</span>
          <button className="w-8 h-8 rounded-full bg-primary text-black font-bold">1</button>
          <button className="w-8 h-8 rounded-full bg-surface-dark/50">2</button>
          <button className="w-8 h-8 rounded-full bg-surface-dark/50">3</button>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminReportsManagement;
