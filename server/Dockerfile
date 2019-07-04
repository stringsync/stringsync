FROM node:12.4.0

# create server directory
RUN mkdir /server
WORKDIR /server

# install server dependencies
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn

# bundle server src
COPY . .
RUN yarn compile

# start server
EXPOSE 8080
CMD ["yarn", "start"]
