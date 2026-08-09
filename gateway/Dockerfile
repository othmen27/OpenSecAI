# syntax=docker/dockerfile:1
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY gateway/package.json ./gateway/

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile --prod=false

COPY gateway/tsconfig.json ./gateway/
COPY gateway/src ./gateway/src

RUN pnpm --filter @opensecai/gateway build

FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

RUN corepack enable && apk add --no-cache tini

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY gateway/package.json ./gateway/

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile --prod

COPY --from=builder --chown=node:node /app/gateway/dist ./gateway/dist

EXPOSE 3000

USER node

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://localhost:3000/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "gateway/dist/server.js"]