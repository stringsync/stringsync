FROM node:13

WORKDIR /web
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn

COPY .env .
COPY config-overrides.js .
COPY tsconfig.json .
COPY public public/
COPY src src/

CMD ["yarn", "start"]
