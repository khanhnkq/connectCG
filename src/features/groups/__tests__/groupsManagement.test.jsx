import { describe, it, expect, vi } from "vitest";
import React from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent, renderHook, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import { GroupCard } from "../components/GroupCard";
import { GroupsRightSidebar } from "../components/GroupsRightSidebar";
import { GroupsTabs } from "../components/GroupsTabs";
import { DeleteGroupModal } from "../components/DeleteGroupModal";
import { useGroupsManagement } from "../hooks/useGroupsManagement";
import authReducer from "../../../redux/slices/authSlice";
import * as GroupService from "../../../services/groups/GroupService";

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
  },
}));

vi.mock("../../../services/groups/GroupService", () => ({
  findMyManagedGroups: vi.fn().mockResolvedValue({
    content: [{ id: "g1", name: "Nhóm Admin", privacy: "PUBLIC", ownerId: "1" }],
    last: true,
  }),
  findMyJoinedGroups: vi.fn().mockResolvedValue({
    content: [{ id: "g2", name: "Nhóm Thành viên", privacy: "PRIVATE", ownerId: "2" }],
    last: true,
  }),
  findDiscoverGroups: vi.fn().mockResolvedValue({
    content: [{ id: "g3", name: "Nhóm Khám phá", privacy: "PUBLIC", ownerId: "3" }],
    last: true,
  }),
  findPendingInvitations: vi.fn().mockResolvedValue([
    { id: "g4", name: "Nhóm Lời mời", privacy: "PUBLIC", ownerId: "4" },
  ]),
  acceptInvitation: vi.fn().mockResolvedValue({}),
  declineInvitation: vi.fn().mockResolvedValue({}),
  joinGroup: vi.fn().mockResolvedValue({}),
  leaveGroup: vi.fn().mockResolvedValue({}),
  searchGroups: vi.fn().mockResolvedValue({
    content: [{ id: "g5", name: "Nhóm Tìm kiếm", privacy: "PUBLIC" }],
    last: true,
  }),
}));

const createMockStore = (initialAuthState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: { id: "1", username: "admin", fullName: "Admin User" },
        isAuthenticated: true,
        ...initialAuthState,
      },
    },
  });
};

describe("PR #21: Groups Management Feature Components", () => {
  const mockGroup = {
    id: "g10",
    name: "Cộng đồng AI & Robotics",
    ownerFullName: "Nguyễn Văn A",
    description: "Nơi chia sẻ kiến thức công nghệ và lập trình robotics.",
    privacy: "PUBLIC",
    image: "https://example.com/cover.jpg",
    currentUserStatus: null,
    pendingRequestsCount: 3,
    pendingPostsCount: 2,
  };

  describe("GroupCard", () => {
    it("renders group details correctly with public badge", () => {
      render(
        <MemoryRouter>
          <GroupCard
            group={mockGroup}
            activeTab="discover"
            isAdmin={false}
          />
        </MemoryRouter>
      );

      expect(screen.getByText("Cộng đồng AI & Robotics")).toBeInTheDocument();
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
      expect(screen.getByText("Công khai")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Tham gia" })).toBeInTheDocument();
    });

    it("renders ADMIN badge and pending counts when user is admin", () => {
      render(
        <MemoryRouter>
          <GroupCard
            group={mockGroup}
            activeTab="my"
            isAdmin={true}
          />
        </MemoryRouter>
      );

      expect(screen.getByText("ADMIN")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Cài đặt nhóm" })).toBeInTheDocument();
    });

    it("handles invites tab actions (Chấp nhận & Từ chối)", () => {
      const handleAccept = vi.fn();
      const handleDecline = vi.fn();

      render(
        <MemoryRouter>
          <GroupCard
            group={mockGroup}
            activeTab="invites"
            isAdmin={false}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        </MemoryRouter>
      );

      const acceptBtn = screen.getByRole("button", { name: "Chấp nhận" });
      const declineBtn = screen.getByRole("button", { name: "Từ chối" });

      fireEvent.click(acceptBtn);
      expect(handleAccept).toHaveBeenCalledWith("g10");

      fireEvent.click(declineBtn);
      expect(handleDecline).toHaveBeenCalledWith("g10");
    });
  });

  describe("GroupsRightSidebar", () => {
    it("renders stats and search input correctly", () => {
      const handleSearch = vi.fn();
      render(
        <MemoryRouter>
          <GroupsRightSidebar
            searchQuery="test"
            setSearchQuery={handleSearch}
            activeTab="my"
            displayedGroupsLength={5}
          />
        </MemoryRouter>
      );

      expect(screen.getByText("5 nhóm")).toBeInTheDocument();
      expect(screen.getByText("Của tôi")).toBeInTheDocument();
      expect(screen.getByText("Tạo nhóm ngay")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Tìm nhóm của bạn...")).toHaveValue("test");
    });
  });

  describe("GroupsTabs", () => {
    it("renders all 3 tabs and pending count badge", () => {
      const handleTabChange = vi.fn();
      render(
        <GroupsTabs
          activeTab="my"
          onTabChange={handleTabChange}
          pendingInvitationsCount={4}
        />
      );

      expect(screen.getByText("Của tôi")).toBeInTheDocument();
      expect(screen.getByText("Khám phá")).toBeInTheDocument();
      expect(screen.getByText("Lời mời")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Khám phá"));
      expect(handleTabChange).toHaveBeenCalledWith("discover");
    });
  });

  describe("DeleteGroupModal", () => {
    it("renders delete warning and calls onConfirm when confirmed", () => {
      const handleConfirm = vi.fn();
      const handleClose = vi.fn();

      render(
        <DeleteGroupModal
          isOpen={true}
          onClose={handleClose}
          onConfirm={handleConfirm}
          groupName="Nhóm React Việt Nam"
        />
      );

      expect(screen.getByText("Xác nhận xóa nhóm")).toBeInTheDocument();
      expect(screen.getByText(/Nhóm React Việt Nam/)).toBeInTheDocument();

      const confirmBtn = screen.getByRole("button", { name: "Xác nhận xóa" });
      fireEvent.click(confirmBtn);
      expect(handleConfirm).toHaveBeenCalled();

      const cancelBtn = screen.getByRole("button", { name: "Hủy bỏ" });
      fireEvent.click(cancelBtn);
      expect(handleClose).toHaveBeenCalled();
    });
  });

  describe("useGroupsManagement Hook", () => {
    it("fetches my groups on initial load", async () => {
      const store = createMockStore();
      const wrapper = ({ children }) => (
        <Provider store={store}>
          <MemoryRouter initialEntries={["/dashboard/groups?tab=my"]}>
            {children}
          </MemoryRouter>
        </Provider>
      );

      const { result } = renderHook(() => useGroupsManagement(), { wrapper });

      expect(result.current.activeTab).toBe("my");
      expect(GroupService.findMyManagedGroups).toHaveBeenCalled();
      expect(GroupService.findMyJoinedGroups).toHaveBeenCalled();
    });

    it("filters groups correctly by query", () => {
      const store = createMockStore();
      const wrapper = ({ children }) => (
        <Provider store={store}>
          <MemoryRouter initialEntries={["/dashboard/groups"]}>
            {children}
          </MemoryRouter>
        </Provider>
      );

      const { result } = renderHook(() => useGroupsManagement(), { wrapper });

      const testGroups = [
        { id: 1, name: "Javascript Devs", description: "JS community" },
        { id: 2, name: "Python Enthusiasts", description: "Django & AI" },
      ];

      // No query -> all
      expect(result.current.filteredGroups(testGroups)).toHaveLength(2);

      // Set search query
      act(() => {
        result.current.setSearchQuery("javascript");
      });

      expect(result.current.filteredGroups(testGroups)).toHaveLength(1);
      expect(result.current.filteredGroups(testGroups)[0].name).toBe("Javascript Devs");
    });
  });
});
