import { describe, it, expect, vi } from "vitest";
import React from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import PostHeader from "../PostHeader";
import PostContent from "../PostContent";
import PostMediaGrid from "../PostMediaGrid";
import PostReactions from "../PostReactions";
import PostFooterAction from "../PostFooterAction";
import PostCard from "../PostCard";
import { MockAppProviders } from "../../../stories/mocks/MockAppProviders";

describe("Feed Components (PostCard & Subcomponents)", () => {
  describe("<PostHeader />", () => {
    it("renders author name, group, relative time and triggers action callbacks", () => {
      const onEdit = vi.fn();
      const onDelete = vi.fn();
      const onShare = vi.fn();
      const onReport = vi.fn();
      const setShowMenu = vi.fn();

      render(
        <MemoryRouter>
          <PostHeader
            author={{ id: "user-1", name: "Nguyễn Văn A", avatar: "", isSystem: true }}
            timeDisplay="5 phút trước"
            groupId="grp-10"
            groupName="Cộng đồng React"
            visibility="PUBLIC"
            isPinned={false}
            canPin={true}
            currentUserId="user-1"
            showMenu={true}
            setShowMenu={setShowMenu}
            onEdit={onEdit}
            onDelete={onDelete}
            onShare={onShare}
            onReport={onReport}
          />
        </MemoryRouter>
      );

      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
      expect(screen.getByText("Cộng đồng React")).toBeInTheDocument();
      expect(screen.getByText("5 phút trước")).toBeInTheDocument();
      expect(screen.getByText("Chính thức")).toBeInTheDocument();

      // Click Edit
      const editBtn = screen.getByText("Chỉnh sửa");
      fireEvent.click(editBtn);
      expect(onEdit).toHaveBeenCalled();

      // Click Delete
      const deleteBtn = screen.getByText("Xóa bài");
      fireEvent.click(deleteBtn);
      expect(onDelete).toHaveBeenCalled();
    });
  });

  describe("<PostContent />", () => {
    it("renders short content directly without 'Xem thêm'", () => {
      render(<PostContent content="Bài viết ngắn gọn chào ngày mới." />);
      expect(screen.getByText("Bài viết ngắn gọn chào ngày mới.")).toBeInTheDocument();
      expect(screen.queryByText("Xem thêm")).toBeNull();
    });

    it("truncates long content and toggles with 'Xem thêm' / 'Ẩn bớt'", () => {
      const longText = "A".repeat(200);
      render(<PostContent content={longText} />);

      expect(screen.getByText(/Xem thêm/)).toBeInTheDocument();
      expect(screen.getByText(`${"A".repeat(150)}...`)).toBeInTheDocument();

      // Expand
      fireEvent.click(screen.getByText("Xem thêm"));
      expect(screen.getByText(longText)).toBeInTheDocument();
      expect(screen.getByText("Ẩn bớt")).toBeInTheDocument();

      // Collapse
      fireEvent.click(screen.getByText("Ẩn bớt"));
      expect(screen.getByText(`${"A".repeat(150)}...`)).toBeInTheDocument();
    });
  });

  describe("<PostMediaGrid />", () => {
    it("renders 1 image properly", () => {
      const onMediaClick = vi.fn();
      render(
        <PostMediaGrid
          mediaItems={[{ url: "https://example.com/img1.jpg", type: "IMAGE" }]}
          onMediaClick={onMediaClick}
        />
      );
      const img = screen.getByRole("img");
      expect(img.getAttribute("src")).toBe("https://example.com/img1.jpg");
      fireEvent.click(img.parentElement);
      expect(onMediaClick).toHaveBeenCalledWith(0);
    });

    it("renders overlay counter for 4+ images", () => {
      const media = [
        { url: "https://example.com/1.jpg" },
        { url: "https://example.com/2.jpg" },
        { url: "https://example.com/3.jpg" },
        { url: "https://example.com/4.jpg" },
        { url: "https://example.com/5.jpg" },
        { url: "https://example.com/6.jpg" },
      ];
      render(<PostMediaGrid mediaItems={media} />);
      expect(screen.getByText("+2")).toBeInTheDocument();
    });
  });

  describe("<PostReactions />", () => {
    it("renders reaction counts and comment counts", () => {
      const onToggle = vi.fn();
      render(
        <PostReactions
          reactCount={15}
          commentCount={4}
          shareCount={2}
          onToggleComments={onToggle}
        />
      );

      expect(screen.getByText("15")).toBeInTheDocument();
      const commentBtn = screen.getByText("4 bình luận");
      expect(commentBtn).toBeInTheDocument();
      expect(screen.getByText("2 chia sẻ")).toBeInTheDocument();

      fireEvent.click(commentBtn);
      expect(onToggle).toHaveBeenCalled();
    });

    it("renders null when there are no engagements", () => {
      const { container } = render(
        <PostReactions reactCount={0} commentCount={0} shareCount={0} />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe("<PostFooterAction />", () => {
    it("renders comment and share buttons", () => {
      const onToggleComments = vi.fn();
      const onShareClick = vi.fn();

      render(
        <PostFooterAction
          currentReaction={null}
          onReact={vi.fn()}
          onToggleComments={onToggleComments}
          onShareClick={onShareClick}
        />
      );

      const commentBtn = screen.getByText("Bình luận");
      fireEvent.click(commentBtn);
      expect(onToggleComments).toHaveBeenCalled();

      const shareBtn = screen.getByText("Chia sẻ");
      fireEvent.click(shareBtn);
      expect(onShareClick).toHaveBeenCalled();
    });
  });

  describe("<PostCard /> (Integration & Backward Compatibility)", () => {
    it("renders composed post card with all details smoothly", () => {
      const mockPost = {
        id: 999,
        content: "Đây là bài viết kiểm thử tổng hợp PostCard",
        authorId: "user-1",
        authorFullName: "Nguyễn Kim Quốc Khánh",
        authorAvatar: "",
        createdAt: new Date().toISOString(),
        visibility: "PUBLIC",
        reactCount: 10,
        commentCount: 3,
        shareCount: 1,
        isPinned: true,
      };

      render(
        <MockAppProviders>
          <PostCard post={mockPost} />
        </MockAppProviders>
      );

      expect(screen.getByText("Bài viết đã ghim")).toBeInTheDocument();
      expect(screen.getByText("Nguyễn Kim Quốc Khánh")).toBeInTheDocument();
      expect(screen.getByText("Đây là bài viết kiểm thử tổng hợp PostCard")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("3 bình luận")).toBeInTheDocument();
    });
  });
});
