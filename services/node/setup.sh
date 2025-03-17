#! /bin/sh


while ! nc -z postgresql 5432; do
    sleep 0.1
done

node b/starting/starting.mjs

echo start nodejs

exec "$@"
