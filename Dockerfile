FROM alpine:latest AS base

FROM base AS compilers
# For JavaScript
RUN apk add --update nodejs npm
# For Typescript
RUN npm install -g ts-node typescript
# For Go
RUN wget https://golang.org/dl/go1.22.6.linux-amd64.tar.gz
RUN tar -C /usr/local -xzf go1.22.6.linux-amd64.tar.gz
ENV PATH="$PATH:/usr/local/go/bin"
# For Csharp
RUN apk add dotnet8-sdk 
RUN apk add dotnet8-runtime
# For Python
RUN apk add --no-cache python3

FROM compilers AS release
WORKDIR /app
EXPOSE 3003

COPY . .
COPY package.json yarn.lock ./
RUN npm install

RUN adduser -D codeinterview
RUN chown -R codeinterview /app

USER codeinterview

#For suppress dotnet welcome message (instead DOTNET_SKIP_FIRST_TIME_EXPERIENCE)
#https://github.com/dotnet/sdk/issues/3828#issuecomment-557768792
RUN mkdir "$HOME"/.dotnet && touch "$HOME"/.dotnet/"$(dotnet --version)".dotnetFirstUseSentinel

CMD npm run start