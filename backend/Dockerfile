# Production Dockerfile for Express.js Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for better Docker layer caching
COPY package*.json ./
RUN npm ci --only=production

# Copy application source code
COPY . .

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Start production server
CMD ["node", "src/server.js"]
