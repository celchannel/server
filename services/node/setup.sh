#! /bin/sh


while ! nc -z postgresql 5432; do
    sleep 0.1
done

echo start nodejs

exec "$@"
