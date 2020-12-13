FROM stringsync:latest

RUN yarn global add pm2
COPY ./packages/ ./packages/
RUN yarn tsc

CMD [ "pm2", "start", "./dst/graphql/src/index.js", "--no-daemon"]