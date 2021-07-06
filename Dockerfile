FROM node:14.9.0

WORKDIR /app

# make ss commands work
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY bin bin
COPY scripts scripts
COPY gulpfile.ts .
ENV PATH="/app/bin:${PATH}"

# install api dependencies
COPY api/package.json api/
COPY api/yarn.lock api/
RUN ss installapi

# install web dependencies
COPY web/package.json web/
COPY web/yarn.lock web/
RUN ss installweb

# copy the web files over
COPY web/tsconfig.json web/
COPY web/craco.config.js web/
COPY web/.env web/
COPY web/public web/public/
COPY web/src web/src/

# The web project is built before the api project
# because the api project builds much faster.
RUN ss buildweb

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

# run the project
CMD [ "yarn", "prod:api" ]
