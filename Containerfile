FROM docker.io/library/golang:alpine AS builder
WORKDIR /src
COPY go.mod main.go ./
RUN apk update && apk upgrade --no-cache && CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /flowaxon-engine main.go

FROM docker.io/library/alpine:latest
RUN apk update && apk upgrade --no-cache && apk add --no-cache ca-certificates
LABEL io.containers.autoupdate="registry"
LABEL org.opencontainers.image.source="https://github.com/tamld/flowaxon"
WORKDIR /app
COPY --from=builder /flowaxon-engine /app/flowaxon-engine
COPY . /app/
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["/app/flowaxon-engine"]
