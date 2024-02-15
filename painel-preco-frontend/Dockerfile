FROM --platform=linux/amd64 node:18.18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build --debug

FROM --platform=linux/amd64 node:18.18-alpine AS runtime
WORKDIR /app
COPY package*.json ./
RUN npm ci
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir -p /appserverlogs
RUN chown nextjs:nodejs /appserverlogs
COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.js ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/.env.production ./.env.production
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["npm", "run", "start"]
#CMD node .next/standalone/server.js