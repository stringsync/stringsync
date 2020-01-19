FROM ss-root:latest

WORKDIR /string-sync/web
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn

COPY .env .
COPY config-overrides.js .
COPY tsconfig.json .
