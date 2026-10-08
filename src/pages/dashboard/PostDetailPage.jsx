import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "../../components/feed/PostCard";
import postService from "../../services/PostService";
import RightSidebar from "../../components/layout/RightSidebar";
import { ArrowLeft, FileX } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import { Skeleton, EmptyState } from "../../components/ui";

/**
 * Modern Flat Skeleton for Post Detail loading state
 */
function PostDetailSkeleton() {
  return (
    <div className="bg-surface-main rounded-2xl border-0 p-6 space-y-4">
      {/* Author Header */}
      <div className="flex items-center gap-3">
        <Skeleton rounded="full" className="size-11 shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Content lines */}
      <div className="space-y-2 py-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Media placeholder */}
      <Skeleton className="h-64 w-full rounded-2xl" />

      {/* Stats bar */}
      <div className="pt-2 flex justify-between items-center border-0">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-0">
        <Skeleton className="h-9 w-full rounded-xl" />
        <Skeleton className="h-9 w-full rounded-xl" />
        <Skeleton className="h-9 w-full rounded-xl" />
      </div>

      {/* Comment section skeleton */}
      <div className="pt-4 border-0 space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton rounded="full" className="size-9 shrink-0" />
          <Skeleton className="h-10 flex-1 rounded-xl" />
        </div>
        <div className="flex items-start gap-3 pt-2">
          <Skeleton rounded="full" className="size-8 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await postService.getPostById(id);
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post detail:", error);
        toast.error("Không tìm thấy bài viết hoặc bài viết đã bị xóa");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  // Centralized realtime listener for this specific post
  useEffect(() => {
    if (!id) return undefined;

    const handleDetailEvent = (e) => {
      const detail = e.detail;
      if (!detail) return;
      if (String(detail.postId) !== String(id)) return;

      // If this post was deleted
      if (detail.action === "DELETED" && !detail.commentId) {
        toast.error("Bài viết này đã bị xóa");
        navigate("/dashboard/feed");
        return;
      }

      setPost((prev) => {
        if (!prev) return prev;
        const updated = { ...prev };
        if (typeof detail.newReactCount === "number") updated.reactCount = detail.newReactCount;
        if (typeof detail.newCommentCount === "number") updated.commentCount = detail.newCommentCount;
        if (typeof detail.newShareCount === "number") updated.shareCount = detail.newShareCount;
        if (detail.post) Object.assign(updated, detail.post);
        return updated;
      });
    };

    window.addEventListener("postEvent", handleDetailEvent);
    return () => {
      window.removeEventListener("postEvent", handleDetailEvent);
    };
  }, [id, navigate]);

  const handleUpdatePost = async (postId, updatedData) => {
    try {
      const response = await postService.updatePost(postId, updatedData);
      setPost((prev) => ({ ...prev, ...(response?.data || updatedData) }));
      toast.success("Cập nhật bài viết thành công");
    } catch (error) {
      console.error("Cập nhật bài viết thất bại:", error);
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
      throw error;
    }
  };

  const handleDeletePost = async (postId) => {
    const targetId = postId || id;
    try {
      await postService.deletePost(targetId);
      toast.success("Bài viết đã được xóa");
      navigate("/dashboard/feed");
    } catch (error) {
      console.error("Xóa bài viết thất bại:", error);
      toast.error("Xóa thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex w-full relative items-start">
      <div className="flex-1 w-full">
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 pb-20">
          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate("/dashboard/feed")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-text-main transition-colors mb-6 group cursor-pointer"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Quay lại bảng tin</span>
          </button>

          {/* Main Content Area */}
          {loading ? (
            <PostDetailSkeleton />
          ) : post ? (
            <PostCard
              post={post}
              onUpdate={handleUpdatePost}
              onDelete={handleDeletePost}
              defaultShowComments={true}
            />
          ) : (
            <EmptyState
              icon={FileX}
              title="Không tìm thấy bài viết"
              description="Bài viết này không tồn tại hoặc đã bị tác giả gỡ bỏ khỏi nền tảng."
              actionText="Quay lại bảng tin"
              onAction={() => navigate("/dashboard/feed")}
            />
          )}
        </div>
      </div>
      <RightSidebar />
    </div>
  );
}
