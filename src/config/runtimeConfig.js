const runtimeConfig =
  typeof window !== "undefined" ? window.__CONNECT_CONFIG__ || {} : {};

const apiBaseUrl = (
  runtimeConfig.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "/api/v1"
).replace(/\/$/, "");

const backendOrigin = apiBaseUrl.replace(/\/api\/v1$/, "").replace(/\/api$/, "");

export const appConfig = Object.freeze({
  apiBaseUrl,
  wsUrl:
    runtimeConfig.VITE_WS_URL ||
    import.meta.env.VITE_WS_URL ||
    `${backendOrigin}/ws`,
  oauthGoogleUrl:
    runtimeConfig.VITE_OAUTH2_GOOGLE_URL ||
    import.meta.env.VITE_OAUTH2_GOOGLE_URL ||
    `${backendOrigin}/oauth2/authorization/google`,
  oauthFacebookUrl:
    runtimeConfig.VITE_OAUTH2_FACEBOOK_URL ||
    import.meta.env.VITE_OAUTH2_FACEBOOK_URL ||
    `${backendOrigin}/oauth2/authorization/facebook`,
});
