FROM node:23-alpine

COPY ./setup.sh setup.sh
RUN chmod +x ./setup.sh

ENTRYPOINT ./setup.sh npm run dstart
