import { createContext, useContext, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useDispatch } from "react-redux";
import {
  addNotification,
  setGroupDeletionAlert,
  setGroupBanAlert,
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
        if (!url) return new SockJS("/ws"); // Fallback to relative if env is missing

        url = url.trim();
        if (url.endsWith("/")) {
          url = url.slice(0, -1);
        }

        // Force HTTP for localhost to avoid SSL errors
        if (url.includes("localhost") && url.startsWith("https:")) {
          url = url.replace("https:", "http:");
        }

        // Standard SockJS with token
        const finalUrl = url.includes("?")
            ? `${url}&access_token=${token}`
            : `${url}?access_token=${token}`;

        return new SockJS(finalUrl);
      },
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        console.log("STOMP:", str);
      },
      reconnectDelay: 1000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log("✅ Kết nối WebSocket thành công");

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
          // TungNotificationDTO structure: { type, content, actorName, ... }

          // Group Management Notifications
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
          } else if (payload.type === "GROUP_BANNED") {
            dispatch(addNotification(payload));
            toast.error(payload.content || "Bạn đã bị cấm khỏi nhóm.", {
              icon: "🚫",
              duration: 5000,
            });
          } else if (payload.type === "GROUP_UNBAN") {
            dispatch(addNotification(payload));
            toast.success(payload.content || "Bạn đã được gỡ lệnh cấm.", {
              icon: "✅",
              duration: 5000,
            });
          } else if (payload.type === "GROUP_JOIN_APPROVED") {
            dispatch(addNotification(payload));
            toast.success(
                payload.content || "Yêu cầu vào nhóm đã được duyệt!",
                { icon: "🎉", duration: 5000 },
            );
          } else if (payload.type === "GROUP_JOIN_REJECTED") {
            dispatch(addNotification(payload));
            toast.error(payload.content || "Yêu cầu vào nhóm bị từ chối.", {
              icon: "❌",
              duration: 5000,
            });
          } else if (payload.type === "GROUP_INVITE_ACCEPTED") {
            dispatch(addNotification(payload));
            toast.success(payload.content, { icon: "🤝", duration: 5000 });
          } else if (payload.type === "GROUP_MEMBER_JOINED") {
            dispatch(addNotification(payload));
            toast(payload.content, { icon: "👋", duration: 4000 });
          } else if (payload.type === "GROUP_MEMBER_LEFT") {
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
            toast(payload.content, {
              icon: "👥",
              duration: 5000,
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
          }
          // Post Notifications
          else if (payload.type === "POST_APPROVED") {
            dispatch(addNotification(payload));
            toast.success(payload.content || "Bài viết đã được phê duyệt!", {
              icon: "✅",
              duration: 5000,
            });
          } else if (payload.type === "POST_REJECTED") {
            dispatch(addNotification(payload));
            toast.error(payload.content || "Bài viết bị từ chối.", {
              icon: "❌",
              duration: 5000,
            });
          } else if (payload.type === "POST_PENDING") {
            dispatch(addNotification(payload));
            toast(payload.content || "Bài viết đang chờ duyệt.", {
              icon: "⏳",
              duration: 5000,
            });
          } else if (payload.type === "POST_COMMENT") {
            dispatch(addNotification(payload));
            toast(payload.content, { icon: "💬", duration: 4000 });
          } else if (payload.type === "COMMENT_REPLY") {
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
            toast.success(payload.content || "Đã trở thành bạn bè!", {
              icon: "🎉",
              duration: 5000,
            });
          }
          // Warning & Strike Notifications
          else if (
              payload.type === "WARNING" ||
              payload.type === "AI_STRIKE_WARNING"
          ) {
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
          }
          // General notification fallback
          else {
            dispatch(addNotification(payload));
            toast(payload.content, { icon: "🔔" });
          }
        } catch (e) {
          console.error("Lỗi phân tích thông báo:", e);
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
          // payload = { action, postId, comment, commentId, newCommentCount }
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
            dispatch(
                updateConversation({
                  id: payload.roomId,
                  ...payload.data, // Spread full room data (name, avatar, members) if available
                  lastMessageAt: payload.data?.lastMessageAt,
                  unreadCount: payload.data?.unreadCount,
                }),
            );
          } else if (payload.type === "CHAT_REMOVE") {
            dispatch(removeConversation(payload.roomId));
          }
        } catch (e) {
          console.error("Lỗi phân tích sự kiện chat:", e);
        }
      });

      // User Events Realtime (Strikes, Global status)
      client.subscribe("/topic/users", (message) => {
        try {
          const payload = JSON.parse(message.body);
          // Dispatch custom event for strike updates
          window.dispatchEvent(
              new CustomEvent("userEvent", { detail: payload }),
          );
        } catch (e) {
          console.error("Error parsing user event:", e);
        }
      });

      // Group Membership Realtime Channel
      client.subscribe("/topic/groups/membership", (message) => {
        try {
          const payload = JSON.parse(message.body);
          // payload = { type, groupId, userId, member? }
          window.dispatchEvent(
              new CustomEvent("membershipEvent", { detail: payload }),
          );

          // If current user is the one being banned, show the global modal
          const currentUserId = JSON.parse(
              localStorage.getItem("userData"),
          )?.userId;
          if (payload.action === "BANNED" && payload.userId === currentUserId) {
            dispatch(
                setGroupBanAlert({
                  groupId: payload.groupId,
                  groupName: payload.groupName,
                  action: "BANNED",
                }),
            );
          }
        } catch (e) {
          console.error("Error parsing membership event:", e);
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