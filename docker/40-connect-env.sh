#!/bin/sh
set -eu

escape_js() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

api_url="$(escape_js "${VITE_API_BASE_URL:-/api}")"
ws_url="$(escape_js "${VITE_WS_URL:-/ws}")"
google_url="$(escape_js "${VITE_OAUTH2_GOOGLE_URL:-/oauth2/authorization/google}")"
facebook_url="$(escape_js "${VITE_OAUTH2_FACEBOOK_URL:-/oauth2/authorization/facebook}")"

fb_api_key="$(escape_js "${VITE_FIREBASE_API_KEY:-}")"
fb_auth_domain="$(escape_js "${VITE_FIREBASE_AUTH_DOMAIN:-}")"
fb_database_url="$(escape_js "${VITE_FIREBASE_DATABASE_URL:-}")"
fb_project_id="$(escape_js "${VITE_FIREBASE_PROJECT_ID:-}")"
fb_storage_bucket="$(escape_js "${VITE_FIREBASE_STORAGE_BUCKET:-}")"
fb_messaging_sender_id="$(escape_js "${VITE_FIREBASE_MESSAGING_SENDER_ID:-}")"
fb_app_id="$(escape_js "${VITE_FIREBASE_APP_ID:-}")"
fb_measurement_id="$(escape_js "${VITE_FIREBASE_MEASUREMENT_ID:-}")"
output_file="${ENV_CONFIG_PATH:-/usr/share/nginx/html/env-config.js}"

cat > "$output_file" <<EOF
window.__CONNECT_CONFIG__ = {
  VITE_API_BASE_URL: "$api_url",
  VITE_WS_URL: "$ws_url",
  VITE_OAUTH2_GOOGLE_URL: "$google_url",
  VITE_OAUTH2_FACEBOOK_URL: "$facebook_url",
  VITE_FIREBASE_API_KEY: "$fb_api_key",
  VITE_FIREBASE_AUTH_DOMAIN: "$fb_auth_domain",
  VITE_FIREBASE_DATABASE_URL: "$fb_database_url",
  VITE_FIREBASE_PROJECT_ID: "$fb_project_id",
  VITE_FIREBASE_STORAGE_BUCKET: "$fb_storage_bucket",
  VITE_FIREBASE_MESSAGING_SENDER_ID: "$fb_messaging_sender_id",
  VITE_FIREBASE_APP_ID: "$fb_app_id",
  VITE_FIREBASE_MEASUREMENT_ID: "$fb_measurement_id"
};
EOF
