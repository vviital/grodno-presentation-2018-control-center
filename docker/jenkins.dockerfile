FROM jenkins/jenkins:2.135

USER root

RUN apt-get update && apt-get install -y \
     apt-transport-https \
     ca-certificates \
     curl \
     gnupg2 \
     software-properties-common

# Install docker
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -&& \
   add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/debian \
   $(lsb_release -cs) \
   stable" && \
   apt-get update && apt-get install -y docker-ce

# Install docker-compose
RUN curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose

RUN chmod +x /usr/local/bin/docker-compose
