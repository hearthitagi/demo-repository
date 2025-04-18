# 构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装所有依赖（包括开发依赖）并清理缓存
RUN npm ci --registry=https://registry.npmmirror.com && \
    npm cache clean --force

# 复制源代码
COPY . .

# 构建前端
RUN npm run build

# 生产阶段
FROM node:18-alpine AS production

# 设置工作目录
WORKDIR /app

# 安装必要的系统依赖
RUN apk add --no-cache git
RUN apk add --no-cache maven

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 只安装生产依赖并清理缓存
RUN npm ci --only=production --registry=https://registry.npmmirror.com && \
    npm cache clean --force

# 从构建阶段复制构建好的文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# 设置环境变量
ENV NODE_ENV=production
ENV DOCKER_HOST=unix:///var/run/docker.sock

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"] 