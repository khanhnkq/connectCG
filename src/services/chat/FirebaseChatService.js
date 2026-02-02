import { db } from "../../config/firebase";
import { ref, push, onChildAdded, serverTimestamp, query, limitToLast, orderByKey, remove } from "firebase/database";

const FirebaseChatService = {
    /**
     * Gửi tin nhắn lên Firebase
     * @param {string} roomKey - firebase_room_key từ MySQL
     * @param {object} message - { senderId, senderName, text, type }
     */
    sendMessage: async (roomKey, message) => {
        const messagesRef = ref(db, `messages/${roomKey}`);
        return push(messagesRef, {
            ...message,
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
        const { query, limitToLast, get, orderByKey } = await import("firebase/database");
        const messagesRef = ref(db, `messages/${roomKey}`);
        const lastMsgQuery = query(messagesRef, orderByKey(), limitToLast(1));
        const snapshot = await get(lastMsgQuery);

        if (snapshot.exists()) {
            const data = snapshot.val();
            const key = Object.keys(data)[0];
            return { id: key, ...data[key] };
        }
        return null;
    }
};

export default FirebaseChatService;
