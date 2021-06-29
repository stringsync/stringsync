FROM node:14.9.0

WORKDIR /app

# make ss commands work
COPY package.json .
RUN yarn
COPY bin bin
COPY Jakefile .
ENV PATH="/app/bin:${PATH}"

# install api dependencies
COPY api/package.json api/
COPY api/yarn.lock api/
RUN ss install:api

# install web dependencies
COPY web/package.json web/
COPY web/yarn.lock web/
RUN ss install:web

# copy the web files over
COPY web/tsconfig.json web/
COPY web/craco.config.js web/
COPY web/public web/public/
COPY web/src web/src/

# The web project is built before the api project
# because the api project builds much faster.

# build the web project
RUN REACT_APP_SERVER_URI=http://localhost:3000 REACT_APP_GRAPHQL_ENDPOINT=/graphql PUBLIC_URL=http://localhost:3000 ss build:web

# copy the api files over
COPY api/tsconfig.json api/
COPY api/tsconfig.prod.json api/
COPY api/jest.config.js api/
COPY api/.sequelizerc api/
COPY api/sequelize.config.js api/
COPY api/bin api/bin/
COPY api/src api/src/

# build the api project
RUN yarn tsc --project api/tsconfig.prod.json

# copy web build to the api build
RUN mkdir -p api/build/server/web
RUN cp -R web/build/* api/build/server/web 

# run the project
CMD [ "node", "/app/api/build/entrypoints/api.js" ]
