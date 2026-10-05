import { allMockHandlers } from "../handlers";

// Helper to convert route pattern like "/posts/:id/react" to regex
function compileRoute(pattern) {
  const paramNames = [];
  const regexStr = pattern
    .replace(/:([a-zA-Z0-9_]+)/g, (_, paramName) => {
      paramNames.push(paramName);
      return "([^/]+)";
    })
    .replace(/\*\*/g, ".*");

  const regex = new RegExp(`^${regexStr}$`);
  return { regex, paramNames };
}

// Pre-compiled handlers sorted so static routes take precedence over parameterized routes
const compiledHandlers = allMockHandlers
  .map((h) => ({
    ...h,
    ...compileRoute(h.pattern),
  }))
  .sort((a, b) => {
    // 1. Literal routes (fewer params) take precedence
    const aParams = a.paramNames.length;
    const bParams = b.paramNames.length;
    if (aParams !== bParams) {
      return aParams - bParams;
    }
    // 2. Longer patterns (more specific) come first
    return b.pattern.length - a.pattern.length;
  });

export let mockLatency = 120; // Default simulated latency in ms

export function setMockLatency(ms) {
  mockLatency = Math.max(0, ms);
}

/**
 * Creates an Axios adapter that intercepts requests and routes them to mock handlers.
 */
export function createAxiosMockAdapter(originalAdapter) {
  return async function mockAdapter(config) {
    let rawUrl = config.url || "";
    // If url is absolute, extract pathname and search
    let pathname = rawUrl;
    let queryString = "";

    try {
      if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
        const parsed = new URL(rawUrl);
        pathname = parsed.pathname;
        queryString = parsed.search;
      } else {
        const [path, qs] = rawUrl.split("?");
        pathname = path;
        queryString = qs ? `?${qs}` : "";
      }
    } catch {
      // fallback
    }

    // Strip `/api/v1` prefix if present
    const normalizedPath = pathname.replace(/^\/api\/v1/, "") || "/";
    const method = (config.method || "GET").toUpperCase();

    // Parse query params
    const queryParams = {};
    if (queryString) {
      const searchParams = new URLSearchParams(queryString);
      searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });
    }

    // Also include config.params if provided by axios
    if (config.params && typeof config.params === "object") {
      Object.assign(queryParams, config.params);
    }

    // Find matching handler
    let matchedHandler = null;
    let matchedParams = {};

    for (const handler of compiledHandlers) {
      if (handler.method === method) {
        const match = normalizedPath.match(handler.regex);
        if (match) {
          matchedHandler = handler;
          handler.paramNames.forEach((name, index) => {
            matchedParams[name] = match[index + 1];
          });
          break;
        }
      }
    }

    // Simulate latency
    if (mockLatency > 0) {
      await new Promise((res) => setTimeout(res, mockLatency));
    }

    if (matchedHandler) {
      try {
        const result = await matchedHandler.handler({
          params: matchedParams,
          query: queryParams,
          data: config.data,
          headers: config.headers,
          config,
        });

        const status = result.status || 200;
        console.log(
          `%c[MOCK API] ${status >= 400 ? "🔴" : "🟢"} ${method} ${normalizedPath} (${status})`,
          "color: #ea580c; font-weight: bold;",
          result.data,
        );

        return {
          data: result.data,
          status,
          statusText: status === 201 ? "Created" : status >= 400 ? "Error" : "OK",
          headers: { "content-type": "application/json" },
          config,
          request: {},
        };
      } catch (error) {
        console.error(`[MOCK API] Error handling ${method} ${normalizedPath}:`, error);
        return {
          data: { message: error.message || "Internal Mock Error" },
          status: 500,
          statusText: "Internal Error",
          headers: {},
          config,
          request: {},
        };
      }
    }

    // If not matched, try original adapter if available or return 404
    console.warn(`[MOCK API] ⚠️ No mock handler for: ${method} ${normalizedPath} (${rawUrl})`);
    if (originalAdapter) {
      return originalAdapter(config);
    }

    return {
      data: { message: `No mock handler registered for ${method} ${normalizedPath}` },
      status: 404,
      statusText: "Not Found",
      headers: {},
      config,
      request: {},
    };
  };
}
