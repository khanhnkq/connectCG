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
import {
  updateConversation,
  removeConversation,
} from "../redux/slices/chatSlice";

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

        // Force HTTP for localhost to avoid SSL errors
        if (url.includes("localhost") && url.startsWith("https:")) {
          url = url.replace("https:", "http:");
        }

        // Append token to URL for Handshake Interceptor
        if (token) {
          // Check if url already has query params
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
      console.log("✅ WS connected");

      // Fetch initial online users
      // Fetch initial online users
      userService
        .getOnlineUsers()
        .then((res) => {
          dispatch(setOnlineUsers(res.data));
        })
        .catch((err) => console.error("Failed to fetch online users", err));

      // Online Status Channel
      client.subscribe("/topic/public/status", (message) => {
        try {
          const payload = JSON.parse(message.body);
          if (payload.status === "ONLINE") {
            dispatch(userCameOnline(payload.userId));
          } else {
            dispatch(userWentOffline(payload.userId));
          }
        } catch (e) {
          console.error("Error parsing status:", e);
        }
      });

      client.subscribe("/user/queue/errors", (message) => {
        const payload = JSON.parse(message.body);

        if (payload.type === "LOCK" || payload.type === "DELETE") {
          console.warn("🚫 Account disabled:", payload.message);
          const msg =
            payload.message || "Tài khoản của bạn đã bị khóa hoặc xóa.";
          localStorage.clear();
          localStorage.setItem("loginError", msg);
          client.deactivate();
          navigate("/login");
        }
      });

      client.subscribe("/user/queue/notifications", (message) => {
        try {
          const payload = JSON.parse(message.body);
          // TungNotificationDTO structure: { type, content, actorName, ... }

          if (payload.type === "GROUP_DELETED") {
            console.log("🔔 Received GROUP_DELETED event:", payload);
            dispatch(addNotification(payload));

            // Check if user is currently viewing this group
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
            toast(payload.content, { icon: "⚠️", duration: 6000 });
          } else {
            // General notification
            dispatch(addNotification(payload));
            toast(payload.content, { icon: "🔔", duration: 6000 });
          }
        } catch (e) {
          console.error("Error parsing notification:", e);
        }
      });

      client.subscribe("/topic/posts", (message) => {
        try {
          const payload = JSON.parse(message.body);
          // payload = { action: "CREATED" | "UPDATED" | "DELETED", post?, postId? }
          // Dispatch custom event để các component khác lắng nghe
          window.dispatchEvent(
            new CustomEvent("postEvent", { detail: payload }),
          );
        } catch (e) {
          console.error("Error parsing post event:", e);
        }
      });

      client.subscribe("/topic/users", (message) => {
        try {
          const payload = JSON.parse(message.body);
          // payload = { action: "UPDATED", userId, violationCount, lockedUntil, permanentLocked, isLocked }
          window.dispatchEvent(
            new CustomEvent("userEvent", { detail: payload }),
          );
        } catch (e) {
          console.error("Error parsing user event:", e);
        }
      });

      // Reaction Realtime Channel
      client.subscribe("/topic/reactions", (message) => {
        try {
          const payload = JSON.parse(message.body);
          // payload = { action, postId, userId, reactionType, newReactCount }
          window.dispatchEvent(
            new CustomEvent("reactionEvent", { detail: payload }),
          );
        } catch (e) {
          console.error("Error parsing reaction event:", e);
        }
      });

      // Comment Realtime Channel
      client.subscribe("/topic/comments", (message) => {
        try {
          const payload = JSON.parse(message.body);
          // payload = { action, postId, comment, commentId, newCommentCount }
          window.dispatchEvent(
            new CustomEvent("commentEvent", { detail: payload }),
          );
        } catch (e) {
          console.error("Error parsing comment event:", e);
        }
      });

      // Group Membership Realtime Channel
      client.subscribe("/topic/groups/membership", (message) => {
        try {
          const payload = JSON.parse(message.body);
          // payload = { action, groupId, userId, member }
          window.dispatchEvent(
            new CustomEvent("membershipEvent", { detail: payload }),
          );
        } catch (e) {
          console.error("Error parsing membership event:", e);
        }
      });

      // Chat Realtime Channel (System signals like unread counts)
      client.subscribe("/user/queue/chat", (message) => {
        try {
          const payload = JSON.parse(message.body);
          // payload = { type, roomId, firebaseRoomKey, lastMessageAt, unreadCount }
          if (payload.type === "CHAT_UPDATE") {
            dispatch(
              updateConversation({
                id: payload.roomId,
                ...payload.data,
              })
            );
          } else if (payload.type === "CHAT_REMOVE") {
            dispatch(removeConversation(payload.roomId));

            if (payload.reason === "KICKED") {
              toast.error("Bạn đã bị mời ra khỏi phòng chat này.");
            } else if (payload.reason === "DELETED") {
              toast.error("Phòng chat này đã bị giải tán.");
            }
            // For "LEFT", we don't show an extra toast since the user initiated it
          }
        } catch (e) {
          console.error("Error parsing chat event:", e);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error("❌ STOMP error:", frame.headers["message"]);
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
