import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import Newsfeed from "../Newsfeed";
import authReducer from "../../../redux/slices/authSlice";
import userReducer from "../../../redux/slices/userSlice";

// Mock sub-components
vi.mock("../../../components/layout/RightSidebar", () => ({
  default: () => <div data-testid="right-sidebar">RightSidebar</div>,
}));

vi.mock("../../../components/feed/PostComposer", () => ({
  default: () => <div data-testid="post-composer">PostComposer</div>,
}));

vi.mock("../../../components/feed/PostCard", () => ({
  default: ({ post, onDelete, onUpdate }) => (
    <div data-testid={`post-card-${post.id}`}>
      <span>{post.content}</span>
      <button onClick={() => onDelete(post.id)}>Delete</button>
      <button onClick={() => onUpdate(post.id, { content: "Updated" })}>
        Update
      </button>
    </div>
  ),
}));

// Mock hooks
const mockUseFeed = vi.fn();
vi.mock("../../../features/feed/hooks/useFeed", () => ({
  useFeed: () => mockUseFeed(),
}));

const mockDeleteModal = { isOpen: false, postId: null };
const mockSetDeleteModal = vi.fn();
const mockHandleDeletePost = vi.fn();
const mockConfirmDelete = vi.fn();
const mockHandleUpdatePost = vi.fn();

vi.mock("../../../hooks/usePostManagement", () => ({
  usePostManagement: () => ({
    deleteModal: mockDeleteModal,
    setDeleteModal: mockSetDeleteModal,
    handleDeletePost: mockHandleDeletePost,
    confirmDelete: mockConfirmDelete,
    handleUpdatePost: mockHandleUpdatePost,
  }),
}));

describe("Newsfeed Component", () => {
  let store;
  const mockLastPostElementRef = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    store = configureStore({
      reducer: {
        auth: authReducer,
        user: userReducer,
      },
      preloadedState: {
        auth: {
          user: { id: 1, email: "test@example.com" },
          isAuthenticated: true,
        },
        user: {
          profile: { currentAvatarUrl: "https://example.com/avatar.jpg" },
        },
      },
    });

    mockUseFeed.mockReturnValue({
      posts: [],
      loading: false,
      hasMore: true,
      prependPost: vi.fn(),
      updatePost: vi.fn(),
      removePost: vi.fn(),
      lastPostElementRef: mockLastPostElementRef,
    });
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <Newsfeed />
      </Provider>
    );

  it("renders EmptyState when there are no posts and loading is false", () => {
    mockUseFeed.mockReturnValue({
      posts: [],
      loading: false,
      hasMore: false,
      prependPost: vi.fn(),
      updatePost: vi.fn(),
      removePost: vi.fn(),
      lastPostElementRef: mockLastPostElementRef,
    });

    renderComponent();

    expect(screen.getByText("Chưa có bài viết nào")).toBeInTheDocument();
    expect(screen.getByTestId("post-composer")).toBeInTheDocument();
    expect(screen.getByTestId("right-sidebar")).toBeInTheDocument();
  });

  it("renders skeletons when initial loading with no posts", () => {
    mockUseFeed.mockReturnValue({
      posts: [],
      loading: true,
      hasMore: true,
      prependPost: vi.fn(),
      updatePost: vi.fn(),
      removePost: vi.fn(),
      lastPostElementRef: mockLastPostElementRef,
    });

    const { container } = renderComponent();

    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders posts with keys and attaches lastPostElementRef to trigger post", () => {
    const mockPosts = [
      { id: 1, content: "Post 1" },
      { id: 2, content: "Post 2" },
      { id: 3, content: "Post 3" },
      { id: 4, content: "Post 4" },
      { id: 5, content: "Post 5" },
    ];

    mockUseFeed.mockReturnValue({
      posts: mockPosts,
      loading: false,
      hasMore: true,
      prependPost: vi.fn(),
      updatePost: vi.fn(),
      removePost: vi.fn(),
      lastPostElementRef: mockLastPostElementRef,
    });

    renderComponent();

    // Verify all posts are rendered
    expect(screen.getByTestId("post-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("post-card-2")).toBeInTheDocument();
    expect(screen.getByTestId("post-card-3")).toBeInTheDocument();
    expect(screen.getByTestId("post-card-4")).toBeInTheDocument();
    expect(screen.getByTestId("post-card-5")).toBeInTheDocument();

    // For 5 posts, trigger index is length - 3 = index 2 (post 3)
    // Verify lastPostElementRef was attached to a DOM node
    expect(mockLastPostElementRef).toHaveBeenCalled();
  });

  it("renders end of feed message when !hasMore and posts exist", () => {
    mockUseFeed.mockReturnValue({
      posts: [{ id: 1, content: "Post 1" }],
      loading: false,
      hasMore: false,
      prependPost: vi.fn(),
      updatePost: vi.fn(),
      removePost: vi.fn(),
      lastPostElementRef: mockLastPostElementRef,
    });

    renderComponent();

    expect(screen.getByText("Bạn đã xem hết bài viết.")).toBeInTheDocument();
  });

  it("opens ConfirmDialog when deleting a post", () => {
    mockDeleteModal.isOpen = true;
    mockDeleteModal.postId = 123;

    renderComponent();

    expect(screen.getByText("Xóa bài viết")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
      )
    ).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", { name: "Xóa" });
    fireEvent.click(confirmButton);
    expect(mockConfirmDelete).toHaveBeenCalled();
  });
});
