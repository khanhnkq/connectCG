import axiosClient from "../../config/axiosConfig";

const UserProfileService = {
    /**
     * Lấy thông tin profile của người dùng
     * @param {number|string} userId - ID của người dùng cần lấy profile
     * @returns {Promise} - Kết quả từ API
     */
    getUserProfile: (userId) => {
        // Trùng khớp với @GetMapping("/{userId}/profile") trong UserProfileController.java
        // Base URL là /api/v1 trong axiosConfig, nên ở đây dùng /users/...
        return axiosClient.get(`/users/${userId}/profile`);
    },

    updateAvatar: (imageUrl) => {
        return axiosClient.post('/users/avatar', { url: imageUrl });
    },

    updateCover: (imageUrl) => {
        return axiosClient.post('/users/cover', { url: imageUrl });
    },
    
    updateProfileInfo: (data) => {
        return axiosClient.put('/users/profile', data);
    },

    getAllHobbies: () => {
        return axiosClient.get('/hobbies');
    },

    updateUserHobbies: (hobbyIds) => {
        return axiosClient.put('/users/hobbies', hobbyIds);
    }
};

export default UserProfileService;
