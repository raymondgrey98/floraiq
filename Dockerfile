# FloraIQ — production container.
# Runs the API and serves the web app from one process.
#
#   docker build -t floraiq .
#   docker run -p 7171:7171 --env-file .env floraiq
#
# Works on any host that takes a container: Render, Fly.io, Railway, Google
# Cloud Run, AWS, or a customer's own servers (needed for enterprise deals).

FROM node:20-slim AS build
WORKDIR /app

RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches ./patches
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ── Runtime image: only what's needed to serve ──────────────────────────────
FROM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches ./patches
RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/dist ./dist

# Don't run as root
RUN useradd --create-home --shell /bin/bash floraiq && chown -R floraiq:floraiq /app
USER floraiq

EXPOSE 7171
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD node -e "fetch('http://localhost:7171/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["pnpm", "start"]
