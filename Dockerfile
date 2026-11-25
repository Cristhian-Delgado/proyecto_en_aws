# Entorno local reproducible: sirve la carpeta dist/ con nginx.
FROM nginx:alpine
COPY dist /usr/share/nginx/html
