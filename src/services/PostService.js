import { postApi } from '../api';
import axiosClient from '../config/axiosConfig';

/**
 * PostService - Facade wrapper delegating to auto-generated postApi SDK.
 * Preserves 100% backward compatibility for all existing components.
 */
const postService = {
    getPostById(id) {
        return postApi.postGetPostById({ id });
    },
    getPostsByUserId(userId) {
        return postApi.postGetUserProfilePosts({ id: userId });
    },
    deletePost(id) {
        return postApi.postDeletePost({ id });
    },
    getPendingHomepagePosts(page = 0, size = 10) {
        return postApi.postGetPendingHomepagePosts({ page, size });
    },
    getAuditHomepagePosts(page = 0, size = 10) {
        return postApi.postGetAuditHomepagePosts({ page, size });
    },
    getPublicHomepagePosts(page = 0, size = 10) {
        return postApi.postGetPublicHomepagePosts({ page, size });
    },
    approvePost(postId) {
        return postApi.postApprovePost({ id: postId });
    },
    createPost(post) {
        return postApi.postCreatePost(post);
    },
    updatePost(id, data) {
        return postApi.postUpdatePost({ id }, data);
    },
    reactToPost(postId, reactionType) {
        return postApi.postReactToPost({ id: postId }, { reaction: reactionType });
    },
    unreactToPost(postId) {
        return postApi.postUnReactToPost({ id: postId });
    },
    rejectPost(postId, manualStrike = false) {
        return postApi.postRejectPost({ id: postId }, { params: { manualStrike } });
    },
    togglePinPost(groupId, postId) {
        return axiosClient.post(`/groups/${groupId}/posts/${postId}/pin`);
    },
    sharePost(originalPostId, data) {
        return postApi.postSharePost({ id: originalPostId }, data);
    },
};

export default postService;