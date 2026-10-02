const REFRESH_CHANNEL = "auth-refresh";
const LOCK_KEY = "auth-refresh-lock";
const RESULT_KEY = "auth-refresh-result";
const LOCK_TTL_MS = 10000; // 10s auto-expire to prevent deadlock
const REFRESH_TIMEOUT_MS = 12000; // 12s wait for other tab

const tabId =
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `tab-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

let channel = null;
try {
  if (typeof BroadcastChannel !== "undefined") {
    channel = new BroadcastChannel(REFRESH_CHANNEL);
  }
} catch {
  // BroadcastChannel unavailable or restricted
}

let inFlightRefreshPromise = null;

const acquireLock = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return true;
  }

  const now = Date.now();
  let currentLock = null;
  try {
    currentLock = JSON.parse(localStorage.getItem(LOCK_KEY) || "null");
  } catch {
    currentLock = null;
  }

  if (currentLock && currentLock.tab !== tabId && now - currentLock.ts < LOCK_TTL_MS) {
    return false;
  }

  try {
    localStorage.setItem(LOCK_KEY, JSON.stringify({ ts: now, tab: tabId }));
    const verifyLock = JSON.parse(localStorage.getItem(LOCK_KEY) || "null");
    return verifyLock?.tab === tabId;
  } catch {
    return true; // Fallback if localStorage quota or disabled
  }
};

const releaseLock = () => {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    const currentLock = JSON.parse(localStorage.getItem(LOCK_KEY) || "null");
    if (currentLock?.tab === tabId) {
      localStorage.removeItem(LOCK_KEY);
    }
  } catch {
    // Ignore errors on release
  }
};

const waitForRefreshResult = () =>
  new Promise((resolve, reject) => {
    let settled = false;

    // Check if a successful refresh completed within the last 3 seconds
    try {
      const recent = JSON.parse(localStorage.getItem(RESULT_KEY) || "null");
      if (recent && Date.now() - recent.ts < 3000) {
        if (recent.success) {
          resolve(true);
          return;
        }
      }
    } catch {
      // Ignore
    }

    const timer = setTimeout(() => {
      cleanup();
      if (!settled) {
        settled = true;
        reject(new Error("Refresh timeout waiting for other tab"));
      }
    }, REFRESH_TIMEOUT_MS);

    const onMessage = (event) => {
      if (settled) return;
      cleanup();
      settled = true;
      if (event.data?.success) {
        resolve(true);
      } else {
        const err = new Error("Refresh failed in another tab");
        if (event.data?.status) {
          err.response = { status: event.data.status };
        }
        reject(err);
      }
    };

    let pollInterval = null;
    const cleanup = () => {
      clearTimeout(timer);
      if (pollInterval) clearInterval(pollInterval);
      if (channel) {
        try {
          channel.removeEventListener("message", onMessage);
        } catch {
          // Ignore
        }
      }
    };

    if (channel) {
      try {
        channel.addEventListener("message", onMessage);
      } catch {
        // Fallback to polling
      }
    }

    // Polling fallback (and supplementary check for missed messages)
    const startTime = Date.now();
    pollInterval = setInterval(() => {
      if (settled) return;
      try {
        const result = JSON.parse(localStorage.getItem(RESULT_KEY) || "null");
        if (result && result.ts >= startTime) {
          cleanup();
          settled = true;
          if (result.success) {
            resolve(true);
          } else {
            const err = new Error("Refresh failed in another tab");
            if (result.status) {
              err.response = { status: result.status };
            }
            reject(err);
          }
        }
      } catch {
        // Ignore
      }
    }, 200);
  });

export const refreshWithLock = async (axiosClient) => {
  // If this tab already has an in-flight refresh, reuse it
  if (inFlightRefreshPromise) {
    return inFlightRefreshPromise;
  }

  const runRefresh = async () => {
    // Check if another tab refreshed very recently (< 3 seconds ago)
    try {
      const recent = JSON.parse(localStorage.getItem(RESULT_KEY) || "null");
      if (recent && Date.now() - recent.ts < 3000 && recent.success) {
        return true;
      }
    } catch {
      // Ignore
    }

    if (acquireLock()) {
      try {
        await axiosClient.post("/auth/refresh", null, {
          skipAuthRefresh: true,
        });

        const result = { success: true, ts: Date.now() };
        try {
          localStorage.setItem(RESULT_KEY, JSON.stringify(result));
          channel?.postMessage(result);
        } catch {
          // Ignore storage/message errors
        }
        return true;
      } catch (err) {
        const result = {
          success: false,
          status: err.response?.status,
          ts: Date.now(),
        };
        try {
          localStorage.setItem(RESULT_KEY, JSON.stringify(result));
          channel?.postMessage(result);
        } catch {
          // Ignore
        }
        throw err;
      } finally {
        releaseLock();
      }
    } else {
      // Another tab holds the lock → wait for its result
      return waitForRefreshResult();
    }
  };

  inFlightRefreshPromise = runRefresh().finally(() => {
    inFlightRefreshPromise = null;
  });

  return inFlightRefreshPromise;
};
