# build stage
FROM node:23 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build  # /app/dist

# nginx stage
FROM nginx:stable-alpine as production-stage
RUN apk add --no-cache gettext

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
EXPOSE 5678

CMD ["sh", "-c", "envsubst '${VUE_APP_BACKEND_HOST} ${VUE_APP_BACKEND_PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]