import axiosClient from '../config/axiosConfig';

const URL_NOTIFICATION = '/notifications';

export const getMyNotifications = async () => {
    const res = await axiosClient.get(URL_NOTIFICATION);
    return res.data;
};

export const markAsRead = async (id) => {
    const res = await axiosClient.put(`${URL_NOTIFICATION}/${id}/read`);
    return res.data;
};

export const deleteNotification = async (id) => {
    const res = await axiosClient.delete(`${URL_NOTIFICATION}/${id}`);
    return res.data;
};
