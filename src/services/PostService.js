import axiosClient from '../config/axiosConfig';

const postService = {
    getPostById(id) {
        return axiosClient.get(`/posts/${id}`);
    },
    deletePost(id) {
        return axiosClient.delete(`/posts/${id}`);
    },
    getHomepagePosts() {
        return axiosClient.get('/admin/posts/homepage');
    },
    checkPostWithAI(postId) {
        return axiosClient.post(`/admin/posts/${postId}/check-ai`);
    }
};

export default postService;