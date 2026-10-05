import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import RightSidebar from "../../components/layout/RightSidebar";
import PostComposer from "../../components/feed/PostComposer";
import PostCard from "../../components/feed/PostCard";
import ConfirmModal from "../../components/common/ConfirmModal";
import { EmptyState, Skeleton } from "../../components/ui";

import { usePostManagement } from "../../hooks/usePostManagement";
import { useFeed } from "../../features/feed/hooks/useFeed";
import { fetchUserProfile } from "../../redux/slices/userSlice";

export default function Newsfeed() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile: userProfile } = useSelector((state) => state.user);

  const {
    posts,
    loading,
    hasMore,
    prependPost,
    updatePost,
    removePost,
    lastPostElementRef,
  } = useFeed();

  const {
    deleteModal,
    setDeleteModal,
    handleDeletePost,
    confirmDelete,
    handleUpdatePost,
  } = usePostManagement(posts, (deletedId) => removePost(deletedId));

  const userAvatar = userProfile?.currentAvatarUrl || "";

  useEffect(() => {
    const userId = user?.id || user?.userId || user?.sub;
    if (userId && !userProfile) {
      dispatch(fetchUserProfile(userId));
    }
  }, [user, userProfile, dispatch]);

  const handlePostCreated = (newPost) => {
    if (newPost?.status === "APPROVED") {
      prependPost(newPost);
    }
  };

  const handleUpdate = async (postId, updatedData) => {
    await handleUpdatePost(postId, updatedData);
    updatePost(postId, updatedData);
  };

  return (
    <div className="flex w-full relative items-start">
      <div className="flex-1 w-full">
        <div className="max-w-4xl mx-auto w-full px-4 md:px-6 py-6 md:py-8 pb-20">
          <div className="flex flex-col gap-4">
            <PostComposer
              userAvatar={userAvatar}
              onPostCreated={handlePostCreated}
            />

            {posts.length === 0 && loading ? (
              <div className="flex flex-col gap-4">
                <Skeleton className="h-48 rounded-2xl" />
                <Skeleton className="h-64 rounded-2xl" />
              </div>
            ) : posts.length === 0 && !loading ? (
              <EmptyState
                title="Chưa có bài viết nào"
                description="Bảng tin của bạn đang trống. Hãy kết nối bạn bè hoặc đăng bài viết đầu tiên!"
              />
            ) : (
              posts.map((post, index) => {
                const isTrigger =
                  index === posts.length - 3 ||
                  (posts.length < 3 && index === posts.length - 1);

                return (
                  <motion.div
                    ref={isTrigger ? lastPostElementRef : null}
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.35,
                      delay: index < 3 ? index * 0.08 : 0,
                    }}
                  >
                    <PostCard
                      post={post}
                      onDelete={handleDeletePost}
                      onUpdate={handleUpdate}
                    />
                  </motion.div>
                );
              })
            )}

            {loading && posts.length > 0 && (
              <div className="py-4">
                <Skeleton className="h-32 rounded-2xl" />
              </div>
            )}

            {!hasMore && posts.length > 0 && (
              <div className="text-center py-6 text-text-muted">
                <p className="text-xs">Bạn đã xem hết bài viết.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <RightSidebar />

      {/* Delete Confirmation Modal */}
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
