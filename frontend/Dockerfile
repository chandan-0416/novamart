# Multi-Stage Production Dockerfile for Vite React SPA

# Step 1: Build Phase
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build Vite static bundle to /app/dist
RUN npm run build

# Step 2: Production Nginx Serving Phase
FROM nginx:alpine

# Copy custom Nginx configuration with SPA try_files
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
