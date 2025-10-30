# ---------- build stage ----------
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NODE_ENV
ARG API_BASE_URL
RUN npm run build -- --configuration production

# ---------- runtime stage ----------
FROM nginx:1.25
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
