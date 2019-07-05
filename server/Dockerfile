FROM node:12.4.0

# create server directory
RUN mkdir /server
WORKDIR /server

# install node_modules
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn

# create the build
COPY . .
RUN yarn compile

# start the server
CMD ["yarn", "start"]
