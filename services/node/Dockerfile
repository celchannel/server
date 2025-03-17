FROM node:23-alpine

WORKDIR /app
COPY ./package.json ./
COPY [ "./setup.sh", "setup.sh" ]
RUN [ "chmod", "+x", "./setup.sh" ]

RUN npm install

ENTRYPOINT [ "./setup.sh", "npm" , "run", "dstart"]
