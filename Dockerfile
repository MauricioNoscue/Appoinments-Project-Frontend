# ---------- build stage ----------
FROM node:20 AS build
WORKDIR /app

# Copiamos dependencias y las instalamos
COPY package*.json ./
RUN npm ci

# Copiamos el código fuente y compilamos Angular
COPY . .
RUN npm run build -- --configuration production

# ---------- runtime stage ----------
FROM nginx:1.25

# Copiamos el resultado del build (carpeta dist)
COPY --from=build /app/dist/appoinments-project-frontedn /usr/share/nginx/html

# Configuración personalizada de Nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto estándar de Nginx
EXPOSE 80

# Iniciamos Nginx
CMD ["nginx", "-g", "daemon off;"]
