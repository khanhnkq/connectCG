import axiosClient from '../config/axiosConfig';

const postService = {
    getPostById(id) {
        return axiosClient.get(`/posts/${id}`);
    },
    deletePost(id) {
        return axiosClient.delete(`/posts/${id}`);
    }
};

export default postService;