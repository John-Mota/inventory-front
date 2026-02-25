# ── Stage 1: Build ──────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

# Instalar dependências (cache de camada)
COPY package.json package-lock.json* ./
RUN npm ci

# Copiar código-fonte e buildar
COPY . .

# Variável de build para a URL da API (pode ser sobrescrita no docker build)
ARG VITE_API_BASE_URL=https://inventory-4xyq.onrender.com/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ── Stage 2: Serve ──────────────────────────────────────────────
FROM nginx:alpine

# Copiar build para o nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuração do nginx para SPA (redireciona rotas para index.html)
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
