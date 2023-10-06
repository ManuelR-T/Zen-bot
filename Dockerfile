FROM oven/bun:latest as builder

WORKDIR /app

COPY package.json bun.lockb ./
COPY src ./src
COPY config/tsconfig.json ./config/

RUN bun install
RUN bun run build

FROM oven/bun:latest

WORKDIR /app
COPY --from=builder /app .
COPY data /app/data
RUN bun install --production

CMD bun run start