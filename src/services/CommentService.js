import axiosClient from '../config/axiosConfig';
const commentService = {
    getComments(postId) {
        return axiosClient.get(`/posts/${postId}/comments`);
    },
    
    createComment(postId, content, parentId = null) {
        return axiosClient.post(`/posts/${postId}/comments`, {
            content,
            parentId
        });
    },
    
    deleteComment(postId, commentId) {
        return axiosClient.delete(`/posts/${postId}/comments/${commentId}`);
    }
};
export default commentService;