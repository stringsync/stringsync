FROM node:13

WORKDIR /server
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn

COPY .sequelizerc .
COPY jest.config.js .
COPY sequelize.config.js .
COPY tsconfig.json .
COPY nodemon.json .
COPY src src/

CMD ["yarn", "start"]