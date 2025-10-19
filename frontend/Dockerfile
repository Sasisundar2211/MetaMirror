# Frontend Dockerfile - Multi-stage build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
ENV CI=false
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build files to nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration (optional - create if needed)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
