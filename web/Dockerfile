FROM node:19.4

WORKDIR /app

# install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn

# copy assets
COPY tsconfig.json .
COPY public public
COPY src src

CMD [ "yarn", "start" ]
