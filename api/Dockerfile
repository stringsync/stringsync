FROM node:14.9.0

WORKDIR /api

# install process manager
RUN npm install pm2 -g
RUN pm2 install typescript

# install node_modules for packages
COPY package.json .
COPY yarn.lock .
RUN yarn

# copy the main files over
COPY tsconfig.json .
COPY codegen.yml .
COPY ecosystem.dev.config.js .
COPY jest.config.js .
COPY .sequelizerc .
COPY sequelize.config.js .
COPY bin bin
