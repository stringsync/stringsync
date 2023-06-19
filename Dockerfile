FROM golang:1.20.0-alpine3.17

RUN apk update && apk upgrade && apk add bash;

WORKDIR /app

# install dependencies
RUN go install github.com/pressly/goose/v3/cmd/goose@latest
COPY go.mod .
COPY go.sum .
RUN go mod download

# build binary
COPY stringsync.go stringsync.go
COPY api api
COPY cmd cmd
COPY database database
COPY util util
COPY service service
RUN go build stringsync

CMD [ "./stringsync", "api" ]