FROM node:14.9.0

WORKDIR /stringsync

COPY ./package.json .
COPY ./yarn.lock .
COPY ./packages/common/package.json ./packages/common/
COPY ./packages/di/package.json ./packages/di/
COPY ./packages/config/package.json ./packages/config/
COPY ./packages/domain/package.json ./packages/domain/
COPY ./packages/repos/package.json ./packages/repos/
COPY ./packages/graphql/package.json ./packages/graphql/
COPY ./packages/services/package.json ./packages/services/
COPY ./packages/web/package.json ./packages/web/
COPY ./packages/util/package.json ./packages/util/
COPY ./packages/db/package.json ./packages/db/
COPY ./packages/jobs/package.json ./packages/jobs/

RUN yarn

COPY ./tsconfig.json .
COPY ./jest.config.js .
COPY ./ServerTestEnvironment.js .
