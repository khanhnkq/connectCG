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

    updateLastMessageAt: async (firebaseRoomKey) => {
        return axiosClient.post(`/chat/last-message`, { firebaseRoomKey });
    },

    inviteMembers: async (roomId, userIds) => {
        return axiosClient.post(`/chat/${roomId}/invite`, { userIds });
    },
    deleteChatRoom: async (roomId) => {
        return axiosClient.delete(`/chat/${roomId}`);
    },

    removeMember: async (roomId, userId) => {
        return axiosClient.delete(`/chat/${roomId}/members/${userId}`);
    },

    markAsRead: async (roomId) => {
        return axiosClient.put(`/chat/${roomId}/read`);
    },

    clearHistory: async (roomId) => {
        return axiosClient.put(`/chat/${roomId}/clear`);
    },

    leaveGroup: async (roomId) => {
        return axiosClient.post(`/chat/${roomId}/leave`);
    }
};

export default ChatService;
