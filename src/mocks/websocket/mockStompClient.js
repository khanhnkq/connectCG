/**
 * Mock Stomp Client
 * Simulates @stomp/stompjs Client for standalone frontend mode without backend.
 */
export class MockStompClient {
  constructor() {
    this.connected = false;
    this.subscribers = new Map();
    this.onConnect = null;
    this.onDisconnect = null;
    this.onStompError = null;
  }

  activate() {
    setTimeout(() => {
      this.connected = true;
      console.log("%c[MOCK WEBSOCKET] 🟢 Connected successfully (Simulated)", "color: #10b981; font-weight: bold;");
      if (typeof this.onConnect === "function") {
        this.onConnect();
      }
    }, 50);
  }

  deactivate() {
    this.connected = false;
    console.log("[MOCK WEBSOCKET] Disconnected");
    if (typeof this.onDisconnect === "function") {
      this.onDisconnect();
    }
  }

  subscribe(destination, callback) {
    if (!this.subscribers.has(destination)) {
      this.subscribers.set(destination, new Set());
    }
    this.subscribers.get(destination).add(callback);

    return {
      unsubscribe: () => {
        const subs = this.subscribers.get(destination);
        if (subs) {
          subs.delete(callback);
        }
      },
    };
  }

  publish({ destination, body }) {
    console.log(`[MOCK WEBSOCKET] 📤 Publish to ${destination}:`, body);
    if (destination === "/app/chat/typing") {
      try {
        const data = typeof body === "string" ? JSON.parse(body) : body;
        if (data?.firebaseRoomKey) {
          this.emit(`/topic/chat/${data.firebaseRoomKey}/typing`, data);
          return;
        }
      } catch (e) {
        console.error("[MOCK WEBSOCKET] Failed to forward typing:", e);
      }
    }
    this.emit(destination, body);
  }

  // Helper to simulate incoming messages
  emit(destination, payload) {
    const subs = this.subscribers.get(destination);
    if (subs && subs.size > 0) {
      const msg = {
        body: typeof payload === "string" ? payload : JSON.stringify(payload),
      };
      subs.forEach((cb) => {
        try {
          cb(msg);
        } catch (e) {
          console.error(`[MOCK WEBSOCKET] Error in subscriber for ${destination}:`, e);
        }
      });
    }
  }
}

export const mockStompClient = new MockStompClient();
export default mockStompClient;
