import axiosClient from "../../config/axiosConfig";

const URL_ADMIN_USER = "/admin-user";

export const getAllUsers = async () => {
    const response = await axiosClient.get(URL_ADMIN_USER);
    return response.data;
};
