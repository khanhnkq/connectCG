import axiosClient from "../../config/axiosConfig";

const ChatService = {
    getMyChatRooms: async () => {
        return axiosClient.get('/chat/my');
    },

    getOrCreateDirectChat: async (targetUserId) => {
        return axiosClient.post(`/chat/direct/${targetUserId}`);
    },

    renameRoom: async (roomId, newName) => {
        return axiosClient.put(`/chat/${roomId}/name`, newName, {
            headers: { 'Content-Type': 'text/plain' }
        });
    },

    createGroupChat: async (name, memberIds) => {
        return axiosClient.post('/chat/group', { name, memberIds });
    },

    updateAvatar: async (roomId, url) => {
        return axiosClient.put(`/chat/${roomId}/avatar`, { url });
    },

    inviteMembers: async (roomId, userIds) => {
        return axiosClient.post(`/chat/${roomId}/invite`, { userIds });
    },
    deleteChatRoom: async (roomId) => {
        return axiosClient.delete(`/chat/${roomId}`);
    }
};

export default ChatService;
