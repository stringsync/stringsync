FROM node:13

WORKDIR /stringsync
COPY . .
RUN yarn
