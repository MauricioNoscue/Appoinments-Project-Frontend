FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

FROM nginx:1.25
ARG API_BASE_URL
COPY --from=build /app/dist/appoinments-project-frontedn/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN sed -i "s|\${API_BASE_URL}|${API_BASE_URL}|g" /usr/share/nginx/html/assets/env.js
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
