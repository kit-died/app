FROM node:20-bullseye

RUN corepack enable
# RUN sed -i 's/openssl_conf = default_conf/#openssl_conf = default_conf/g' /etc/ssl/openssl.cnf 
USER node
RUN corepack prepare yarn@stable --activate