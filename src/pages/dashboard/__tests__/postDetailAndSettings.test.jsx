import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import PostDetailPage from "../PostDetailPage";
import PrivacySettings from "../PrivacySettings";
import postService from "../../../services/PostService";
import { MockAppProviders } from "../../../stories/mocks/MockAppProviders";

// Mock PostService
vi.mock("../../../services/PostService", () => ({
  default: {
    getPostById: vi.fn(),
    updatePost: vi.fn(),
    deletePost: vi.fn(),
    reactToPost: vi.fn(),
    unreactToPost: vi.fn(),
  },
}));

// Mock RightSidebar to keep tests isolated
vi.mock("../../../components/layout/RightSidebar", () => ({
  default: () => <div data-testid="right-sidebar">RightSidebar</div>,
}));

describe("PR #23: PostDetailPage & PrivacySettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("<PostDetailPage />", () => {
    const mockPostData = {
      id: 101,
      content: "Nội dung bài viết chi tiết tại ConnectCG",
      authorId: "user-1",
      authorFullName: "Nguyễn Kim Quốc Khánh",
      authorAvatar: "",
      createdAt: new Date().toISOString(),
      visibility: "PUBLIC",
      reactCount: 5,
      commentCount: 2,
      shareCount: 0,
      isPinned: false,
    };

    it("renders loading skeleton initially while waiting for post", () => {
      postService.getPostById.mockReturnValue(new Promise(() => {}));

      render(
        <MockAppProviders initialEntries={["/dashboard/post/101"]}>
          <Routes>
            <Route path="/dashboard/post/:id" element={<PostDetailPage />} />
          </Routes>
        </MockAppProviders>
      );

      expect(screen.getByText("Quay lại bảng tin")).toBeInTheDocument();
      // Should not render post content while loading
      expect(
        screen.queryByText("Nội dung bài viết chi tiết tại ConnectCG")
      ).toBeNull();
    });

    it("renders EmptyState when post is not found or fails to fetch", async () => {
      postService.getPostById.mockRejectedValue(new Error("Post not found"));

      render(
        <MockAppProviders initialEntries={["/dashboard/post/999"]}>
          <Routes>
            <Route path="/dashboard/post/:id" element={<PostDetailPage />} />
          </Routes>
        </MockAppProviders>
      );

      await waitFor(() => {
        expect(
          screen.getByText("Không tìm thấy bài viết")
        ).toBeInTheDocument();
      });

      expect(
        screen.getByText(
          "Bài viết này không tồn tại hoặc đã bị tác giả gỡ bỏ khỏi nền tảng."
        )
      ).toBeInTheDocument();
    });

    it("renders post content and author when fetch is successful", async () => {
      postService.getPostById.mockResolvedValue({ data: mockPostData });

      render(
        <MockAppProviders initialEntries={["/dashboard/post/101"]}>
          <Routes>
            <Route path="/dashboard/post/:id" element={<PostDetailPage />} />
          </Routes>
        </MockAppProviders>
      );

      await waitFor(() => {
        expect(
          screen.getByText("Nội dung bài viết chi tiết tại ConnectCG")
        ).toBeInTheDocument();
      });

      expect(
        screen.getByText("Nguyễn Kim Quốc Khánh")
      ).toBeInTheDocument();
      expect(screen.getByTestId("right-sidebar")).toBeInTheDocument();
    });
  });

  describe("<PrivacySettings />", () => {
    it("renders user greeting, security center heading and setting items", () => {
      render(
        <MockAppProviders initialEntries={["/dashboard/settings/privacy"]}>
          <PrivacySettings />
        </MockAppProviders>
      );

      expect(
        screen.getByText("Cài đặt quyền riêng tư & bảo mật")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Quyền riêng tư cá nhân")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Trí tuệ nhân tạo & Kiểm duyệt")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Quản lý phiên đăng nhập")
      ).toBeInTheDocument();
      expect(screen.getByText("Tài khoản riêng tư")).toBeInTheDocument();
      expect(screen.getByText("Trạng thái hoạt động")).toBeInTheDocument();
      expect(
        screen.getByText("Lọc nội dung độc hại bằng AI")
      ).toBeInTheDocument();
    });

    it("opens ConfirmDialog when clicking Đăng xuất tất cả button", () => {
      render(
        <MockAppProviders initialEntries={["/dashboard/settings/privacy"]}>
          <PrivacySettings />
        </MockAppProviders>
      );

      const logoutBtn = screen.getByRole("button", {
        name: "Đăng xuất tất cả",
      });
      expect(logoutBtn).toBeInTheDocument();

      fireEvent.click(logoutBtn);

      // ConfirmDialog should now be visible
      expect(
        screen.getByText("Đăng xuất khỏi tất cả thiết bị?")
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Thao tác này sẽ hủy tất cả các phiên đăng nhập khác/i)
      ).toBeInTheDocument();
    });

    it("closes ConfirmDialog when clicking Hủy bỏ", () => {
      render(
        <MockAppProviders initialEntries={["/dashboard/settings/privacy"]}>
          <PrivacySettings />
        </MockAppProviders>
      );

      const logoutBtn = screen.getByRole("button", {
        name: "Đăng xuất tất cả",
      });
      fireEvent.click(logoutBtn);

      expect(
        screen.getByText("Đăng xuất khỏi tất cả thiết bị?")
      ).toBeInTheDocument();

      const cancelBtn = screen.getByRole("button", { name: "Hủy bỏ" });
      fireEvent.click(cancelBtn);

      expect(
        screen.queryByText("Đăng xuất khỏi tất cả thiết bị?")
      ).toBeNull();
    });
  });
});
