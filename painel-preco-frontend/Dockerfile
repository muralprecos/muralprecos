FROM node:22-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
#RUN npm update && npm install
RUN npm install -g npm@10.4.0
RUN npm ci


FROM base AS builder
WORKDIR /app
ARG NEXT_PUBLIC_APP_ENV=production
ENV NEXT_PUBLIC_APP_ENV=${NEXT_PUBLIC_APP_ENV}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build


FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ARG NEXT_PUBLIC_APP_ENV=production
ENV NEXT_PUBLIC_APP_ENV=${NEXT_PUBLIC_APP_ENV}
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir -p /appserverlogs
RUN chown nextjs:nodejs /appserverlogs
RUN chmod 755 /appserverlogs
RUN mkdir .next
RUN chown nextjs:nodejs .next
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
