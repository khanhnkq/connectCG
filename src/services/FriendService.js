import axiosClient from "../config/axiosConfig";

const URL_FRIEND = "/friend";

export const getFriends = async (params) => {
    const res = await axiosClient.get(URL_FRIEND, { params });
    return res.data;
};
