import axiosClient from '../config/axiosConfig';

const userService = {
    getUserById(id) {
        return axiosClient.get(`/users/${id}`);
    },
    banUser(id) {
        return axiosClient.post(`/users/${id}/block`);
    },
    unbanUser(id) {
        return axiosClient.post(`/users/${id}/unblock`);
    }
};

export default userService;