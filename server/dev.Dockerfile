FROM node:12.4.0

# create server directory
RUN mkdir /app
WORKDIR /app

# install node_modules
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn

# copy configuration
COPY ./.sequelizerc .
COPY ./sequelize.config.js .
COPY ./tsconfig.json .
COPY ./webpack.config.js .
COPY ./jest.config.js .
COPY ./.graphqlconfig.yml .
