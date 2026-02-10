import { db } from "../../config/firebase";
import { ref, push, onChildAdded, serverTimestamp, query, limitToLast, orderByKey, remove, get, orderByChild, equalTo } from "firebase/database";

const FirebaseChatService = {
    /**
     * Gửi tin nhắn lên Firebase
     * @param {string} roomKey - firebase_room_key từ MySQL
     * @param {object} message - { senderId, senderName, text, type, imageUrl }
     */
    sendMessage: async (roomKey, message) => {
        const messagesRef = ref(db, `messages/${roomKey}`);
        return push(messagesRef, {
            ...message,
            type: message.type || 'text', // Default to 'text' for backward compatibility
            timestamp: serverTimestamp()
        });
    },

    /**
     * Lắng nghe tin nhắn trong phòng
     * @param {string} roomKey 
     * @param {function} callback 
     * @param {number} limit - Số lượng tin nhắn lấy ban đầu (mặc định 50)
     */
    subscribeToMessages: (roomKey, callback, limit = 50) => {
        const messagesRef = ref(db, `messages/${roomKey}`);

        // Sử dụng limitToLast để lấy lịch sử gần nhất
        const msgQuery = query(messagesRef, orderByKey(), limitToLast(limit));

        return onChildAdded(msgQuery, (snapshot) => {
            const data = snapshot.val();
            callback({
                id: snapshot.key,
                ...data
            });
        });
    },

    /**
     * Xóa toàn bộ tin nhắn trong phòng trên Firebase
     * @param {string} roomKey 
     */
    deleteMessages: async (roomKey) => {
        const messagesRef = ref(db, `messages/${roomKey}`);
        return remove(messagesRef);
    },

    /**
     * Lấy tin nhắn cuối cùng của phòng
     */
    getLastMessage: async (roomKey) => {
        try {
            const messagesRef = ref(db, `messages/${roomKey}`);
            const lastMsgQuery = query(messagesRef, orderByKey(), limitToLast(1));
            const snapshot = await get(lastMsgQuery);

            if (snapshot.exists()) {
                const data = snapshot.val();
                const key = Object.keys(data)[0];
                return { id: key, ...data[key] };
            }
        } catch (error) {
            console.error("Firebase getLastMessage error:", error);
        }
        return null;
    },

    /**
     * Lấy danh sách tin nhắn có hình ảnh (media gallery)
     * @param {string} roomKey - firebase_room_key
     * @param {number} limit - Số lượng hình ảnh lấy (mặc định 20)
     * @returns {Promise<Array>} - Danh sách tin nhắn có hình ảnh
     */
    getMediaMessages: async (roomKey, limit = 20) => {
        try {
            const messagesRef = ref(db, `messages/${roomKey}`);

            // Query 200 tin nhắn gần nhất để lọc ra media
            // Cách này không yêu cầu index 'type' trên Firebase
            const msgQuery = query(messagesRef, orderByKey(), limitToLast(200));

            const snapshot = await get(msgQuery);

            if (snapshot.exists()) {
                const data = snapshot.val();
                const allMessages = Object.keys(data).map(key => ({ id: key, ...data[key] }));

                const mediaMessages = allMessages.filter(msg =>
                    msg.type === 'image' || msg.type === 'video'
                );

                return mediaMessages
                    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
                    .slice(0, limit);
            }
            return [];
        } catch (error) {
            console.error("Firebase getMediaMessages error:", error);
            return [];
        }
    }
};

export default FirebaseChatService;
