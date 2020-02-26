FROM node:12.4.0

WORKDIR /web
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn

COPY .env .
COPY config-overrides.js .
COPY tsconfig.json .
