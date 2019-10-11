FROM node:12.4.0

WORKDIR /string-sync
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn

COPY ./tsconfig.base.json .
