FROM node:16-alpine AS dev

RUN apk add --no-cache python3 g++ make curl && \
  curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /usr/src/api

COPY .npmrc package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpx prisma generate
RUN pnpm build

FROM node:16-alpine AS deps
WORKDIR /usr/src/api

RUN apk add --no-cache python3 g++ make curl && \
  curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY --from=dev /usr/src/api/package.json /usr/src/api/pnpm-lock.yaml /usr/src/api/dist ./
COPY --from=dev /usr/src/api/prisma /usr/src/api/node_modules/@prisma ./
RUN pnpm install --only=production

FROM gcr.io/distroless/nodejs:16 AS production
WORKDIR /usr/src/api
COPY --from=deps /usr/src/api ./
CMD ["main.js"]
# production build stage currently broken -- should also switch to alpine w distro
