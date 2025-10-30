# ---------- build stage ----------
FROM node:20 AS build
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar el código y compilar Angular
COPY . .
RUN npm run build -- --configuration production

# ---------- runtime stage ----------
FROM nginx:1.25

# Copiar la build exacta de Angular (ojo con el nombre)
COPY --from=build /app/dist/appoinments-project-frontedn /usr/share/nginx/html

# Reemplazar configuración por una compatible con Angular Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
