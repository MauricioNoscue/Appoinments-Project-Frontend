# -------- Stage 1: Build Angular --------
FROM node:18-alpine AS builder

ARG CONFIG=production
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration ${CONFIG}

# Normaliza la salida del build a /app/www detectando si hay subcarpeta /browser (Angular 17+)
RUN set -eux; \
  APP_DIR="$(ls -1 dist | head -n 1)"; \
  if [ -z "$APP_DIR" ]; then echo "No se encontró carpeta dentro de dist"; ls -la dist; exit 1; fi; \
  if [ -d "dist/${APP_DIR}/browser" ]; then \
    cp -r "dist/${APP_DIR}/browser" /app/www; \
  else \
    cp -r "dist/${APP_DIR}" /app/www; \
  fi; \
  ls -la /app/www

# -------- Stage 2: Nginx (serve) --------
FROM nginx:1.25-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos SIEMPRE desde /app/www que ya quedó normalizado
COPY --from=builder /app/www /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
