FROM node:latest AS builder

WORKDIR /app

COPY package.json tsconfig.json ./
COPY src ./src
COPY prisma ./prisma

RUN npm install && \
    npx prisma generate && \
    npx tsc && \
    rm -rf package-lock.json prisma

FROM oven/bun:latest

WORKDIR /app
COPY --from=builder /app/ .
COPY data /app/data
COPY bun.lockb ./bun.lockb
RUN bun install --production

CMD bun run start