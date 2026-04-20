# ─── Stage 1: Builder ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Dependencies first for layer caching
COPY frontend/package*.json ./
RUN npm ci

# Config files
COPY frontend/vite.config.ts      ./
COPY frontend/tailwind.config.js  ./
COPY frontend/postcss.config.js   ./
COPY frontend/tsconfig*.json      ./
COPY frontend/index.html          ./

# Source
COPY frontend/src ./src

# Build (uses VITE_* env vars baked in at build time)
ARG VITE_API_URL=http://localhost:5000/api/v1
ARG VITE_WS_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL

RUN npm run build && \
    echo "✓ Frontend built to /app/dist"

# ─── Stage 2: Production (Nginx) ─────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our SPA-aware config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Non-root nginx (security)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:80/nginx-health || exit 1

CMD ["nginx", "-g", "daemon off;"]
