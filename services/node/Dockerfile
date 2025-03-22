FROM node:23-alpine

RUN apk add jq

ARG UID
ARG GID

COPY ./setup.sh setup.sh
RUN chmod +x ./setup.sh

RUN if getent passwd $UID > /dev/null; then \
    deluser $(getent passwd $UID | cut -d: -f1); fi

RUN if getent group $GID > /dev/null; then \
    delgroup $(getent group $GID | cut -d: -f1); fi

RUN addgroup -g $GID -S celgroup
RUN adduser -u $UID -G celgroup -D celuser

USER celuser

ENTRYPOINT ./setup.sh npm run dstart
