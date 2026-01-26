import axiosClient from "../../config/axiosConfig";

const FriendRequestService = {
    /**
     * Lấy danh sách lời mời kết bạn đang chờ (Pending)
     * @param {number} page 
     * @param {number} size 
     */
    getPendingRequests: (page = 0, size = 10) => {
        return axiosClient.get('/v1/friend-requests', {
            params: { page, size }
        });
    },

    /**
     * Chấp nhận lời mời kết bạn
     * @param {number} requestId 
     */
    acceptRequest: (requestId) => {
        return axiosClient.post(`/v1/friend-requests/${requestId}/accept`);
    },

    /**
     * Từ chối lời mời kết bạn
     * @param {number} requestId 
     */
    rejectRequest: (requestId) => {
        return axiosClient.post(`/v1/friend-requests/${requestId}/reject`);
    },

    /**
     * Gửi lời mời kết bạn mới
     * @param {number} receiverId 
     */
    sendRequest: (receiverId) => {
        return axiosClient.post(`/v1/friend-requests/send/${receiverId}`);
    }
};

export default FriendRequestService;
