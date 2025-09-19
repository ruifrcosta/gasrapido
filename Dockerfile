# Multi-stage Dockerfile for GasRápido

# Build stage for web application
FROM node:18-alpine AS web-builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/shared/package*.json ./packages/shared/
COPY packages/ui/package*.json ./packages/ui/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build web application
RUN npm run build --workspace=@gasrapido/web

# Build stage for mobile application
FROM node:18-alpine AS mobile-builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/mobile/package*.json ./apps/mobile/
COPY packages/shared/package*.json ./packages/shared/
COPY packages/ui/package*.json ./packages/ui/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build mobile application
RUN npm run build --workspace=@gasrapido/mobile

# Production stage for web application
FROM node:18-alpine AS web-production

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/shared/package*.json ./packages/shared/
COPY packages/ui/package*.json ./packages/ui/

RUN npm ci --only=production

# Copy built files from web builder
COPY --from=web-builder /app/apps/web/.next ./apps/web/.next
COPY --from=web-builder /app/packages/shared ./packages/shared
COPY --from=web-builder /app/packages/ui ./packages/ui

# Expose port
EXPOSE 3000

# Start the web application
CMD ["npm", "run", "start", "--workspace=@gasrapido/web"]

# Production stage for mobile application
FROM node:18-alpine AS mobile-production

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
COPY apps/mobile/package*.json ./apps/mobile/
COPY packages/shared/package*.json ./packages/shared/
COPY packages/ui/package*.json ./packages/ui/

RUN npm ci --only=production

# Copy built files from mobile builder
COPY --from=mobile-builder /app/apps/mobile/dist ./apps/mobile/dist
COPY --from=mobile-builder /app/packages/shared ./packages/shared
COPY --from=mobile-builder /app/packages/ui ./packages/ui

# Expose port
EXPOSE 19006

# Start the mobile application
CMD ["npm", "run", "start", "--workspace=@gasrapido/mobile"]