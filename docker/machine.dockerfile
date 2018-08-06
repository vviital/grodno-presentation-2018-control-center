FROM docker:dind

COPY ./machine/daemon.json /etc/docker/daemon.json

# Install NodeJS
RUN apk add --update curl zsh vim nodejs nodejs-npm

WORKDIR /home/app

COPY ./machine/index.js ./index.js
COPY ./machine/start.sh ./start.sh

CMD ["sh", "start.sh"];
