# Le runner pilote le démon Docker de l'hôte pour créer les bacs à sable.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
COPY packages/shared/package.json packages/shared/
COPY apps/runner/package.json apps/runner/
RUN npm install --workspace @rustine/runner --include-workspace-root=false
COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY apps/runner apps/runner
RUN npm run build -w @rustine/runner

FROM node:22-alpine
RUN apk add --no-cache docker-cli
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/runner/dist ./dist
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
