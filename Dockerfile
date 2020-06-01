FROM node:13

WORKDIR /stringsync
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn
