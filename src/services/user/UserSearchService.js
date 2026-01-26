import axiosClient from "../../config/axiosConfig";

const UserSearchService = {
    /**
     * Tìm kiếm thành viên với bộ lọc
     * @param {Object} params - { keyword, maritalStatus, lookingFor, cityId, page, size ... }
     * @returns {Promise} - Page<MemberSearchResponse>
     */
    searchMembers: (params) => {
        const URL_USER = '/v1/users';
        return axiosClient.get(`${URL_USER}/search`, { params });
    }
};

export default UserSearchService;
