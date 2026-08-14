FROM node:22-alpine AS base

# --- Dependencies stage ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Build stage ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js needs NEXT_PUBLIC_* vars at build time — values come from docker-compose build.args
ARG TABULAR_API_URL=

RUN npm run build

# --- Production stage ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# UID/GID configurable so files written to bind-mounted volumes (e.g. /logs)
# are readable on the host — defaults match the host `dadosgov` group (10001)
ARG NEXTJS_UID=10001
ARG NEXTJS_GID=10001
RUN addgroup --system --gid ${NEXTJS_GID} nodejs && \
    adduser --system --uid ${NEXTJS_UID} --ingroup nodejs nextjs

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN mkdir -p /app/.next/cache/images && \
    chown -R nextjs:nodejs /app/.next

USER nextjs

EXPOSE 3030

ENV PORT=3030
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
