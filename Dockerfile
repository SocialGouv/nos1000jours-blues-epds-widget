## Enable BuildKit features (bind/cache mounts)
# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS base

WORKDIR /app

# Run as uid 1000 (matches the `node` user in the official Node images).
# We keep HOME explicitly set so pnpm store/cache paths remain stable.
ENV HOME=/home/node

# Ensure uid 1000 can write to the workdir (and its HOME).
RUN mkdir -p /app && \
    chown -R 1000:1000 /app && \
    chown -R 1000:1000 /home/node

USER 1000

FROM base AS build

# Avoid pnpm interactive prompts in non-TTY environments (Docker builds, CI).
ENV CI=true

# Install pnpm via Corepack based on the version declared in package.json.
# Do NOT hardcode a pnpm version here.
RUN --mount=type=bind,source=package.json,target=/app/package.json,ro \
    corepack install

# Warm the pnpm store from the lockfile only.
# IMPORTANT: do not COPY package.json in this layer (package.json changes should
# not invalidate the fetched store layer).
RUN --mount=type=bind,source=pnpm-lock.yaml,target=/app/pnpm-lock.yaml,ro \
    --mount=type=cache,id=pnpm-store,target=/home/node/.local/share/pnpm/store \
    corepack pnpm fetch

# Install dependencies from the warmed store (offline, locked).
RUN --mount=type=bind,source=package.json,target=/app/package.json,ro \
    --mount=type=bind,source=pnpm-lock.yaml,target=/app/pnpm-lock.yaml,ro \
    --mount=type=bind,source=pnpm-workspace.yaml,target=/app/pnpm-workspace.yaml,ro \
    --mount=type=cache,id=pnpm-store,target=/home/node/.local/share/pnpm/store \
    corepack pnpm install --offline --frozen-lockfile

# Now copy the full sources (this layer will be invalidated on source changes,
# which is expected and separate from the dependency warmup layers above).
COPY --chown=1000:1000 . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ARG NEXT_PUBLIC_MATOMO_SITE_ID
ENV NEXT_PUBLIC_MATOMO_SITE_ID=$NEXT_PUBLIC_MATOMO_SITE_ID

ARG NEXT_PUBLIC_MATOMO_URL
ENV NEXT_PUBLIC_MATOMO_URL=$NEXT_PUBLIC_MATOMO_URL

ARG NEXT_PUBLIC_MATOMO_ENABLED
ENV NEXT_PUBLIC_MATOMO_ENABLED=$NEXT_PUBLIC_MATOMO_ENABLED

ARG NEXT_PUBLIC_TEST_NUMBER_ENABLED
ENV NEXT_PUBLIC_TEST_NUMBER_ENABLED=$NEXT_PUBLIC_TEST_NUMBER_ENABLED

ARG NEXT_PUBLIC_PASTEK_CHAT_ID
ENV NEXT_PUBLIC_PASTEK_CHAT_ID=$NEXT_PUBLIC_PASTEK_CHAT_ID

ARG NEXT_PUBLIC_LANDING_PAGE_BLUES_RESOURCES
ENV NEXT_PUBLIC_LANDING_PAGE_BLUES_RESOURCES=$NEXT_PUBLIC_LANDING_PAGE_BLUES_RESOURCES

ARG NEXT_PUBLIC_CALENDLY_LINK
ENV NEXT_PUBLIC_CALENDLY_LINK=$NEXT_PUBLIC_CALENDLY_LINK

RUN corepack pnpm build

# Reduce runtime size by pruning devDependencies.
RUN corepack pnpm prune --prod

FROM base AS server
COPY --from=build /app /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_TELEMETRY_DEBUG=0

CMD ["corepack", "pnpm", "start"]
