FROM alpine:3.19.2

RUN apk add nginx
RUN apk add openssl
RUN apk add vim

COPY [ "./default.conf", "/etc/nginx/http.d/default.conf" ]
COPY [ "./setup.sh", "setup.sh" ]

RUN [ "chmod", "+x", "./setup.sh" ]
RUN mkdir -p /etc/nginx/certs
RUN mkdir -p /home/www
RUN mkdir -p /var/lib/nginx/logs/
RUN chown nginx:nginx /var/lib/nginx/logs/
RUN chown nginx:nginx /home/www
RUN chown nginx:nginx /etc/nginx/certs

ENTRYPOINT [ "./setup.sh", "nginx",  "-g", "daemon off;" ]

EXPOSE 443/tcp
