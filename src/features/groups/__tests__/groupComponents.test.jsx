import { describe, it, expect, vi } from "vitest";
import React from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import { GroupHeader } from "../components/GroupHeader";
import { GroupFeedTab } from "../components/tabs/GroupFeedTab";
import { GroupMembersTab } from "../components/tabs/GroupMembersTab";
import { GroupModerationTab } from "../components/tabs/GroupModerationTab";
import { GroupDetailPage } from "../GroupDetailPage";
import authReducer from "../../../redux/slices/authSlice";
import userReducer from "../../../redux/slices/userSlice";
import * as GroupService from "../../../services/groups/GroupService";

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn().mockReturnValue("toast-id"),
  },
}));

vi.mock("../../../services/groups/GroupService", () => ({
  findById: vi.fn().mockResolvedValue({
    id: "g1",
    name: "Cộng đồng Designer",
    privacy: "PUBLIC",
    memberCount: 42,
    ownerId: "1",
    currentUserStatus: "ACCEPTED",
    currentUserRole: "MEMBER",
  }),
  getGroupMembers: vi.fn().mockResolvedValue([
    { userId: "1", fullName: "Admin A", role: "OWNER", joinedAt: "2026-01-01" },
    { userId: "2", fullName: "User B", role: "MEMBER", joinedAt: "2026-02-01" },
  ]),
  getGroupPosts: vi.fn().mockResolvedValue([]),
  getPendingPosts: vi.fn().mockResolvedValue([]),
  getPendingRequests: vi.fn().mockResolvedValue([]),
  getBannedMembers: vi.fn().mockResolvedValue([]),
  joinGroup: vi.fn().mockResolvedValue({}),
  leaveGroup: vi.fn().mockResolvedValue({}),
  approvePost: vi.fn().mockResolvedValue({}),
  rejectPost: vi.fn().mockResolvedValue({}),
  approveRequest: vi.fn().mockResolvedValue({}),
  rejectRequest: vi.fn().mockResolvedValue({}),
  banMember: vi.fn().mockResolvedValue({}),
  unbanMember: vi.fn().mockResolvedValue({}),
  transferOwnership: vi.fn().mockResolvedValue({}),
  inviteMembers: vi.fn().mockResolvedValue({}),
}));

const { mockPostManagement } = vi.hoisted(() => ({
  mockPostManagement: {
    posts: [],
    setPosts: vi.fn(),
    deleteModal: { isOpen: false, postId: null },
    setDeleteModal: vi.fn(),
    handleDeletePost: vi.fn(),
    handleUpdatePost: vi.fn(),
    confirmDelete: vi.fn(),
  },
}));

vi.mock("../../../hooks/usePostManagement", () => ({
  usePostManagement: () => mockPostManagement,
}));

vi.mock("../../../context/WebSocketContext", () => ({
  useWebSocket: () => ({
    stompClient: null,
    isConnected: false,
  }),
}));

function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      user: userReducer,
    },
    preloadedState: {
      auth: {
        user: { id: "1", username: "current_user", fullName: "Quốc Khánh" },
        isAuthenticated: true,
      },
      user: {
        profile: { id: "1", fullName: "Quốc Khánh" },
      },
      ...preloadedState,
    },
  });
}

describe("Group Feature Components", () => {
  const mockGroup = {
    id: "g1",
    name: "React & Vite Masters",
    privacy: "PUBLIC",
    memberCount: 120,
    ownerId: "1",
  };

  describe("<GroupHeader />", () => {
    it("renders group title, badges, and back button", () => {
      render(
        <MemoryRouter>
          <GroupHeader
            group={mockGroup}
            isAdmin={false}
            userMembership={{ status: "ACCEPTED", role: "MEMBER" }}
            onNavigateBack={vi.fn()}
          />
        </MemoryRouter>
      );

      expect(screen.getByText("React & Vite Masters")).toBeInTheDocument();
      expect(screen.getByText("Công khai")).toBeInTheDocument();
      expect(screen.getByText("120 thành viên")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Quay lại" })).toBeInTheDocument();
    });

    it("renders member actions when user is accepted member", () => {
      const handleLeave = vi.fn();
      const handleInvite = vi.fn();

      render(
        <MemoryRouter>
          <GroupHeader
            group={mockGroup}
            isAdmin={false}
            userMembership={{ status: "ACCEPTED", role: "MEMBER" }}
            onLeaveGroup={handleLeave}
            onInviteClick={handleInvite}
          />
        </MemoryRouter>
      );

      const leaveBtn = screen.getByText("Rời nhóm");
      const inviteBtn = screen.getByText("Mời bạn bè");

      expect(leaveBtn).toBeInTheDocument();
      expect(inviteBtn).toBeInTheDocument();

      fireEvent.click(leaveBtn);
      expect(handleLeave).toHaveBeenCalledTimes(1);

      fireEvent.click(inviteBtn);
      expect(handleInvite).toHaveBeenCalledTimes(1);
    });

    it("renders admin edit button when isAdmin is true", () => {
      const handleEdit = vi.fn();
      render(
        <MemoryRouter>
          <GroupHeader
            group={mockGroup}
            isAdmin={true}
            userMembership={{ status: "ACCEPTED", role: "OWNER" }}
            onEditGroup={handleEdit}
          />
        </MemoryRouter>
      );

      const editBtn = screen.getByText("Chỉnh sửa");
      expect(editBtn).toBeInTheDocument();
      fireEvent.click(editBtn);
      expect(handleEdit).toHaveBeenCalledTimes(1);
    });

    it("renders requested button when membership status is REQUESTED", () => {
      render(
        <MemoryRouter>
          <GroupHeader
            group={mockGroup}
            isAdmin={false}
            userMembership={{ status: "REQUESTED" }}
          />
        </MemoryRouter>
      );

      expect(screen.getByText("Hủy yêu cầu")).toBeInTheDocument();
    });

    it("renders join button for guest", () => {
      const handleJoin = vi.fn();
      render(
        <MemoryRouter>
          <GroupHeader
            group={mockGroup}
            isAdmin={false}
            userMembership={null}
            onJoinGroup={handleJoin}
          />
        </MemoryRouter>
      );

      const joinBtn = screen.getByText("Tham gia nhóm");
      expect(joinBtn).toBeInTheDocument();
      fireEvent.click(joinBtn);
      expect(handleJoin).toHaveBeenCalledTimes(1);
    });
  });

  describe("<GroupFeedTab />", () => {
    it("renders lock screen when private group is viewed by guest", () => {
      const privateGroup = { ...mockGroup, privacy: "PRIVATE" };
      render(
        <MemoryRouter>
          <GroupFeedTab
            group={privateGroup}
            userMembership={null}
            isAdmin={false}
            posts={[]}
          />
        </MemoryRouter>
      );

      expect(screen.getByText("Đây là nhóm Riêng tư")).toBeInTheDocument();
      expect(screen.getByText("Gửi yêu cầu gia nhập")).toBeInTheDocument();
    });

    it("renders empty state when posts list is empty", () => {
      const store = createTestStore();
      render(
        <Provider store={store}>
          <MemoryRouter>
            <GroupFeedTab
              group={mockGroup}
              userMembership={{ status: "ACCEPTED", role: "MEMBER" }}
              isAdmin={false}
              posts={[]}
            />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText("Chưa có bài viết nào")).toBeInTheDocument();
    });
  });

  describe("<GroupMembersTab />", () => {
    const mockMembers = [
      { userId: "1", fullName: "Trưởng nhóm", role: "OWNER", joinedAt: "2026-01-01" },
      { userId: "2", fullName: "Thành viên A", role: "MEMBER", joinedAt: "2026-02-01" },
    ];

    it("renders member list with badges and roles", () => {
      render(
        <MemoryRouter>
          <GroupMembersTab
            members={mockMembers}
            currentUserId="1"
            ownerId="1"
            isAdmin={true}
          />
        </MemoryRouter>
      );

      expect(screen.getByText("Trưởng nhóm")).toBeInTheDocument();
      expect(screen.getByText("Thành viên A")).toBeInTheDocument();
      expect(screen.getByText("Chủ nhóm")).toBeInTheDocument();
      expect(screen.getByText("Thành viên")).toBeInTheDocument();
    });

    it("shows owner management actions for other members", () => {
      const handleTransfer = vi.fn();
      const handleBan = vi.fn();

      render(
        <MemoryRouter>
          <GroupMembersTab
            members={mockMembers}
            currentUserId="1"
            ownerId="1"
            isAdmin={true}
            onTransferOwnership={handleTransfer}
            onBanMember={handleBan}
          />
        </MemoryRouter>
      );

      const transferBtn = screen.getByRole("button", {
        name: "Chuyển nhượng quyền sở hữu",
      });
      const banBtn = screen.getByRole("button", { name: "Cấm khỏi nhóm" });

      expect(transferBtn).toBeInTheDocument();
      expect(banBtn).toBeInTheDocument();

      fireEvent.click(transferBtn);
      expect(handleTransfer).toHaveBeenCalledWith(mockMembers[1]);

      fireEvent.click(banBtn);
      expect(handleBan).toHaveBeenCalledWith(mockMembers[1]);
    });
  });

  describe("<GroupModerationTab />", () => {
    it("renders moderation sub-tabs and handles post approve/reject", () => {
      const handleActionPost = vi.fn();
      const pendingPosts = [
        {
          id: "p1",
          authorFullName: "Nguyễn Văn C",
          authorName: "vanc",
          content: "Bài viết cần duyệt",
          createdAt: "2026-03-01T10:00:00Z",
        },
      ];

      render(
        <MemoryRouter>
          <GroupModerationTab
            modTab="Bài viết"
            onSelectModTab={vi.fn()}
            pendingPosts={pendingPosts}
            memberRequests={[]}
            bannedMembers={[]}
            onActionPost={handleActionPost}
          />
        </MemoryRouter>
      );

      expect(screen.getByText("Bài viết cần duyệt")).toBeInTheDocument();
      const approveBtn = screen.getByText("Phê duyệt");
      const rejectBtn = screen.getByText("Từ chối");

      fireEvent.click(approveBtn);
      expect(handleActionPost).toHaveBeenCalledWith("p1", "approve");

      fireEvent.click(rejectBtn);
      expect(handleActionPost).toHaveBeenCalledWith("p1", "reject");
    });
  });

  describe("<GroupDetailPage /> Orchestrator", () => {
    it("renders loading indicator and then group page", async () => {
      const store = createTestStore();
      render(
        <Provider store={store}>
          <MemoryRouter>
            <GroupDetailPage groupId="g1" />
          </MemoryRouter>
        </Provider>
      );

      expect(await screen.findByText("Cộng đồng Designer")).toBeInTheDocument();
      expect(screen.getByText("Bản tin")).toBeInTheDocument();
    });
  });
});
