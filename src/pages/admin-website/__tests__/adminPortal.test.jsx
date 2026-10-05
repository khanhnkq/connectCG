import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminGroupsManager from "../AdminGroupsManager";
import AdminMembersManager from "../AdminMembersManager";
import MainFeedManager from "../MainFeedManager";
import * as GroupService from "../../../services/groups/GroupService";
import * as AdminUserService from "../../../services/admin/AdminUserService";
import postService from "../../../services/PostService";
import { MockAppProviders } from "../../../stories/mocks/MockAppProviders";

// Mock Services
vi.mock("../../../services/groups/GroupService", () => ({
  findAllGroup: vi.fn(),
  deleteGroup: vi.fn(),
  findById: vi.fn(),
  getGroupMembers: vi.fn(),
  getGroupPosts: vi.fn(),
}));

vi.mock("../../../services/admin/AdminUserService", () => ({
  getAllUsers: vi.fn(),
  updateUserRole: vi.fn(),
  lockUser: vi.fn(),
  deleteUser: vi.fn(),
}));

vi.mock("../../../services/PostService", () => ({
  default: {
    getPendingHomepagePosts: vi.fn(),
    getAuditHomepagePosts: vi.fn(),
    approvePost: vi.fn(),
    deletePost: vi.fn(),
  },
}));

// Mock AdminLayout to keep tests lightweight and focused
vi.mock("../../../components/layout-admin/AdminLayout", () => ({
  default: ({ children }) => <div data-testid="admin-layout">{children}</div>,
}));

describe("PR #24: Admin Portal Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("<AdminGroupsManager />", () => {
    const mockGroups = [
      {
        id: 1,
        name: "Cộng đồng Lập trình viên",
        description: "Nơi chia sẻ kiến thức công nghệ và lập trình",
        privacy: "public",
        ownerName: "Nguyễn Kim Quốc Khánh",
        createdAt: new Date().toISOString(),
        image: "",
        is_deleted: false,
      },
    ];

    it("renders header, community list title and groups", async () => {
      GroupService.findAllGroup.mockResolvedValue(mockGroups);

      render(
        <MockAppProviders initialEntries={["/admin-website/groups"]}>
          <AdminGroupsManager />
        </MockAppProviders>
      );

      expect(screen.getByText("Danh sách cộng đồng")).toBeInTheDocument();

      await waitFor(() => {
        expect(
          screen.getByText("Cộng đồng Lập trình viên")
        ).toBeInTheDocument();
      });

      expect(
        screen.getByText("Nơi chia sẻ kiến thức công nghệ và lập trình")
      ).toBeInTheDocument();
      expect(screen.getByText("Công khai")).toBeInTheDocument();
    });

    it("opens ConfirmDialog when clicking delete group button", async () => {
      GroupService.findAllGroup.mockResolvedValue(mockGroups);

      render(
        <MockAppProviders initialEntries={["/admin-website/groups"]}>
          <AdminGroupsManager />
        </MockAppProviders>
      );

      await waitFor(() => {
        expect(
          screen.getByText("Cộng đồng Lập trình viên")
        ).toBeInTheDocument();
      });

      const deleteBtn = screen.getByRole("button", { name: "Xóa nhóm" });
      fireEvent.click(deleteBtn);

      expect(screen.getByText("Vô hiệu hóa nhóm?")).toBeInTheDocument();
      expect(
        screen.getByText(/Bạn sắp vô hiệu hóa "Cộng đồng Lập trình viên"/i)
      ).toBeInTheDocument();
    });
  });

  describe("<AdminMembersManager />", () => {
    const mockUsersData = {
      content: [
        {
          userId: 10,
          fullName: "Trần Bảo Ngọc",
          username: "baongoc",
          email: "baongoc@example.com",
          role: "USER",
          isLocked: false,
          isDeleted: false,
          currentAvatarUrl: "",
        },
      ],
      totalPages: 1,
      totalElements: 1,
    };

    it("renders member list, user details, role badge and status", async () => {
      AdminUserService.getAllUsers.mockResolvedValue(mockUsersData);

      render(
        <MockAppProviders initialEntries={["/admin-website/members"]}>
          <AdminMembersManager />
        </MockAppProviders>
      );

      expect(screen.getByText("Danh sách thành viên")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText("Trần Bảo Ngọc")).toBeInTheDocument();
      });

      expect(screen.getByText(/@baongoc/)).toBeInTheDocument();
      expect(screen.getByText("Thành viên")).toBeInTheDocument();
      expect(screen.getByText("Hoạt động")).toBeInTheDocument();
    });

    it("opens ConfirmDialog when clicking lock/unlock user button", async () => {
      AdminUserService.getAllUsers.mockResolvedValue(mockUsersData);

      render(
        <MockAppProviders initialEntries={["/admin-website/members"]}>
          <AdminMembersManager />
        </MockAppProviders>
      );

      await waitFor(() => {
        expect(screen.getByText("Trần Bảo Ngọc")).toBeInTheDocument();
      });

      const lockBtn = screen.getByRole("button", {
        name: "Khóa hoặc mở khóa tài khoản",
      });
      fireEvent.click(lockBtn);

      expect(screen.getByText("Khóa tài khoản?")).toBeInTheDocument();
      expect(
        screen.getByText(/Bạn có chắc muốn khóa người dùng này/i)
      ).toBeInTheDocument();
    });
  });

  describe("<MainFeedManager />", () => {
    const mockPostsData = {
      content: [
        {
          id: 501,
          content: "Bài viết này chứa nội dung cần xem xét kỹ",
          authorFullName: "Lê Văn Hùng",
          authorAvatar: "",
          visibility: "PUBLIC",
          aiStatus: "TOXIC",
          aiReason: "Ngôn từ thô tục",
        },
      ],
      totalPages: 1,
      totalElements: 1,
    };

    it("renders pending posts with AI badge and switches tabs", async () => {
      postService.getPendingHomepagePosts.mockResolvedValue({
        data: mockPostsData,
      });
      postService.getAuditHomepagePosts.mockResolvedValue({
        data: { content: [], totalPages: 0, totalElements: 0 },
      });

      render(
        <MockAppProviders initialEntries={["/admin-website/contents"]}>
          <MainFeedManager />
        </MockAppProviders>
      );

      expect(screen.getByText("Hộp thư chờ duyệt")).toBeInTheDocument();

      await waitFor(() => {
        expect(
          screen.getByText('"Bài viết này chứa nội dung cần xem xét kỹ"')
        ).toBeInTheDocument();
      });

      expect(screen.getByText("TOXIC")).toBeInTheDocument();
      expect(screen.getByText("Ngôn từ thô tục")).toBeInTheDocument();

      // Switch to Audit Tab
      const auditTabBtn = screen.getByRole("button", {
        name: /Kiểm tra lại/i,
      });
      fireEvent.click(auditTabBtn);

      await waitFor(() => {
        expect(
          screen.getByText("Hộp thư kiểm tra lại (AI Flagged)")
        ).toBeInTheDocument();
      });
    });

    it("opens ConfirmDialog when clicking delete post", async () => {
      postService.getPendingHomepagePosts.mockResolvedValue({
        data: mockPostsData,
      });

      render(
        <MockAppProviders initialEntries={["/admin-website/contents"]}>
          <MainFeedManager />
        </MockAppProviders>
      );

      await waitFor(() => {
        expect(
          screen.getByText('"Bài viết này chứa nội dung cần xem xét kỹ"')
        ).toBeInTheDocument();
      });

      const deleteBtn = screen.getByRole("button", {
        name: "Xóa bài viết vi phạm",
      });
      fireEvent.click(deleteBtn);

      expect(screen.getByText("Xóa bài viết?")).toBeInTheDocument();
    });
  });
});
