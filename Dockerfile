FROM node:alpine

RUN mkdir -p /home/node/api/node_modules && chown -R node:node /home

WORKDIR /home/node/api

COPY package.json yarn.* ./

USER node

COPY --chown=node:node . .

EXPOSE 3333

ENTRYPOINT [ "./init.sh" ]