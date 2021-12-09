FROM node:16-alpine AS builder

RUN apk add --no-cache python3 g++ make curl && \
  curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /usr/src/api

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm build

FROM node:16-alpine AS deps
WORKDIR /usr/src/api

RUN apk add --no-cache python3 g++ make curl && \
  curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY --from=builder /usr/src/api/package.json /usr/src/api/pnpm-lock.yaml /usr/src/api/dist ./
RUN pnpm install --only=production

FROM gcr.io/distroless/nodejs:16 AS production
WORKDIR /usr/src/api
COPY --from=deps /usr/src/api ./
CMD ["main.js"]
