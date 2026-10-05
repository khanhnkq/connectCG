import React, { useState } from "react";
import { Tabs } from "../components/ui/tabs/Tabs";
import { Newspaper, Users, ShieldWarning, Image } from "@phosphor-icons/react";

export default {
  title: "Design System/Tabs",
  component: Tabs,
  tags: ["autodocs"],
};

export const GroupTabs = {
  render: () => {
    const [tab, setTab] = useState("feed");
    return (
      <div className="max-w-xl">
        <Tabs value={tab} onChange={setTab}>
          <Tabs.List>
            <Tabs.Trigger value="feed" icon={Newspaper}>
              Bản tin
            </Tabs.Trigger>
            <Tabs.Trigger value="members" icon={Users} badge={142}>
              Thành viên
            </Tabs.Trigger>
            <Tabs.Trigger value="photos" icon={Image}>
              Hình ảnh
            </Tabs.Trigger>
            <Tabs.Trigger value="mod" icon={ShieldWarning} badge={3}>
              Kiểm duyệt
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Panel value="feed">
            <div className="p-4 bg-surface-main border border-border-main rounded-xl text-sm text-text-secondary">
              Nội dung bảng tin của nhóm hiển thị tại đây.
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="members">
            <div className="p-4 bg-surface-main border border-border-main rounded-xl text-sm text-text-secondary">
              Danh sách 142 thành viên hiển thị tại đây.
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="photos">
            <div className="p-4 bg-surface-main border border-border-main rounded-xl text-sm text-text-secondary">
              Kho ảnh và video của nhóm.
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="mod">
            <div className="p-4 bg-surface-main border border-border-main rounded-xl text-sm text-text-secondary">
              Hàng đợi kiểm duyệt bài viết (3 bài đang chờ).
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
    );
  },
};
