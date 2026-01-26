import axiosClient from "../../config/axiosConfig";

const FriendService = {
    /**
     * Lấy danh sách bạn bè của một người dùng
     * @param {number} userId 
     * @param {Object} filters - { name, gender, cityId, page, size }
     */
    getFriends: (userId, filters = {}) => {
        const { name, gender, cityId, page = 0, size = 10 } = filters;
        return axiosClient.get(`/v1/friends/${userId}`, {
            params: { name, gender, cityId, page, size }
        });
    }
};

export default FriendService;
