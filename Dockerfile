FROM node:13

WORKDIR /stringsync

COPY ./package.json .
COPY ./yarn.lock .
COPY ./modules/common/package.json ./modules/common/

RUN yarn

COPY ./tsconfig.json .
COPY ./modules/sequelize/tsconfig.json ./modules/sequelize/
COPY ./jest.config.js .
