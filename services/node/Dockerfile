FROM node:23-alpine

WORKDIR /app
COPY ./package.json ./
COPY [ "./setup.sh", "setup.sh" ]
RUN [ "chmod", "+x", "./setup.sh" ]

RUN npm install

# TODO: change this for arg start
ENTRYPOINT [ "./setup.sh", "npm" , "run", "dstart"]
