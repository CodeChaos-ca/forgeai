FROM oven/bun:1 AS base

WORKDIR /app

# Copy root workspace config
COPY package.json bun.lockb ./
COPY turbo.json ./

# Copy packages
COPY packages ./packages

# Copy realtime app
COPY apps/realtime ./apps/realtime

# Install dependencies
RUN bun install

# Set working directory to realtime
WORKDIR /app/apps/realtime

# Build
RUN bun run build

# Production stage
FROM oven/bun:1-alpine
WORKDIR /app

COPY --from=base /app/apps/realtime/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages ./packages

ENV NODE_ENV=production
EXPOSE 4200

CMD ["bun", "run", "dist/index.js"]
