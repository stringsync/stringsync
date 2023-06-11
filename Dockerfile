FROM golang:1.20.0-alpine3.17

WORKDIR /app

# install dependencies
RUN go install github.com/pressly/goose/v3/cmd/goose@latest
RUN go install github.com/kyleconroy/sqlc/cmd/sqlc@latest
COPY go.mod .
COPY go.sum .
RUN go mod download

# generate db files
COPY db db
RUN sqlc generate

# build binary
COPY stringsync.go stringsync.go
COPY api api
COPY cmd cmd
RUN go build stringsync

CMD [ "./stringsync", "api" ]