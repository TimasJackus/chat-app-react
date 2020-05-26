FROM nginx

WORKDIR /root/
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./build /app

EXPOSE 80