#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env.deploy"
COMPOSE_FILE="$SCRIPT_DIR/compose.prod.yml"
STATE_DIR="$SCRIPT_DIR/.deploy"
TEMP_FILE=""

cleanup() {
  [[ -z "$TEMP_FILE" ]] || rm -f "$TEMP_FILE"
}
trap cleanup EXIT

info() { printf '\033[0;32m[OK]\033[0m %s\n' "$1"; }
warn() { printf '\033[0;33m[!]\033[0m %s\n' "$1"; }
fail() { printf '\033[0;31m[ERROR]\033[0m %s\n' "$1" >&2; exit 1; }

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "Thiếu lệnh '$1'."
}

env_get() {
  local key="$1" line
  [[ -f "$ENV_FILE" ]] || return 0
  line="$(grep -E "^${key}=" "$ENV_FILE" | tail -n 1 || true)"
  line="${line#*=}"
  if [[ "$line" == \'*\' ]]; then
    line="${line#\'}"
    line="${line%\'}"
  fi
  printf '%s' "$line"
}

prompt() {
  local label="$1" default_value="${2:-}" answer
  read -r -p "$label${default_value:+ [$default_value]}: " answer
  printf '%s' "${answer:-$default_value}"
}

write_env_line() {
  local file="$1" key="$2" value="$3"
  [[ "$value" != *$'\n'* && "$value" != *"'"* ]] || fail "$key chứa ký tự không được hỗ trợ."
  printf "%s='%s'\n" "$key" "$value" >> "$file"
}

configure_env() {
  local choice target image tag bind_address frontend_port api_url backend_origin
  local ws_url google_url facebook_url health_url vercel_project

  printf '\nNơi deploy frontend:\n  1) VPS Docker (cùng hoặc khác VPS backend)\n  2) Vercel\n'
  read -r -p 'Chọn [1]: ' choice
  choice="${choice:-1}"
  [[ "$choice" == "1" || "$choice" == "2" ]] || fail "Lựa chọn không hợp lệ."
  [[ "$choice" == "1" ]] && target="vps" || target="vercel"

  api_url="$(prompt 'Backend API URL' "$(env_get VITE_API_BASE_URL || true)")"
  [[ "$api_url" == http://* || "$api_url" == https://* ]] || fail "API URL phải bắt đầu bằng http:// hoặc https://"
  api_url="${api_url%/}"
  backend_origin="${api_url%/api}"
  ws_url="$(prompt 'WebSocket URL' "${backend_origin}/ws")"
  google_url="$(prompt 'Google OAuth URL' "${backend_origin}/oauth2/authorization/google")"
  facebook_url="$(prompt 'Facebook OAuth URL' "${backend_origin}/oauth2/authorization/facebook")"

  image="$(prompt 'Frontend image' "$(env_get FRONTEND_IMAGE || true)")"; image="${image:-ghcr.io/khanhnkq/connectcg-frontend}"
  tag="$(prompt 'Image tag' "$(env_get FRONTEND_TAG || true)")"; tag="${tag:-latest}"
  bind_address="$(prompt 'Địa chỉ bind nội bộ (dùng reverse proxy)' "$(env_get SERVICE_BIND_ADDRESS || true)")"; bind_address="${bind_address:-127.0.0.1}"
  frontend_port="$(prompt 'Frontend port trên VPS' "$(env_get FRONTEND_PORT || true)")"; frontend_port="${frontend_port:-3000}"
  health_url="$(prompt 'Frontend health-check URL' "http://127.0.0.1:${frontend_port}/healthz")"
  vercel_project="$(prompt 'Vercel project name' "$(env_get VERCEL_PROJECT || true)")"; vercel_project="${vercel_project:-connectcg}"

  TEMP_FILE="$(mktemp "$SCRIPT_DIR/.env.deploy.tmp.XXXXXX")"
  write_env_line "$TEMP_FILE" DEPLOY_TARGET "$target"
  write_env_line "$TEMP_FILE" FRONTEND_IMAGE "$image"
  write_env_line "$TEMP_FILE" FRONTEND_TAG "$tag"
  write_env_line "$TEMP_FILE" SERVICE_BIND_ADDRESS "$bind_address"
  write_env_line "$TEMP_FILE" FRONTEND_PORT "$frontend_port"
  write_env_line "$TEMP_FILE" VITE_API_BASE_URL "$api_url"
  write_env_line "$TEMP_FILE" VITE_WS_URL "$ws_url"
  write_env_line "$TEMP_FILE" VITE_OAUTH2_GOOGLE_URL "$google_url"
  write_env_line "$TEMP_FILE" VITE_OAUTH2_FACEBOOK_URL "$facebook_url"
  write_env_line "$TEMP_FILE" HEALTHCHECK_URL "$health_url"
  write_env_line "$TEMP_FILE" VERCEL_PROJECT "$vercel_project"
  chmod 600 "$TEMP_FILE"
  mv "$TEMP_FILE" "$ENV_FILE"
  TEMP_FILE=""
  info "Đã tạo $ENV_FILE với quyền 600 (target: $target)."
}

ensure_env() {
  [[ -f "$ENV_FILE" ]] || fail "Chưa có .env.deploy. Chạy mục cấu hình trước."
  mkdir -p "$STATE_DIR"
}

current_tag() {
  if [[ -f "$STATE_DIR/current-tag" ]]; then
    tr -d '\n' < "$STATE_DIR/current-tag"
  else
    env_get FRONTEND_TAG
  fi
}

compose() {
  local tag="${FRONTEND_TAG_OVERRIDE:-$(current_tag)}"
  FRONTEND_TAG="${tag:-latest}" docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" "$@"
}

verify_vps() {
  require_command curl
  local url code attempt
  url="$(env_get HEALTHCHECK_URL)"
  for attempt in $(seq 1 15); do
    code="$(curl -sS -o /dev/null -w '%{http_code}' "$url" || true)"
    if [[ "$code" == "200" ]]; then
      info "Health check thành công: $url"
      return 0
    fi
    sleep 2
  done
  compose logs --tail 80 frontend
  return 1
}

deploy_vps() {
  ensure_env
  require_command docker
  docker compose version >/dev/null 2>&1 || fail "Docker Compose plugin chưa sẵn sàng."
  local previous desired
  previous="$(current_tag)"
  if [[ $# -gt 0 ]]; then
    desired="$1"
  else
    desired="$(prompt 'Tag cần deploy' "$previous")"
  fi
  desired="${desired:-latest}"
  FRONTEND_TAG_OVERRIDE="$desired" compose config >/dev/null
  FRONTEND_TAG_OVERRIDE="$desired" compose pull
  FRONTEND_TAG_OVERRIDE="$desired" compose up -d --remove-orphans
  if verify_vps; then
    [[ -n "$previous" && "$previous" != "$desired" ]] && printf '%s\n' "$previous" > "$STATE_DIR/previous-tag"
    printf '%s\n' "$desired" > "$STATE_DIR/current-tag"
    info "Frontend VPS đang chạy tag $desired."
  else
    fail "Deploy không qua health check. Chọn Rollback để quay lại tag trước."
  fi
}

vercel_cli() {
  npx --yes vercel@latest "$@"
}

set_vercel_env() {
  local key="$1" value="$2"
  printf '%s' "$value" | vercel_cli env add "$key" production --force
}

configure_vercel() {
  ensure_env
  require_command node
  require_command npx
  vercel_cli link --yes --project "$(env_get VERCEL_PROJECT)"
  set_vercel_env VITE_API_BASE_URL "$(env_get VITE_API_BASE_URL)"
  set_vercel_env VITE_WS_URL "$(env_get VITE_WS_URL)"
  set_vercel_env VITE_OAUTH2_GOOGLE_URL "$(env_get VITE_OAUTH2_GOOGLE_URL)"
  set_vercel_env VITE_OAUTH2_FACEBOOK_URL "$(env_get VITE_OAUTH2_FACEBOOK_URL)"
  info "Đã đồng bộ biến production lên Vercel. VITE_* được áp dụng ở lần build kế tiếp."
}

deploy_vercel() {
  configure_vercel
  vercel_cli deploy --prod
  info "Vercel production deployment hoàn tất."
}

deploy_selected() {
  ensure_env
  if [[ "$(env_get DEPLOY_TARGET)" == "vercel" ]]; then
    deploy_vercel
  else
    deploy_vps
  fi
}

rollback_vps() {
  ensure_env
  local fallback target
  fallback="$(test -f "$STATE_DIR/previous-tag" && tr -d '\n' < "$STATE_DIR/previous-tag" || true)"
  target="$(prompt 'Tag rollback (nên dùng sha-...)' "$fallback")"
  [[ -n "$target" ]] || fail "Không có tag rollback."
  deploy_vps "$target"
}

menu() {
  while true; do
    printf '\nConnectCG Frontend Deploy\n  1) Tạo/cập nhật environment và chọn VPS/Vercel\n  2) Deploy theo target đã chọn\n  3) Trạng thái VPS\n  4) Logs VPS\n  5) Rollback image VPS\n  6) Chỉ đồng bộ env lên Vercel\n  0) Thoát\n'
    read -r -p 'Chọn: ' choice
    case "$choice" in
      1) configure_env ;;
      2) deploy_selected ;;
      3) ensure_env; require_command docker; compose ps ;;
      4) ensure_env; require_command docker; compose logs --tail 200 -f frontend ;;
      5) rollback_vps ;;
      6) configure_vercel ;;
      0) return 0 ;;
      *) warn "Lựa chọn không hợp lệ." ;;
    esac
  done
}

menu
