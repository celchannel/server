#! /bin/sh

cat <<- EOF > .env
	DATABASE_URL="postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@postgresql:5432/$POSTGRES_DB?schema=public"
	EOF

until cd /app; do
	sleep 0.2
done

npm install

while ! nc -z postgresql 5432; do
    sleep 0.1
done

echo start nodejs

exec "$@"
