FROM node:13

WORKDIR /stringsync

COPY ./package.json .
COPY ./yarn.lock .
COPY ./modules/common/package.json ./modules/common/
COPY ./modules/domain/package.json ./modules/domain/
COPY ./modules/graphql/package.json ./modules/graphql/
COPY ./modules/repos/package.json ./modules/repos/
COPY ./modules/sequelize/package.json ./modules/sequelize/
COPY ./modules/services/package.json ./modules/services/
COPY ./modules/config/package.json ./modules/config/
COPY ./modules/container/package.json ./modules/container/

RUN yarn

COPY ./tsconfig.json .
COPY ./modules/sequelize/tsconfig.json ./modules/sequelize/
COPY ./jest.config.js .
