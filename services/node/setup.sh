#! /bin/sh


until cd /app; do
	sleep 0.2
done

npm install

ENCODED_PASS=$(jq -rn --arg x "$POSTGRES_PASSWORD" '$x|@uri')

cat <<- EOF > .env
	DATABASE_URL="postgresql://$POSTGRES_USER:$ENCODED_PASS@postgresql:5432/$POSTGRES_DB?schema=public"
	EOF

while ! nc -z postgresql 5432; do
    sleep 0.1
done

echo start nodejs

exec "$@"
