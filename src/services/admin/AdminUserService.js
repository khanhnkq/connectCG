import axiosClient from "../../config/axiosConfig";

const URL_ADMIN_USER = "/admin-user";

export const getAllUsers = async (params) => {
    const response = await axiosClient.get(URL_ADMIN_USER, { params });
    return response.data;
};

export const updateUserRole = async (userId, role) => {
    const response = await axiosClient.patch(`${URL_ADMIN_USER}/${userId}/role`, { role });
    return response.data;
};
