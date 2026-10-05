import React from "react";
import { GroupCard } from "../features/groups/components/GroupCard";
import { MockAppProviders } from "./mocks/MockAppProviders";

export default {
  title: "Features/Groups/GroupCard",
  component: GroupCard,
  decorators: [
    (Story) => (
      <MockAppProviders>
        <div className="p-8 max-w-sm bg-background-main">
          <Story />
        </div>
      </MockAppProviders>
    ),
  ],
  parameters: {
    layout: "centered",
  },
};

const baseGroup = {
  id: "g1",
  name: "Cộng đồng AI & Robotics",
  ownerFullName: "Nguyễn Kim Quốc Khánh",
  description: "Nơi chia sẻ kiến thức công nghệ, thảo luận về mô hình AI và lập trình điều khiển tự động.",
  privacy: "PUBLIC",
  image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1000",
  currentUserStatus: null,
  pendingRequestsCount: 5,
  pendingPostsCount: 2,
};

export const DiscoverCard = {
  args: {
    group: baseGroup,
    activeTab: "discover",
    isAdmin: false,
  },
};

export const AdminManagedCard = {
  args: {
    group: baseGroup,
    activeTab: "my",
    isAdmin: true,
  },
};

export const JoinedMemberCard = {
  args: {
    group: { ...baseGroup, currentUserStatus: "ACCEPTED" },
    activeTab: "my",
    isAdmin: false,
  },
};

export const RequestedPendingCard = {
  args: {
    group: { ...baseGroup, privacy: "PRIVATE", currentUserStatus: "REQUESTED" },
    activeTab: "discover",
    isAdmin: false,
  },
};

export const PendingInviteCard = {
  args: {
    group: baseGroup,
    activeTab: "invites",
    isAdmin: false,
  },
};
