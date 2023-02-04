FROM golang:1.20.0-alpine3.17

WORKDIR /app

# install dependencies
COPY go.mod .
COPY go.sum .
RUN go mod download

# build binary
COPY stringsync.go stringsync.go
COPY api api
COPY cmd cmd
RUN go build stringsync

CMD [ "./stringsync", "api" ]