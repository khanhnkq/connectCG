import { createContext, useContext, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const clientRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
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

            client.subscribe("/user/queue/errors", (message) => {
                const payload = JSON.parse(message.body);

                if (payload.type === "LOCK" || payload.type === "DELETE") {
                    console.warn("🚫 Account disabled:", payload.message);
                    const msg = payload.message || "Tài khoản của bạn đã bị khóa hoặc xóa.";
                    localStorage.clear();
                    localStorage.setItem("loginError", msg); // Save error to show on Login page
                    client.deactivate();
                    navigate("/login");
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
    }, [navigate]);

    return (
        <WebSocketContext.Provider value={clientRef.current}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
