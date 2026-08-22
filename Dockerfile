FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/40-connect-env.sh /docker-entrypoint.d/40-connect-env.sh
COPY --from=builder /app/dist /usr/share/nginx/html
RUN chmod +x /docker-entrypoint.d/40-connect-env.sh

EXPOSE 80
HEALTHCHECK --interval=15s --timeout=3s --retries=5 CMD wget -qO- http://127.0.0.1/healthz >/dev/null || exit 1
