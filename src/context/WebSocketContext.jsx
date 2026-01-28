import { createContext, useContext, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from 'react-redux';
import { addNotification } from '../redux/slices/notificationSlice';

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
                // Fix Mixed Content: Automatically switch to https (wss) if running on https
                if (window.location.protocol === 'https:' && url.startsWith('http:')) {
                    url = url.replace('http:', 'https:');
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
                        dispatch(addNotification(payload)); // Add to Redux Store

                        toast.error(payload.content || "Nhóm của bạn đã bị xóa do vi phạm.", {
                            duration: 6000,
                            className: 'border border-red-500', // Use Tailwind utility instead if configured
                        });
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
