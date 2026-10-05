import React from "react";
import { GroupHeader } from "../features/groups/components/GroupHeader";
import { MockAppProviders } from "./mocks/MockAppProviders";

export default {
  title: "Features/Groups/GroupHeader",
  component: GroupHeader,
  decorators: [
    (Story) => (
      <MockAppProviders>
        <div className="w-full bg-background-main min-h-screen">
          <Story />
        </div>
      </MockAppProviders>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
};

const baseGroup = {
  id: "g1",
  name: "Cộng đồng Designer ConnectCG",
  privacy: "PUBLIC",
  memberCount: 128,
  image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000",
};

export const OwnerAdminView = {
  args: {
    group: baseGroup,
    isAdmin: true,
    userMembership: { status: "ACCEPTED", role: "OWNER" },
  },
};

export const AcceptedMemberView = {
  args: {
    group: baseGroup,
    isAdmin: false,
    userMembership: { status: "ACCEPTED", role: "MEMBER" },
  },
};

export const RequestedPendingApprovalView = {
  args: {
    group: { ...baseGroup, privacy: "PRIVATE" },
    isAdmin: false,
    userMembership: { status: "REQUESTED" },
  },
};

export const GuestPublicGroupView = {
  args: {
    group: baseGroup,
    isAdmin: false,
    userMembership: null,
  },
};

export const GuestPrivateGroupView = {
  args: {
    group: { ...baseGroup, privacy: "PRIVATE", name: "Hội UI/UX Độc Quyền" },
    isAdmin: false,
    userMembership: null,
  },
};
