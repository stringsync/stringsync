FROM node:14.9.0

WORKDIR /web

# install node_modules for packages
COPY package.json .
COPY yarn.lock .
RUN yarn

# copy the main files over
COPY tsconfig.json .
COPY craco.config.js .
COPY public public
