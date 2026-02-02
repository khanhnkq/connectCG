import { createContext, useContext, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from 'react-redux';
import { addNotification, setGroupDeletionAlert } from '../redux/slices/notificationSlice';
import { setOnlineUsers, userCameOnline, userWentOffline } from '../redux/slices/onlineUsersSlice';
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
                if (url.includes('localhost') && url.startsWith('https:')) {
                    url = url.replace('https:', 'http:');
                }

                // Append token to URL for Handshake Interceptor
                if (token) {
                    // Check if url already has query params
                    url += url.includes('?') ? `&access_token=${token}` : `?access_token=${token}`;
                }
                return new SockJS(url);
            },
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            debug: (str) => {
                // console.log("STOMP:", str);
            },
            reconnectDelay: 5000
        });

        client.onConnect = () => {
            console.log("✅ WS connected");

            // Fetch initial online users
            // Fetch initial online users
            userService.getOnlineUsers().then(res => {
                dispatch(setOnlineUsers(res.data));
            }).catch(err => console.error("Failed to fetch online users", err));

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

            // Error Channel (Account Bans/Locks)
            client.subscribe("/user/queue/errors", (message) => {
                const payload = JSON.parse(message.body);

                if (payload.type === "LOCK" || payload.type === "DELETE") {
                    console.warn("🚫 Account disabled:", payload.message);
                    const msg = payload.message || "Tài khoản của bạn đã bị khóa hoặc xóa.";
                    localStorage.clear();
                    localStorage.setItem("loginError", msg);
                    client.deactivate();
                    navigate("/login");
                }
            });

            // Notification Channel
            client.subscribe("/user/queue/notifications", (message) => {
                try {
                    const payload = JSON.parse(message.body);
                    // TungNotificationDTO structure: { type, content, actorName, ... }

                    if (payload.type === "GROUP_DELETED") {
                        console.log("🔔 Received GROUP_DELETED event:", payload);
                        dispatch(addNotification(payload));

                        // Check if user is currently viewing this group
                        const currentPath = window.location.pathname;
                        // Assuming payload.targetId is the groupId
                        if (currentPath.includes(`/groups/${payload.targetId}`)) {
                            dispatch(setGroupDeletionAlert(payload));
                        }
                    } else if (payload.type === "WARNING") {

                        // We can modify the imports at the top instead of dynamic import here?
                        // Let's check imports first.
                    } else if (payload.type === "WARNING") {
                        dispatch(addNotification(payload));
                        toast(payload.content, { icon: '⚠️' });
                    } else {
                        // General notification
                        dispatch(addNotification(payload));
                        toast(payload.content, { icon: '🔔' });
                    }
                } catch (e) {
                    console.error("Error parsing notification:", e);
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
