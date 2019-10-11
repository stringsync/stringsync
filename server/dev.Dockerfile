FROM ss-root:latest

WORKDIR /string-sync/server
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn

COPY .graphqlconfig.yml .
COPY .sequelizerc .
COPY jest.config.js .
COPY sequelize.config.js .
COPY tsconfig.json .
COPY webpack.config.js .
