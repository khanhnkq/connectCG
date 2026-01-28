import { db } from "../../config/firebase";
import { ref, push, onChildAdded, serverTimestamp } from "firebase/database";

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
     * Lắng nghe tin nhắn mới trong phòng
     * @param {string} roomKey 
     * @param {function} callback 
     */
    subscribeToMessages: (roomKey, callback) => {
        const messagesRef = ref(db, `messages/${roomKey}`);
        return onChildAdded(messagesRef, (snapshot) => {
            const data = snapshot.val();
            callback({
                id: snapshot.key,
                ...data
            });
        });
    }
};

export default FirebaseChatService;
