FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Production image ───────────────────────────────────────────────────────
FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

COPY --from=build /app/dist /usr/share/nginx/html

# Nginx config template — BACKEND_URL is substituted at container start time.
# Default to "http://backend:8080" so the image still works with docker-compose.
COPY --from=build /app/nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

# envsubst replaces ${BACKEND_URL} in the template before nginx starts.
# nginx official image runs /docker-entrypoint.d/20-envsubst-on-templates.sh
# automatically, so we just need the template in /etc/nginx/templates/.
CMD ["nginx", "-g", "daemon off;"]
