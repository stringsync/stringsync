FROM ss-root:latest

WORKDIR /string-sync/server
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn

COPY .graphqlconfig.yml .
COPY .sequelizerc .
COPY jest.config.js .
COPY jest.setup.js .
COPY sequelize.config.js .
COPY tsconfig.json .
COPY tsconfig.db.json .
COPY webpack.config.js .