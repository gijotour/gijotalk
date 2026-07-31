# GIJO Tour — Cloud Run / 일반 컨테이너 배포용
#
#   docker build -t gijo-tour .
#   docker run -p 8080:8080 -e GEMINI_API_KEY=... -e APP_ACCESS_CODE=... gijo-tour

FROM node:22-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# vite build (dist/) + esbuild 로 서버 번들(dist/server.cjs) 생성
RUN npm run build

# ------------------------------------------------------------------
FROM node:22-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production
# Cloud Run 은 PORT 를 주입합니다. server.ts 가 이 값을 읽습니다.
ENV PORT=8080

COPY package*.json ./
# 서버 번들은 --packages=external 이라 런타임 의존성이 필요합니다.
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

EXPOSE 8080
CMD ["node", "dist/server.cjs"]
