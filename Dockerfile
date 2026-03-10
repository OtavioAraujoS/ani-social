FROM oven/bun:1 as base
WORKDIR /usr/src/app

FROM base AS install
COPY package.json bun.lockb* ./
RUN bun install

FROM base AS debug
COPY --from=install /usr/src/app/node_modules node_modules
COPY . .
ENV NODE_ENV=development
EXPOSE 3000
CMD ["bun", "run", "--watch", "src/index.ts"]
