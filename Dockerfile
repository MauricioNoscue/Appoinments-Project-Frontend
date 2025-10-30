# ---------- build stage ----------
FROM node:20 AS build
WORKDIR /app

# Copiar dependencias e instalarlas
COPY package*.json ./
RUN npm ci

# Copiar código fuente y compilar Angular
COPY . .
RUN npm run build -- --configuration production

# ---------- runtime stage ----------
FROM nginx:1.25

# ✅ Copiar la build real de Angular (carpeta /browser)
COPY --from=build /app/dist/appoinments-project-frontedn/browser /usr/share/nginx/html

# ✅ Configuración de Nginx para Angular Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
