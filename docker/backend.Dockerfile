# ─── Stage 1: Builder ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY backend/package*.json ./
COPY backend/tsconfig*.json ./
COPY backend/nest-cli.json ./
RUN npm ci

# Build
COPY backend/src ./src
RUN npm run build && \
    echo "✓ Backend compiled to /app/dist"

# ─── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy compiled output and package manifest
COPY --from=builder /app/dist      ./dist
COPY --from=builder /app/package*.json ./

# Install production-only deps, clean npm cache
RUN npm ci --omit=dev && \
    npm cache clean --force

# Non-root user (security hardening)
RUN addgroup -g 1001 -S nodejs && \
    adduser  -S nestjs -u 1001
USER nestjs

EXPOSE 5000

HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:5000/v1/health || exit 1

CMD ["node", "dist/main.js"]
