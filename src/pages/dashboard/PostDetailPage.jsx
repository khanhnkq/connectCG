import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "../../components/feed/PostCard";
import postService from "../../services/PostService";
import RightSidebar from "../../components/layout/RightSidebar";
import { ArrowLeft, CircleNotch as Loader2 } from "@phosphor-icons/react";
import toast from "react-hot-toast";

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
        // navigate("/dashboard/feed");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
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
        <div className="max-w-4xl mx-auto w-full px-6 py-8 pb-20">
          <button
            onClick={() => navigate("/dashboard/feed")}
            className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-6 group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium">Quay lại</span>
          </button>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-primary" size={40} />
              <p className="text-text-secondary">Đang tải bài viết...</p>
            </div>
          ) : post ? (
            <PostCard
              post={post}
              onUpdate={handleUpdatePost}
              onDelete={handleDeletePost}
            />
          ) : (
            <div className="text-center py-20 bg-surface-main rounded-[2rem] border border-border-main border-dashed">
              <p className="text-text-secondary text-lg">
                Bài viết không tồn tại.
              </p>
              <button
                onClick={() => navigate("/dashboard/feed")}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Về trang chủ
              </button>
            </div>
          )}
        </div>
      </div>
      <RightSidebar />
    </div>
  );
}
