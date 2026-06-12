FROM node:22-alpine AS base-image
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base-image AS builder
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S nestjs && adduser -S nestjs -G nestjs
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder --chown=nestjs:nestjs /app/dist ./dist
USER nestjs
EXPOSE 4000
CMD ["node", "dist/main"]
