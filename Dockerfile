FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN pnpm install

FROM base AS production-dependencies-env
COPY ./package.json pnpm-lock.yaml /app/
WORKDIR /app
RUN pnpm install --prod

FROM base AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN pnpm run build

FROM base
COPY ./package.json pnpm-lock.yaml /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
# 確保資料目錄存在
RUN mkdir -p /data
# 如果有初始資料庫，複製到持久化卷目錄
COPY ./app/db/sqlite.db /data/sqlite.db.init
# 設置啟動腳本
COPY <<EOF /app/start.sh
#!/bin/sh
# 如果持久化卷中沒有資料庫文件，則複製初始資料庫
if [ ! -f /data/sqlite.db ]; then
  echo "Initializing database..."
  cp /data/sqlite.db.init /data/sqlite.db
fi
# 啟動應用
exec pnpm run start
EOF
RUN chmod +x /app/start.sh
# 設置環境變數
ENV PORT=8080
ENV DATABASE_URL=file:/data/sqlite.db
# 啟動應用
CMD ["/app/start.sh"]