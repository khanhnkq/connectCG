import React, { useState, useEffect } from "react";

import RightSidebar from "../../components/layout/RightSidebar";
import PostComposer from "../../components/feed/PostComposer";
import PostCard from "../../components/feed/PostCard";
import postService from "../../services/PostService";
import UserProfileService from "../../services/user/UserProfileService"; // Import service lấy profile
import toast from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";

import { usePostManagement } from "../../hooks/usePostManagement";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../../redux/slices/userSlice";

import { motion } from "framer-motion";

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

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile: userProfile } = useSelector((state) => state.user);

  const userAvatar = userProfile?.currentAvatarUrl || "";

  // Ref for intersection observer
  const observer = React.useRef();
  const lastPostElementRef = React.useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  useEffect(() => {
    const userId = user?.id || user?.userId || user?.sub;
    if (userId && !userProfile) {
      dispatch(fetchUserProfile(userId));
    }
  }, [user, userProfile, dispatch]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Default size 10
        const response = await postService.getPublicHomepagePosts(page, 10);
        const newPosts = response.data.content || response.data; // Handle Page<T> or List<T>
        const isLast = response.data.last; // Spring Page object has 'last' boolean

        setPosts((prev) => {
          // If page 0, replace. Else append.
          if (page === 0) return newPosts;

          // Allow duplicates? ideally backend filters them, but let's be safe
          const existingIds = new Set(prev.map((p) => p.id));
          const filteredNew = newPosts.filter((p) => !existingIds.has(p.id));
          return [...prev, ...filteredNew];
        });

        setHasMore(!isLast && newPosts.length > 0);
      } catch (error) {
        console.error("Error fetching newsfeed:", error);
        toast.error("Failed to load newsfeed posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, setPosts]);

  const handlePostCreated = (newPost) => {
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

            {posts.length === 0 && !loading ? (
              <div className="text-center py-10 text-text-secondary">
                No posts to show yet.
              </div>
            ) : (
              posts.map((post, index) => {
                // Trigger load when reaching 3rd post from bottom (if plenty of posts)
                // or last post (if few posts)
                const isTrigger =
                  index === posts.length - 3 ||
                  (posts.length < 3 && index === posts.length - 1);

                return (
                  <motion.div
                    ref={isTrigger ? lastPostElementRef : null}
                    key={post.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.5,
                      delay: index < 3 ? index * 0.1 : 0,
                    }}
                  >
                    <PostCard
                      post={post}
                      onDelete={handleDeletePost}
                      onUpdate={handleUpdatePost}
                    />
                  </motion.div>
                );
              })
            )}

            {!hasMore && posts.length > 0 && (
              <div className="text-center py-8 text-text-secondary/70">
                <p className="text-sm">Bạn đã xem hết bài viết.</p>
              </div>
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
