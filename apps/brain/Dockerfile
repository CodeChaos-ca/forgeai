# Stage 1: Builder
FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat python3 make g++ && \
    npm install -g bun

WORKDIR /app

# Copy root configurations and workspaces
COPY package.json bun.lockb turbo.json ./
COPY packages ./packages
COPY apps/brain ./apps/brain

# Install specifically with bun for determinism
RUN bun install

# Build the brain app
RUN bun run --filter @forgeai/brain build

# Stage 2: Runner
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy standalone build output (if tsup bundles properly) or necessary node_modules
COPY --from=builder /app/apps/brain/dist ./dist
COPY --from=builder /app/apps/brain/package.json ./

# For safety in monorepos if bundle requires external packages, copy workspace deps
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

EXPOSE 4100

CMD ["node", "dist/index.mjs"]
