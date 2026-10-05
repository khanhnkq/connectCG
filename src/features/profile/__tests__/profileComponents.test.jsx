import { describe, it, expect, vi } from "vitest";
import React from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import ProfileHeader from "../components/ProfileHeader";
import ProfileTabs from "../components/ProfileTabs";
import ProfileSidebar from "../components/ProfileSidebar";
import ProfilePage from "../ProfilePage";
import authReducer from "../../../redux/slices/authSlice";
import userReducer from "../../../redux/slices/userSlice";
import UserProfileService from "../../../services/user/UserProfileService";

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn().mockReturnValue("toast-id"),
  },
}));

vi.mock("../../../services/user/UserProfileService", () => ({
  default: {
    getUserProfile: vi.fn().mockResolvedValue({
      data: {
        userId: "100",
        fullName: "Thành viên B",
        relationshipStatus: "FRIEND",
        friendsCount: 15,
        postsCount: 3,
      },
    }),
  },
}));

vi.mock("../../../services/PostService", () => ({
  default: {
    getPostsByUserId: vi.fn().mockResolvedValue({ data: [] }),
    deletePost: vi.fn().mockResolvedValue({ success: true }),
    updatePost: vi.fn().mockResolvedValue({ success: true }),
  },
}));

function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      user: userReducer,
    },
    preloadedState: {
      auth: {
        user: { id: "99", username: "current_user", fullName: "Quốc Khánh" },
        isAuthenticated: true,
      },
      user: {
        profile: {
          id: "99",
          userId: "99",
          fullName: "Quốc Khánh",
          username: "current_user",
          currentAvatarUrl: "https://example.com/avatar.jpg",
          currentCoverUrl: "https://example.com/cover.jpg",
          friendsCount: 10,
          postsCount: 5,
        },
        loading: false,
      },
      ...preloadedState,
    },
  });
}

describe("Profile Feature Components", () => {
  describe("<ProfileHeader />", () => {
    it("renders owner controls (edit profile, cover upload) in self mode", () => {
      const onEditProfile = vi.fn();
      const onTabChange = vi.fn();

      const profile = {
        fullName: "Quốc Khánh",
        cityName: "Hồ Chí Minh",
        friendsCount: 12,
        postsCount: 8,
      };

      render(
        <ProfileHeader
          profile={profile}
          isOwner={true}
          onEditProfile={onEditProfile}
          onTabChange={onTabChange}
        />
      );

      expect(screen.getByText("Quốc Khánh")).toBeInTheDocument();
      expect(screen.getByText("Hồ Chí Minh")).toBeInTheDocument();
      expect(screen.getByText("Chỉnh sửa hồ sơ")).toBeInTheDocument();
      expect(screen.getByText("Thay đổi ảnh bìa")).toBeInTheDocument();

      // Click stats
      fireEvent.click(screen.getByText("12"));
      expect(onTabChange).toHaveBeenCalledWith("friends");

      fireEvent.click(screen.getByText("8"));
      expect(onTabChange).toHaveBeenCalledWith("timeline");

      // Click edit
      fireEvent.click(screen.getByText("Chỉnh sửa hồ sơ"));
      expect(onEditProfile).toHaveBeenCalled();
    });

    it("renders member controls (friend status, chat, report) in member mode", () => {
      const onConfirmUnfriend = vi.fn();
      const onStartChat = vi.fn();
      const onOpenReport = vi.fn();

      const profile = {
        fullName: "Lê Thị B",
        relationshipStatus: "FRIEND",
        friendsCount: 20,
        postsCount: 2,
      };

      render(
        <ProfileHeader
          profile={profile}
          isOwner={false}
          onConfirmUnfriend={onConfirmUnfriend}
          onStartChat={onStartChat}
          onOpenReport={onOpenReport}
        />
      );

      expect(screen.getByText("Lê Thị B")).toBeInTheDocument();
      expect(screen.getByText("Đã là bạn bè")).toBeInTheDocument();
      expect(screen.getByText("Nhắn tin")).toBeInTheDocument();

      // Click unfriend button
      fireEvent.click(screen.getByText("Đã là bạn bè"));
      expect(onConfirmUnfriend).toHaveBeenCalled();

      // Click chat
      fireEvent.click(screen.getByText("Nhắn tin"));
      expect(onStartChat).toHaveBeenCalled();

      // Click report icon button
      const reportBtn = screen.getByLabelText("Báo cáo người dùng");
      fireEvent.click(reportBtn);
      expect(onOpenReport).toHaveBeenCalled();
    });

    it("renders accept/reject buttons when incoming request is waiting", () => {
      const onConfirmAcceptRequest = vi.fn();
      const onConfirmRejectRequest = vi.fn();

      const profile = {
        fullName: "Trần C",
        relationshipStatus: "WAITING",
        isRequestReceiver: true,
      };

      render(
        <ProfileHeader
          profile={profile}
          isOwner={false}
          onConfirmAcceptRequest={onConfirmAcceptRequest}
          onConfirmRejectRequest={onConfirmRejectRequest}
        />
      );

      const acceptBtn = screen.getByText("Chấp nhận");
      const rejectBtn = screen.getByText("Từ chối");
      expect(acceptBtn).toBeInTheDocument();
      expect(rejectBtn).toBeInTheDocument();

      fireEvent.click(acceptBtn);
      expect(onConfirmAcceptRequest).toHaveBeenCalled();

      fireEvent.click(rejectBtn);
      expect(onConfirmRejectRequest).toHaveBeenCalled();
    });

    it("renders 'Thu hồi lời mời' when request is pending sent", () => {
      const onConfirmCancelRequest = vi.fn();

      const profile = {
        fullName: "Hoàng D",
        relationshipStatus: "PENDING",
        isRequestReceiver: false,
      };

      render(
        <ProfileHeader
          profile={profile}
          isOwner={false}
          onConfirmCancelRequest={onConfirmCancelRequest}
        />
      );

      const cancelBtn = screen.getByText("Thu hồi lời mời");
      expect(cancelBtn).toBeInTheDocument();
      fireEvent.click(cancelBtn);
      expect(onConfirmCancelRequest).toHaveBeenCalled();
    });
  });

  describe("<ProfileTabs />", () => {
    it("renders 5 tabs and propagates active tab changes", () => {
      const onChange = vi.fn();
      render(
        <ProfileTabs activeTab="timeline" onChange={onChange} friendsCount={42} />
      );

      expect(screen.getByText("Dòng thời gian")).toBeInTheDocument();
      expect(screen.getByText("Giới thiệu")).toBeInTheDocument();
      expect(screen.getByText("Hình ảnh")).toBeInTheDocument();
      expect(screen.getByText("Sở thích")).toBeInTheDocument();
      expect(screen.getByText("Bạn bè")).toBeInTheDocument();
      expect(screen.getByText("42")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Giới thiệu"));
      expect(onChange).toHaveBeenCalledWith("about");

      fireEvent.click(screen.getByText("Hình ảnh"));
      expect(onChange).toHaveBeenCalledWith("photos");
    });
  });

  describe("<ProfileSidebar />", () => {
    it("renders user overview information and hobbies chips", () => {
      const profile = {
        bio: "Xin chào, tôi là lập trình viên đam mê React.",
        occupation: "Kỹ sư phần mềm",
        maritalStatus: "SINGLE",
        lookingFor: "FRIENDS",
        cityName: "Đà Nẵng",
        hobbies: [
          { id: 1, name: "Bóng đá" },
          { id: 2, name: "Đọc sách" },
        ],
      };

      render(<ProfileSidebar profile={profile} isOwner={true} />);

      expect(screen.getByText("Giới thiệu")).toBeInTheDocument();
      expect(
        screen.getByText("Xin chào, tôi là lập trình viên đam mê React.")
      ).toBeInTheDocument();
      expect(screen.getByText("Kỹ sư phần mềm")).toBeInTheDocument();
      expect(screen.getByText("Độc thân")).toBeInTheDocument();
      expect(screen.getByText("Bạn bè")).toBeInTheDocument();
      expect(screen.getByText("Đà Nẵng")).toBeInTheDocument();
      expect(screen.getByText("Bóng đá")).toBeInTheDocument();
      expect(screen.getByText("Đọc sách")).toBeInTheDocument();
    });
  });

  describe("<ProfilePage />", () => {
    it("renders loading indicator while profile is being loaded", async () => {
      const store = createTestStore({
        user: { profile: null, loading: true },
      });

      render(
        <Provider store={store}>
          <MemoryRouter>
            <ProfilePage mode="self" />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText("Đang tải hồ sơ của bạn...")).toBeInTheDocument();
    });

    it("renders not-found state when external member is missing", async () => {
      UserProfileService.getUserProfile.mockRejectedValueOnce(
        new Error("User not found")
      );
      const store = createTestStore();
      await act(async () => {
        render(
          <Provider store={store}>
            <MemoryRouter>
              <ProfilePage mode="member" userId="non-existent" />
            </MemoryRouter>
          </Provider>
        );
      });

      expect(screen.getByText("Không tìm thấy thành viên")).toBeInTheDocument();
      expect(screen.getByText("Quay lại")).toBeInTheDocument();
    });

    it("renders unified profile with header and timeline feed in self mode", async () => {
      UserProfileService.getUserProfile.mockResolvedValueOnce({
        data: {
          id: "99",
          userId: "99",
          fullName: "Quốc Khánh",
          username: "current_user",
          currentAvatarUrl: "https://example.com/avatar.jpg",
          currentCoverUrl: "https://example.com/cover.jpg",
          friendsCount: 10,
          postsCount: 5,
        },
      });
      const store = createTestStore();
      await act(async () => {
        render(
          <Provider store={store}>
            <MemoryRouter>
              <ProfilePage mode="self" />
            </MemoryRouter>
          </Provider>
        );
      });

      expect(screen.getByText("Quốc Khánh")).toBeInTheDocument();
      expect(screen.getByText("Chỉnh sửa hồ sơ")).toBeInTheDocument();
      expect(screen.getByText("Dòng thời gian")).toBeInTheDocument();
    });
  });
});
