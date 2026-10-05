import React from "react";
import {
  SquaresFour,
  User,
  Image,
  Heart,
  Users,
} from "@phosphor-icons/react";
import { Tabs } from "../../../components/ui/tabs/Tabs";

/**
 * Modern Flat ProfileTabs Component
 * Uses the Design System Tabs primitive to navigate 5 tabs:
 * 1. timeline ("Dòng thời gian")
 * 2. about ("Giới thiệu")
 * 3. photos ("Hình ảnh")
 * 4. hobbies ("Sở thích")
 * 5. friends ("Bạn bè")
 */
export function ProfileTabs({ activeTab, onChange, friendsCount = 0 }) {
  // Normalize "library" to "photos" if received
  const normalizedValue = activeTab === "library" ? "photos" : activeTab;

  const handleTabChange = (val) => {
    onChange?.(val);
  };

  return (
    <div className="w-full border-b border-border-main pb-3">
      <Tabs value={normalizedValue} onChange={handleTabChange}>
        <Tabs.List className="w-full sm:w-auto flex items-center justify-start gap-1 p-1 bg-surface-subtle border border-border-main rounded-xl">
          <Tabs.Trigger
            value="timeline"
            icon={SquaresFour}
            className="flex-1 sm:flex-none py-2 px-4"
          >
            Dòng thời gian
          </Tabs.Trigger>
          <Tabs.Trigger
            value="about"
            icon={User}
            className="flex-1 sm:flex-none py-2 px-4"
          >
            Giới thiệu
          </Tabs.Trigger>
          <Tabs.Trigger
            value="photos"
            icon={Image}
            className="flex-1 sm:flex-none py-2 px-4"
          >
            Hình ảnh
          </Tabs.Trigger>
          <Tabs.Trigger
            value="hobbies"
            icon={Heart}
            className="flex-1 sm:flex-none py-2 px-4"
          >
            Sở thích
          </Tabs.Trigger>
          <Tabs.Trigger
            value="friends"
            icon={Users}
            badge={friendsCount}
            className="flex-1 sm:flex-none py-2 px-4"
          >
            Bạn bè
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs>
    </div>
  );
}

export default ProfileTabs;
