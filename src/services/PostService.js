import axiosClient from '../config/axiosConfig';

const postService = {
    getPostById(id) {
        return axiosClient.get(`/posts/${id}`);
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
    getPublicHomepagePosts() {
        return axiosClient.get('/posts/public/homepage');
    },
    approvePost(postId) {
        return axiosClient.post(`/posts/${postId}/approve`);
    }
};

export default postService;