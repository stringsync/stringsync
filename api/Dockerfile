FROM golang:1.19.4-alpine3.17

WORKDIR /app

COPY go.mod .
RUN go mod download
COPY *.go .
RUN go build

CMD [ "./api" ]