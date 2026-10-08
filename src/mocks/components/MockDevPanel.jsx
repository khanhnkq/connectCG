import React, { useState } from "react";
import { Wrench, X, ArrowsClockwise, Bell, CaretDown } from "@phosphor-icons/react";
import mockDb from "../db/mockDb";
import { setMockLatency } from "../adapter/axiosMockAdapter";
import mockStompClient from "../websocket/mockStompClient";

/**
 * Modern Flat MockDevPanel
 * Floating developer control widget for Standalone Mock Mode.
 */
export function MockDevPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLatency, setCurrentLatency] = useState(120);
  const currentUser = mockDb.getCurrentUser();
  const allUsers = mockDb.getCollection("users");

  const handleUserChange = (userId) => {
    mockDb.setCurrentUser(userId);
    window.location.reload();
  };

  const handleLatencyChange = (ms) => {
    setCurrentLatency(ms);
    setMockLatency(ms);
  };

  const handleResetData = () => {
    if (window.confirm("Bạn có chắc muốn khôi phục toàn bộ dữ liệu Mock về mặc định?")) {
      mockDb.reset();
      window.location.reload();
    }
  };

  const handleTriggerNotification = () => {
    const dummyNotif = {
      id: `n_${Date.now()}`,
      type: "POST_REACTION",
      content: `${allUsers[1].fullName} vừa thích bài viết của bạn!`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    mockStompClient.emit("/user/queue/notifications", dummyNotif);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-[9999] select-none">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="h-10 px-3.5 bg-primary text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95 border-0"
          title="Mở Bảng điều khiển Mock Dev"
        >
          <Wrench size={16} />
          <span>Mock Dev</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] w-80 bg-surface-main border-0 shadow-2xl rounded-2xl p-4 space-y-4 select-none animate-in fade-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Wrench className="text-primary size-5" />
          <h4 className="text-xs font-bold text-text-main uppercase tracking-wider">
            Mock Control Panel
          </h4>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="size-7 rounded-lg text-text-muted hover:text-text-main hover:bg-surface-subtle flex items-center justify-center cursor-pointer transition-colors border-0 bg-transparent"
          aria-label="Đóng"
        >
          <X size={16} />
        </button>
      </div>

      {/* Switch Persona */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider">
          Đang đóng vai (User Persona)
        </label>
        <div className="relative">
          <select
            value={currentUser.id}
            onChange={(e) => handleUserChange(e.target.value)}
            className="w-full h-9 bg-surface-subtle text-text-main text-xs rounded-xl px-3 border-0 outline-none cursor-pointer appearance-none pr-8 font-medium"
          >
            {allUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.fullName} ({u.role})
              </option>
            ))}
          </select>
          <CaretDown className="absolute right-3 top-2.5 text-text-muted size-4 pointer-events-none" />
        </div>
      </div>

      {/* Latency Selector */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider">
          Độ trễ mạng giả lập (Latency)
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: "0ms", val: 0 },
            { label: "120ms", val: 120 },
            { label: "600ms", val: 600 },
          ].map((item) => (
            <button
              key={item.val}
              type="button"
              onClick={() => handleLatencyChange(item.val)}
              className={`h-7 rounded-lg text-[11px] font-bold cursor-pointer transition-colors border-0 ${
                currentLatency === item.val
                  ? "bg-primary text-white"
                  : "bg-surface-subtle text-text-secondary hover:text-text-main hover:bg-surface-subtle/80"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex gap-2">
        <button
          type="button"
          onClick={handleTriggerNotification}
          className="flex-1 h-8 rounded-xl bg-surface-subtle border-0 text-text-main hover:bg-surface-subtle/80 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          title="Gửi thông báo mô phỏng qua WebSocket"
        >
          <Bell size={14} className="text-primary" />
          <span>Bắn Test Notif</span>
        </button>

        <button
          type="button"
          onClick={handleResetData}
          className="flex-1 h-8 rounded-xl bg-surface-subtle border-0 text-danger hover:bg-danger hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          title="Khôi phục database về dữ liệu ban đầu"
        >
          <ArrowsClockwise size={14} />
          <span>Reset Data</span>
        </button>
      </div>
    </div>
  );
}

export default MockDevPanel;
