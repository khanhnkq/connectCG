import { friendRestApi } from "../../api";

/**
 * FriendService - Facade wrapper delegating to auto-generated friendRestApi SDK.
 * Preserves 100% backward compatibility for all existing components.
 */
const FriendService = {
    /**
     * Lấy danh sách bạn bè của một người dùng
     * @param {number} userId 
     * @param {Object} filters - { name, gender, cityId, page, size }
     */
    getFriends: (userId, filters = {}) => {
        const { name, gender, cityId, page = 0, size = 10 } = filters;
        return friendRestApi.friendrestGetFriendsByUserId({ userId, name, gender, cityId, page, size });
    },

    /**
     * Lấy danh sách bạn bè của chính người dùng hiện tại
     * @param {Object} params - { page, size }
     */
    getMyFriends: (params = {}) => {
        return friendRestApi.friendrestGetMyFriends(params);
    },

    /**
     * Hủy kết bạn (Unfriend)
     * @param {number} friendId 
     */
    unfriend: (friendId) => {
        return friendRestApi.friendrestUnfriend({ friendId });
    },
};

export default FriendService;
