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

export const getGroupMembers = async (id) => {
    const res = await axiosClient.get(`${URL_GROUP}/${id}/members`);
    return res.data;
};

export const leaveGroup = async (id) => {
    const res = await axiosClient.delete(`${URL_GROUP}/${id}/leave`);
    return res.data;
};

export const deleteGroup = async (id) => {
    const res = await axiosClient.delete(`${URL_GROUP}/${id}`);
    return res.data;
};

export const inviteMembers = async (id, userIds) => {
    const res = await axiosClient.post(`${URL_GROUP}/${id}/invite`, userIds);
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

export const findPendingInvitations = async () => {
    const res = await axiosClient.get(`${URL_GROUP}/invitations`);
    return res.data;
};

export const acceptInvitation = async (id) => {
    const res = await axiosClient.post(`${URL_GROUP}/${id}/accept`);
    return res.data;
};

export const declineInvitation = async (id) => {
    const res = await axiosClient.post(`${URL_GROUP}/${id}/decline`);
    return res.data;
};

export const editCustomer = async (customer) => {
    const res = await axiosClient.put(`${URL_GROUP}/${customer.id}`, customer);
    return res.data;
};

export const deleteByIdCustomer = async (id) => {
    await axiosClient.delete(`${URL_GROUP}/${id}`);
};

export const joinGroup = async (id) => {
    const res = await axiosClient.post(`${URL_GROUP}/${id}/join`);
    return res.data;
};

export const getPendingRequests = async (id) => {
    const res = await axiosClient.get(`${URL_GROUP}/${id}/requests`);
    return res.data;
};

export const approveRequest = async (groupId, userId) => {
    const res = await axiosClient.post(`${URL_GROUP}/${groupId}/approve/${userId}`);
    return res.data;
};

export const rejectRequest = async (groupId, userId) => {
    const res = await axiosClient.post(`${URL_GROUP}/${groupId}/reject/${userId}`);
    return res.data;
};

export const kickMember = async (groupId, userId) => {
    const res = await axiosClient.delete(`${URL_GROUP}/${groupId}/kick/${userId}`);
    return res.data;
};
export const transferOwnership = async (groupId, newOwnerId) => {
    const res = await axiosClient.post(`${URL_GROUP}/${groupId}/transfer-ownership`, { newOwnerId });
    return res.data;
};

export const updateGroupMemberRole = async (groupId, userId, role) => {
    const res = await axiosClient.post(`${URL_GROUP}/${groupId}/members/${userId}/role`, { role });
    return res.data;
};
