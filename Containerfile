FROM docker.io/library/golang:1.22-alpine AS builder
WORKDIR /src
COPY go.mod main.go ./
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /flowaxon-engine main.go

FROM docker.io/library/alpine:3.20
RUN apk add --no-cache ca-certificates
LABEL io.containers.autoupdate="registry"
LABEL org.opencontainers.image.source="https://github.com/tamld/flowaxon"
WORKDIR /app
COPY --from=builder /flowaxon-engine /app/flowaxon-engine
COPY . /app/
EXPOSE 80
ENTRYPOINT ["/app/flowaxon-engine"]
