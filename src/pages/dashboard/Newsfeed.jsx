import React, { useState, useEffect } from "react";

import RightSidebar from "../../components/layout/RightSidebar";
import PostComposer from "../../components/feed/PostComposer";
import PostCard from "../../components/feed/PostCard";
import postService from "../../services/PostService";
import UserProfileService from "../../services/user/UserProfileService"; // Import service lấy profile
import toast from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";

import { usePostManagement } from "../../hooks/usePostManagement";

export default function Newsfeed() {
  const {
    posts,
    setPosts,
    deleteModal,
    setDeleteModal,
    handleDeletePost,
    confirmDelete,
    handleUpdatePost,
  } = usePostManagement();

  const [loading, setLoading] = useState(true);
  const [userAvatar, setUserAvatar] = useState("");

  useEffect(() => {
    fetchPosts();
    fetchCurrentUserAvatar(); // Gọi hàm lấy avatar
  }, []);

  // Hàm lấy Avatar
  const fetchCurrentUserAvatar = async () => {
    try {
      // 1. Lấy string JSON từ localStorage
      const userProfileStr = localStorage.getItem("userProfile");

      if (userProfileStr) {
        // 2. Parse từ String sang Object
        const userProfile = JSON.parse(userProfileStr);
        // 3. Lấy avatar (Fallback các trường hợp key có thể khác nhau)
        const avatar =
          userProfile.currentAvatarUrl ||
          userProfile.avatar ||
          userProfile.avatarUrl;

        if (avatar) {
          setUserAvatar(avatar);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user avatar", error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getPublicHomepagePosts();
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching newsfeed:", error);
      toast.error("Failed to load newsfeed posts");
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    // only add if approved (AI check result)
    if (newPost.status === "APPROVED") {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }
  };

  return (
    <div className="flex w-full relative items-start">
      <div className="flex-1 w-full">
        <div className="max-w-3xl mx-auto w-full px-6 py-8 pb-20">
          <div className="flex flex-col gap-6">
            <PostComposer
              userAvatar={userAvatar}
              onPostCreated={handlePostCreated}
            />

            {loading ? (
              <div className="text-center py-10 text-text-secondary">
                Loading feed...
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-10 text-text-secondary">
                No posts to show yet.
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={handleDeletePost} // <--- Thêm dòng này
                  onUpdate={handleUpdatePost} // <--- Thêm dòng này
                />
              ))
            )}
          </div>
        </div>
      </div>

      <RightSidebar />

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, postId: null })}
        onConfirm={confirmDelete}
        title="Xóa bài viết"
        message="Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
}
