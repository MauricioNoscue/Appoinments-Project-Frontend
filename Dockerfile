# ---------- Build Stage ----------
FROM node:20 AS build

WORKDIR /app

# Copiamos los archivos base
COPY package*.json ./
RUN npm install -g @angular/cli && npm install

# Copiamos el resto del proyecto
COPY . .

# Variables de entorno inyectadas por Jenkins o docker-compose (.env)
ARG API_BASE_URL
ARG NODE_ENV

# Inyección dinámica en el environment de Angular
RUN echo "export const environment = { production: true, apiBaseUrl: '${API_BASE_URL}' };" > src/environments/environment.prod.ts

# Build del frontend según entorno
RUN npm run build -- --configuration production

# ---------- Runtime Stage ----------
FROM nginx:alpine
COPY --from=build /app/dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
