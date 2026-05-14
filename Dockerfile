# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo dev para Vite build)
RUN npm ci

# Copiar codigo
COPY . .

# Argumentos de build
ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL

# Build con vite.config.web.js
RUN npx vite build --config vite.config.web.js

# Stage 2: Serve con Nginx
FROM nginx:1.27-alpine

# Copiar build de React
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar config de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
