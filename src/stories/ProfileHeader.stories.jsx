import React from "react";
import ProfileHeader from "../features/profile/components/ProfileHeader";
import { MockAppProviders } from "./mocks/MockAppProviders";
import { mockUsers } from "./mocks/apiMockData";

export default {
  title: "Features/Profile/ProfileHeader",
  component: ProfileHeader,
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

export const OwnerSelfView = {
  args: {
    profile: {
      userId: "1",
      fullName: "Nguyễn Kim Quốc Khánh",
      username: "khanhnkq",
      currentAvatarUrl: mockUsers.currentUser.avatarUrl,
      currentCoverUrl: mockUsers.currentUser.coverUrl,
      cityName: "Hồ Chí Minh",
      friendsCount: 42,
      postsCount: 15,
    },
    isOwner: true,
  },
};

export const MemberFriendView = {
  args: {
    profile: {
      userId: "2",
      fullName: "Trần Hoàng Nam",
      username: "namth",
      currentAvatarUrl: mockUsers.friend1.avatarUrl,
      currentCoverUrl: mockUsers.friend1.coverUrl,
      cityName: "Hà Nội",
      friendsCount: 128,
      postsCount: 30,
      relationshipStatus: "FRIEND",
    },
    isOwner: false,
  },
};

export const MemberPendingIncomingView = {
  args: {
    profile: {
      userId: "3",
      fullName: "Lê Mai Chi",
      username: "chilm",
      currentAvatarUrl: "",
      cityName: "Đà Nẵng",
      friendsCount: 5,
      postsCount: 2,
      relationshipStatus: "WAITING",
      isRequestReceiver: true,
    },
    isOwner: false,
  },
};

export const MemberStrangerView = {
  args: {
    profile: {
      userId: "4",
      fullName: "Phạm Hải Đăng",
      username: "dangph",
      currentAvatarUrl: "",
      cityName: "Cần Thơ",
      friendsCount: 0,
      postsCount: 0,
      relationshipStatus: "NONE",
    },
    isOwner: false,
  },
};
