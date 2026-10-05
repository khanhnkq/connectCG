import axiosClient from "../config/axiosConfig";
import { createAxiosMockAdapter, setMockLatency } from "./adapter/axiosMockAdapter";
import mockDb from "./db/mockDb";
import mockStompClient from "./websocket/mockStompClient";

let isMockInitialized = false;

/**
 * Initializes the standalone mock service layer.
 * Replaces axiosClient adapter with the custom mock router and sets up mock cookies.
 */
export function initMockService() {
  if (isMockInitialized) return;

  // Setup mock CSRF cookie
  if (typeof document !== "undefined") {
    document.cookie = "XSRF-TOKEN=mock-csrf-token-connectcg-2026; path=/; SameSite=Lax";
  }

  // Hook into Axios client adapter
  const originalAdapter = axiosClient.defaults.adapter;
  axiosClient.defaults.adapter = createAxiosMockAdapter(originalAdapter);

  isMockInitialized = true;

  console.log(
    "%c[MOCK SERVICE] 🚀 Standalone Mock Mode is ACTIVE!\n" +
      "All API calls are intercepted locally with 100% realistic data matching openapi.json.\n" +
      "Logged in as: " +
      mockDb.getCurrentUser().fullName +
      " (" +
      mockDb.getCurrentUser().role +
      ")",
    "background: #ea580c; color: #fff; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 13px;",
  );
}

export { mockDb, mockStompClient, setMockLatency };
export default initMockService;
