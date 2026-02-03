
import { useState } from "react";
import postService from "../services/PostService";
import toast from "react-hot-toast";

export const usePostManagement = (initialPosts = [], onDeleteSuccess = null) => {
  const [posts, setPosts] = useState(initialPosts);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    postId: null,
  });
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const handleDeletePost = (postId) => {
    setDeleteModal({ isOpen: true, postId });
  };

  const confirmDelete = async () => {
    const { postId } = deleteModal;
    if (!postId) return;

    setIsConfirmLoading(true);
    try {
      await postService.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success("Xóa bài viết thành công");
      setDeleteModal({ isOpen: false, postId: null });
    } catch (error) {
      console.error("Xóa bài viết thất bại:", error);
      toast.error("Xóa bài viết thất bại");
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const handleUpdatePost = async (postId, updatedData) => {
    try {
      const response = await postService.updatePost(postId, updatedData);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, ...response.data } : p))
      );
      toast.success("Cập nhật bài viết thành công");
    } catch (error) {
      console.error("Cập nhật bài viết thất bại:", error);
      toast.error("Cập nhật bài viết thất bại");
    }
  };

  return {
    posts,
    setPosts,
    deleteModal,
    setDeleteModal,
    handleDeletePost,
    confirmDelete,
    handleUpdatePost,
    isConfirmLoading,
  };
};
