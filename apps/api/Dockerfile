FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
COPY apps/api/prisma apps/api/prisma
RUN npm install --workspace @rustine/api --include-workspace-root=false
COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN npm run build -w @rustine/api

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/prisma ./prisma
COPY levels ./levels
ENV NODE_ENV=production
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
