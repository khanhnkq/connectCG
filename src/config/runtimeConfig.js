const runtimeConfig =
  typeof window !== "undefined" ? window.__CONNECT_CONFIG__ || {} : {};

const readConfig = (key, fallback = "") =>
  runtimeConfig[key] || import.meta.env[key] || fallback;

const apiBaseUrl = readConfig("VITE_API_BASE_URL", "/api").replace(/\/$/, "");
const backendOrigin = apiBaseUrl.replace(/\/api$/, "");

export const appConfig = Object.freeze({
  apiBaseUrl,
  wsUrl: readConfig("VITE_WS_URL", `${backendOrigin}/ws`),
  oauthGoogleUrl: readConfig(
    "VITE_OAUTH2_GOOGLE_URL",
    `${backendOrigin}/oauth2/authorization/google`,
  ),
  oauthFacebookUrl: readConfig(
    "VITE_OAUTH2_FACEBOOK_URL",
    `${backendOrigin}/oauth2/authorization/facebook`,
  ),
});
