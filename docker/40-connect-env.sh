#!/bin/sh
set -eu

escape_js() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

api_url="$(escape_js "${VITE_API_BASE_URL:-/api}")"
ws_url="$(escape_js "${VITE_WS_URL:-/ws}")"
google_url="$(escape_js "${VITE_OAUTH2_GOOGLE_URL:-/oauth2/authorization/google}")"
facebook_url="$(escape_js "${VITE_OAUTH2_FACEBOOK_URL:-/oauth2/authorization/facebook}")"
output_file="${ENV_CONFIG_PATH:-/usr/share/nginx/html/env-config.js}"

cat > "$output_file" <<EOF
window.__CONNECT_CONFIG__ = {
  VITE_API_BASE_URL: "$api_url",
  VITE_WS_URL: "$ws_url",
  VITE_OAUTH2_GOOGLE_URL: "$google_url",
  VITE_OAUTH2_FACEBOOK_URL: "$facebook_url"
};
EOF
