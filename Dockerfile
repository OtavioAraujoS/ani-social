FROM oven/bun:1 as base
WORKDIR /usr/src/app

FROM base AS install
COPY package.json bun.lockb* bun.lock* ./
RUN bun install --frozen-lockfile

FROM base AS prerelease
COPY --from=install /usr/src/app/node_modules node_modules
COPY . .

FROM base AS debug
COPY --from=prerelease /usr/src/app .
ENV NODE_ENV=development
EXPOSE 3000
CMD ["bun", "run", "--watch", "src/index.ts"]

FROM base AS release
COPY --from=prerelease /usr/src/app .
ENV NODE_ENV=production
USER bun
EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]
