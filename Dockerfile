FROM alpine:latest as base

FROM base AS compilers
# For JavaScript
RUN apk add --update nodejs npm
# For Typescript
RUN npm install -g ts-node typescript
# For Go
RUN wget https://golang.org/dl/go1.22.6.linux-amd64.tar.gz
RUN tar -C /usr/local -xzf go1.22.6.linux-amd64.tar.gz
ENV PATH "$PATH:/usr/local/go/bin"
# For Csharp
RUN apk add --no-cache mono --repository http://dl-cdn.alpinelinux.org/alpine/edge/testing && \
    apk add --no-cache --virtual=.build-dependencies ca-certificates && \
    cert-sync /etc/ssl/certs/ca-certificates.crt && \
    apk del .build-dependencies

FROM compilers AS release
WORKDIR /app
EXPOSE 3003

COPY . .
COPY package.json package-lock.json ./
RUN npm install

RUN adduser -D codeinterview
RUN chown -R codeinterview /app

USER codeinterview

CMD npm run start