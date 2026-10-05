import React from "react";
import { Users, Compass, EnvelopeSimple } from "@phosphor-icons/react";
import { Tabs } from "../../../components/ui/tabs/Tabs";

/**
 * Modern Flat GroupsTabs Component
 * Displays 3 tabs (Của tôi, Khám phá, Lời mời) with solid border-free badges.
 */
export function GroupsTabs({ activeTab, onTabChange, pendingInvitationsCount = 0 }) {
  return (
    <Tabs value={activeTab} onChange={onTabChange}>
      <Tabs.List className="p-1 rounded-xl bg-surface-subtle border border-border-main">
        <Tabs.Trigger value="my" icon={Users}>
          Của tôi
        </Tabs.Trigger>
        <Tabs.Trigger value="discover" icon={Compass}>
          Khám phá
        </Tabs.Trigger>
        <Tabs.Trigger
          value="invites"
          icon={EnvelopeSimple}
          badge={
            pendingInvitationsCount > 0 ? (
              <span className="bg-red-600 text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full border-0 select-none inline-flex items-center justify-center min-w-4">
                {pendingInvitationsCount}
              </span>
            ) : undefined
          }
        >
          Lời mời
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs>
  );
}

export default GroupsTabs;
