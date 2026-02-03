import axiosClient from '../config/axiosConfig';

const postService = {
    getPostById(id) {
        return axiosClient.get(`/posts/${id}`);
    },
    getPostsByUserId(userId) {
        return axiosClient.get(`/posts/user/${userId}`)
    },
    deletePost(id) {
        return axiosClient.delete(`/posts/${id}`);
    },
    getPendingHomepagePosts() {
        return axiosClient.get('/posts/admin/pending');
    },
    getAuditHomepagePosts() {
        return axiosClient.get('/posts/admin/audit');
    },
    getPublicHomepagePosts(page = 0, size = 10) {
        return axiosClient.get(`/posts`, { params: { page, size } });
    },
    approvePost(postId) {
        return axiosClient.post(`/posts/${postId}/approve`);
    },
    createPost(post) {
        return axiosClient.post(`/posts`, post);
    },
    updatePost(id, data) {
        // data có thể là { content: "...", visibility: "..." }
        return axiosClient.put(`/posts/${id}`, data);
    },
    reactToPost(postId, reactionType) {
        return axiosClient.post(`/posts/${postId}/react`, { reaction: reactionType });
    },
    unreactToPost(postId) {
        return axiosClient.delete(`/posts/${postId}/react`);
    },
    rejectPost(postId, manualStrike = false) {
        return axiosClient.post(`/posts/${postId}/reject`, null, {
            params: { manualStrike }
        });
    }

};

export default postService;