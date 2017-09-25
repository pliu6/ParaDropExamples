FROM ubuntu:16.04
MAINTAINER Paradrop Team <info@paradrop.io>

RUN apt-get update && \
  apt-get -y install iptables

ADD chute/wifi-router.sh /usr/local/bin/wifi-router.sh
CMD ["wifi-router.sh"]
