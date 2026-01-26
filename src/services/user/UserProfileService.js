import axiosClient from "../config/axiosConfig";

const UserProfileService = {
    /**
     * Lấy thông tin profile của người dùng
     * @param {number|string} userId - ID của người dùng cần lấy profile
     * @returns {Promise} - Kết quả từ API
     */
    getUserProfile: (userId) => {
        // Trùng khớp với @GetMapping("/{userId}/profile") trong UserProfileController.java
        // Base URL đã là /api trong axiosConfig, nên ở đây dùng /v1/users/...
        return axiosClient.get(`/v1/users/${userId}/profile`);
    }
};

export default UserProfileService;
