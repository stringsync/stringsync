FROM node:14.9.0

WORKDIR /app

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
COPY ApiTestEnvironment.js .
COPY ecosystem.config.js .
COPY src src