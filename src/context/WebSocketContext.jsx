import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Client, ReconnectionTimeMode } from "@stomp/stompjs";
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
import { updateConversation, removeConversation } from "../redux/slices/chatSlice";
import { store } from "../redux/store/store";
import userService from "../services/UserService";
import { logout } from "../redux/slices/authSlice";

const WebSocketContext = createContext({ stompClient: null, isConnected: false });

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    console.log("WebSocket: Initializing connection...");

    const client = new Client({
      webSocketFactory: () => {
        let url = import.meta.env.VITE_WS_URL;
        if (!url) return new SockJS("/ws");

        url = url.trim();
        if (url.endsWith("/")) url = url.slice(0, -1);
        if (url.includes("localhost") && url.startsWith("https:")) {
          url = url.replace("https:", "http:");
        }

        return new SockJS(url);
      },
      reconnectDelay: 1000,
      maxReconnectDelay: 30000,
      reconnectTimeMode: ReconnectionTimeMode.EXPONENTIAL,
      connectionTimeout: 10000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    client.onConnect = () => {
      console.log("✅ Kết nối WebSocket thành công");
      setIsConnected(true);

      // --- 1. Online Status ---
      userService.getOnlineUsers().then(res => dispatch(setOnlineUsers(res.data))).catch(console.error);
      client.subscribe("/topic/public/status", (msg) => {
        try {
          const payload = JSON.parse(msg.body);
          if (payload.status === "ONLINE") dispatch(userCameOnline(payload.userId));
          else dispatch(userWentOffline(payload.userId));
        } catch (e) { console.error("Error status:", e); }
      });

      // --- 2. Security Errors ---
      client.subscribe("/user/queue/errors", (msg) => {
        const payload = JSON.parse(msg.body);
        if (payload.type === "LOCK" || payload.type === "DELETE") {
          client.deactivate();
          dispatch(logout());
          navigate("/login");
        }
      });

      // --- 3. Personal Notifications (FULL RESTORED) ---
      client.subscribe("/user/queue/notifications", (message) => {
        try {
          const payload = JSON.parse(message.body);

          // Group Management Notifications
          if (payload.type === "GROUP_DELETED") {
            dispatch(addNotification(payload));
            if (window.location.pathname.includes(`/groups/${payload.targetId}`)) {
              dispatch(setGroupDeletionAlert(payload));
            }
            toast.error(payload.content || "Nhóm đã bị xóa", { duration: 6000 });
          } else if (payload.type === "GROUP_BANNED") {
            dispatch(addNotification(payload));
            toast.error(payload.content || "Bạn đã bị cấm khỏi nhóm.", { icon: "🚫", duration: 5000 });
          } else if (payload.type === "GROUP_UNBAN") {
            dispatch(addNotification(payload));
            toast.success(payload.content || "Bạn đã được gỡ lệnh cấm.", { icon: "✅", duration: 5000 });
          } else if (payload.type === "GROUP_JOIN_APPROVED") {
            dispatch(addNotification(payload));
            toast.success(payload.content || "Yêu cầu vào nhóm đã được duyệt!", { icon: "🎉", duration: 5000 });
          } else if (payload.type === "GROUP_JOIN_REJECTED") {
            dispatch(addNotification(payload));
            toast.error(payload.content || "Yêu cầu vào nhóm bị từ chối.", { icon: "❌", duration: 5000 });
          } else if (payload.type === "GROUP_INVITE_ACCEPTED") {
            dispatch(addNotification(payload));
            toast.success(payload.content, { icon: "🤝", duration: 5000 });
          } else if (payload.type === "GROUP_MEMBER_JOINED" || payload.type === "GROUP_MEMBER_LEFT") {
            dispatch(addNotification(payload));
            toast(payload.content, { icon: "👋", duration: 4000 });
          } else if (payload.type === "GROUP_OWNER_CHANGE") {
            dispatch(addNotification(payload));
            toast.success(payload.content, { icon: "👑", duration: 5000 });
          } else if (payload.type === "GROUP_ROLE_CHANGED") {
            dispatch(addNotification(payload));
            toast(payload.content, { icon: "🔄", duration: 5000 });
          } else if (payload.type === "GROUP_JOIN_REQUEST") {
            dispatch(addNotification(payload));
            toast(payload.content, { icon: "👥", duration: 5000, style: { borderRadius: "10px", background: "#333", color: "#fff" } });
          }
          // Post Notifications
          else if (payload.type === "POST_APPROVED") {
            dispatch(addNotification(payload));
            toast.success(payload.content || "Bài viết đã được phê duyệt!", { icon: "✅", duration: 5000 });
          } else if (payload.type === "POST_REJECTED") {
            dispatch(addNotification(payload));
            toast.error(payload.content || "Bài viết bị từ chối.", { icon: "❌", duration: 5000 });
          } else if (payload.type === "POST_PENDING") {
            dispatch(addNotification(payload));
            toast(payload.content || "Bài viết đang chờ duyệt.", { icon: "⏳", duration: 5000 });
          } else if (payload.type === "POST_COMMENT" || payload.type === "COMMENT_REPLY") {
            dispatch(addNotification(payload));
            toast(payload.content, { icon: "💬", duration: 4000 });
          } else if (payload.type === "POST_REACTION") {
            dispatch(addNotification(payload));
            toast(payload.content, { icon: "❤️", duration: 4000 });
          }
          // Friend Notifications
          else if (payload.type === "FRIEND_REQUEST") {
            dispatch(addNotification(payload));
            toast(payload.content, { icon: "👤", duration: 5000 });
          } else if (payload.type === "FRIEND_ACCEPT") {
            dispatch(addNotification(payload));
            toast.success(payload.content || "Đã trở thành bạn bè!", { icon: "🎉", duration: 5000 });
          }
          // Warning & Strike Notifications
          else if (payload.type === "WARNING" || payload.type === "AI_STRIKE_WARNING") {
            dispatch(addNotification(payload));
            toast(payload.content, { icon: "⚠️", duration: 6000 });
          } else if (payload.type === "AI_STRIKE_BANNED") {
            dispatch(addNotification(payload));
            toast.error(payload.content, { icon: "🚫", duration: 8000 });
          }
          // Report Notifications
          else if (payload.type === "REPORT_SUBMITTED") {
            dispatch(addNotification(payload));
            toast(payload.content, { icon: "🚨", duration: 5000 });
          } else if (payload.type === "REPORT_UPDATED") {
            dispatch(addNotification(payload));
            toast.success(payload.content, { duration: 5000 });
          } else {
            dispatch(addNotification(payload));
            toast(payload.content, { icon: "🔔" });
          }
        } catch (e) { console.error("Error notification:", e); }
      });

      // --- 4. Content Streams ---
      client.subscribe("/topic/posts", msg => window.dispatchEvent(new CustomEvent("postEvent", { detail: JSON.parse(msg.body) })));
      client.subscribe("/topic/users", msg => window.dispatchEvent(new CustomEvent("userEvent", { detail: JSON.parse(msg.body) })));
      client.subscribe("/user/queue/post-moderation", msg => window.dispatchEvent(new CustomEvent("postEvent", { detail: JSON.parse(msg.body) })));

      // --- 5. Chat Metadata & Invitations ---
      client.subscribe("/user/queue/chat", (message) => {
        try {
          const payload = JSON.parse(message.body);
          if (payload.type === "CHAT_UPDATE") {
            const currentConversations = store.getState().chat.conversations;
            const isNew = !currentConversations.some(c => c.id === payload.roomId);

            dispatch(updateConversation({
              id: payload.roomId,
              ...payload.data,
              unreadCount: payload.data?.unreadCount || 1,
            }));

            if (isNew && payload.data?.type === "GROUP") {
              toast.success(`Bạn đã được thêm vào nhóm: ${payload.data.name}`, { icon: "👥" });
            }
          } else if (payload.type === "CHAT_REMOVE") {
            dispatch(removeConversation(payload.roomId));
          }
        } catch (e) { console.error("Error chat sync:", e); }
      });

    };

    client.onDisconnect = () => {
      setIsConnected(false);
    };

    client.onWebSocketClose = () => {
      setIsConnected(false);
    };

    client.onStompError = (frame) => {
      setIsConnected(false);
      console.error("WebSocket broker error:", frame.headers.message);
    };

    client.activate();
    // The active STOMP instance is the state exposed to feature subscriptions.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStompClient(client);

    return () => {
      console.log("WebSocket: Cleaning up connection...");
      client.deactivate();
    };
  }, [isAuthenticated, user?.id, navigate, dispatch]);

  return (
    <WebSocketContext.Provider value={{
      stompClient: isAuthenticated ? stompClient : null,
      isConnected: Boolean(isAuthenticated && isConnected),
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWebSocket = () => useContext(WebSocketContext);
