FROM node:24-alpine AS deps
WORKDIR /repo
COPY package.json package-lock.json ./
COPY apps/frontend/package.json ./apps/frontend/package.json
RUN npm ci

FROM node:24-alpine AS builder
WORKDIR /repo
COPY --from=deps /repo/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY apps/frontend ./apps/frontend
RUN npm run build --workspace agile-business-frontend

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=8081
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /repo/apps/frontend/.next/standalone/apps/frontend ./
COPY --from=builder --chown=nextjs:nodejs /repo/apps/frontend/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /repo/apps/frontend/public ./public
USER nextjs
EXPOSE 8081
CMD ["node", "server.js"]
