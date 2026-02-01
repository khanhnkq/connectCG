import axiosClient from '../config/axiosConfig';

const postService = {
    getPostById(id) {
        return axiosClient.get(`/posts/${id}`);
    },
    getPostsByUserId(userId){
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
    getPublicHomepagePosts() {
        return axiosClient.get('/posts');
    },
    approvePost(postId) {
        return axiosClient.post(`/posts/${postId}/approve`);
    },
    createPost(post){
        return axiosClient.post(`/posts`,post);
    },
    updatePost(id, data) {
    // data có thể là { content: "...", visibility: "..." }
    return axiosClient.put(`/posts/${id}`, data); 
},
};

export default postService;