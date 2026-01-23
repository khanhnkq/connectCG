import axiosClient from "../../config/axiosConfig";

const URL_GROUP = "/groups";

export const findAllGroup = async () => {
    const res = await axiosClient.get(URL_GROUP);
    return res.data;
};

export const searchGroups = async (query) => {
    const res = await axiosClient.get(`${URL_GROUP}/search`, {
        params: { name: query }
    });
    return res.data;
};

export const findById = async (id) => {
    const res = await axiosClient.get(`${URL_GROUP}/${id}`);
    return res.data;
};

export const updateGroup = async (id, data) => {
    const res = await axiosClient.put(`${URL_GROUP}/${id}`, data);
    return res.data;
};

export const addGroup = async (group) => {
    const res = await axiosClient.post(URL_GROUP, group);
    return res.data;
};

export const findMyGroups = async () => {
    const res = await axiosClient.get(`${URL_GROUP}/my-groups`);
    return res.data;
};

export const findDiscoverGroups = async () => {
    const res = await axiosClient.get(`${URL_GROUP}/discover`);
    return res.data;
};

export const editCustomer = async (customer) => {
    const res = await axiosClient.put(`${URL_GROUP}/${customer.id}`, customer);
    return res.data;
};

export const deleteByIdCustomer = async (id) => {
    await axiosClient.delete(`${URL_GROUP}/${id}`);
};
