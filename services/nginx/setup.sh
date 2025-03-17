#! /bin/sh

nginx_cert_path="/etc/nginx/certs/nginx"

openssl genrsa -out $nginx_cert_path.key 2048
openssl req -new -key $nginx_cert_path.key -out $nginx_cert_path.csr -nodes -subj "/C=42/ST=France/L=Mulhouse/O=NOUSLOL/OU=nousLOLSection/CN=ft_transcendence"
openssl x509 -req -days 3650 -in $nginx_cert_path.csr -signkey $nginx_cert_path.key -out $nginx_cert_path.crt

while ! nc -z node 6900; do
    sleep 0.1
done

echo "Starting nginx"

exec "$@"
