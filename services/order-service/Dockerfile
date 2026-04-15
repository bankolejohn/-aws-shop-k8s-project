FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

FROM node:18-alpine AS runtime

WORKDIR /app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

USER nodejs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

CMD ["node", "src/index.js"]