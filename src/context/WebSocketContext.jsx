import { createContext, useContext, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useDispatch } from "react-redux";
import {
  addNotification,
  setGroupDeletionAlert,
} from "../redux/slices/notificationSlice";
import {
  setOnlineUsers,
  userCameOnline,
  userWentOffline,
} from "../redux/slices/onlineUsersSlice";

import userService from "../services/UserService";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const clientRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const client = new Client({
      webSocketFactory: () => {
        let url = import.meta.env.VITE_WS_URL;

        // Sử dụng giao thức HTTP cho localhost để tránh các vấn đề về SSL tự ký


        if (url.includes("localhost") && url.startsWith("https:")) {
          url = url.replace("https:", "http:");
        }

        // Đính kèm Token vào URL để phục vụ xác thực tại Handshake Interceptor
        if (token) {
          // Xử lý việc nối query param an toàn
          url += url.includes("?")
            ? `&access_token=${token}`
            : `?access_token=${token}`;
        }
        return new SockJS(url);
      },
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        console.log("STOMP:", str);
      },
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("✅ Kết nối WebSocket thành công");

      // Fetch initial online users
      userService
        .getOnlineUsers()
        .then((res) => {
          dispatch(setOnlineUsers(res.data));
        })
        .catch((err) => console.error("Lỗi khi lấy danh sách người dùng online", err));

      // --- Kênh 1: Trạng thái Online/Offline ---


      client.subscribe("/topic/public/status", (message) => {
        try {
          const payload = JSON.parse(message.body);
          if (payload.status === "ONLINE") {
            dispatch(userCameOnline(payload.userId));
          } else {
            dispatch(userWentOffline(payload.userId));
          }
        } catch (e) {
          console.error("Lỗi phân tích trạng thái:", e);
        }
      });

      // --- Kênh 2: Bảo mật & Quản lý tài khoản (Khóa/Xóa) ---
      client.subscribe("/user/queue/errors", (message) => {
        const payload = JSON.parse(message.body);

        if (payload.type === "LOCK" || payload.type === "DELETE") {
          console.warn("🚫 Tài khoản bị vô hiệu hóa:", payload.message);
          const msg =
            payload.message || "Tài khoản của bạn đã bị khóa hoặc xóa.";
          localStorage.clear();
          localStorage.setItem("loginError", msg);
          client.deactivate();
          navigate("/login");
        }
      });

      // --- Kênh 3: Hệ thống thông báo cá nhân ---
      client.subscribe("/user/queue/notifications", (message) => {
        try {
          const payload = JSON.parse(message.body);

          if (payload.type === "GROUP_DELETED") {
            console.log("🔔 Nhận sự kiện GROUP_DELETED:", payload);
            dispatch(addNotification(payload));


            const currentPath = window.location.pathname;
            if (currentPath.includes(`/groups/${payload.targetId}`)) {
              dispatch(setGroupDeletionAlert(payload));
            }

            toast.error(
              payload.content || "Nhóm của bạn đã bị xóa do vi phạm.",
              { duration: 6000 },
            );
          } else if (payload.type === "WARNING") {
            dispatch(addNotification(payload));
            toast(payload.content, { icon: "⚠️" });
          } else if (payload.type === "REPORT_SUBMITTED") {
            // Dành cho ADMIN: Có báo cáo vi phạm mới


            dispatch(addNotification(payload));
            toast(payload.content, { icon: "🚨", duration: 5000 });
          } else if (payload.type === "REPORT_UPDATED") {
            // Dành cho USER: Báo cáo của họ đã được xử lý


            dispatch(addNotification(payload));
            toast.success(payload.content, { duration: 5000 });
          } else {
            // Thông báo chung

            dispatch(addNotification(payload));
            toast(payload.content, { icon: "🔔" });
          }
        } catch (e) {
          console.error("Lỗi phân tích thông báo:", e);
        }
      });

      // --- Kênh 4: Sự kiện Bài viết (Newsfeed Realtime) ---
      client.subscribe("/topic/posts", (message) => {
        try {
          const payload = JSON.parse(message.body);
          // Dispatch custom event để các component khác lắng nghe
          window.dispatchEvent(
            new CustomEvent("postEvent", { detail: payload }),
          );
        } catch (e) {
          console.error("Lỗi phân tích sự kiện bài viết:", e);
        }
      });

      // --- Kênh 5: Sự kiện Cảm xúc (Reaction) ---
      client.subscribe("/topic/reactions", (message) => {
        try {
          const payload = JSON.parse(message.body);
          // Dispatch custom event để các component khác lắng nghe
          window.dispatchEvent(
            new CustomEvent("reactionEvent", { detail: payload }),
          );
        } catch (e) {
          console.error("Lỗi phân tích sự kiện cảm xúc:", e);
        }
      });

      // --- Kênh 6: Sự kiện Bình luận (Comment) ---
      client.subscribe("/topic/comments", (message) => {
        try {
          const payload = JSON.parse(message.body);
          window.dispatchEvent(
            new CustomEvent("commentEvent", { detail: payload }),
          );
        } catch (e) {
          console.error("Lỗi phân tích sự kiện bình luận:", e);
        }
      });

      // --- Kênh 7: Tín hiệu Chat (Metadata: Unread count, Last message) ---
      client.subscribe("/user/queue/chat", (message) => {
        try {
          const payload = JSON.parse(message.body);
          if (payload.type === "CHAT_UPDATE") {
            dispatch(updateConversation({
              id: payload.roomId,
              lastMessageAt: payload.lastMessageAt,
              unreadCount: payload.unreadCount
            }));
          }
        } catch (e) {
          console.error("Lỗi phân tích sự kiện chat:", e);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error("❌ Lỗi STOMP:", frame.headers["message"]);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [navigate, dispatch]);

  return (
    <WebSocketContext.Provider value={clientRef.current}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
