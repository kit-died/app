FROM node:20-bullseye AS build

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

ENV NODE_ENV=production

RUN corepack enable

USER node

RUN corepack prepare yarn@stable --activate

COPY --chown=node:node ./.yarnrc.yml /usr/src/app/.yarnrc.yml
COPY --chown=node:node ./yarn.lock /usr/src/app/yarn.lock
COPY --chown=node:node ./package.json /usr/src/app/package.json
COPY --chown=node:node ./apps/server/package.json /usr/src/app/apps/server/package.json
COPY --chown=node:node ./apps/client/package.json /usr/src/app/apps/client/package.json

WORKDIR /usr/src/app

RUN yarn install

COPY --chown=node:node ./apps/server /usr/src/app/apps/server
COPY --chown=node:node ./apps/client /usr/src/app/apps/client
COPY --chown=node:node ./tsconfig.json /usr/src/app/tsconfig.json
COPY --chown=node:node ./.eslintignore /usr/src/app/.eslintignore
COPY --chown=node:node ./.eslintrc.json /usr/src/app/.eslintrc.json

RUN yarn server build
RUN yarn client build

FROM node:20.5.0-bullseye-slim

ENV NODE_ENV=production

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init

RUN chown -R node:node /usr/local/lib/node_modules
RUN corepack enable

USER node

RUN corepack prepare yarn@stable --activate

COPY --chown=node:node --from=build /usr/src/app/apps/server/node_modules /usr/src/app/apps/server/node_modules
COPY --chown=node:node --from=build /usr/src/app/apps/server/package.json /usr/src/app/apps/server/package.json
COPY --chown=node:node --from=build /usr/src/app/apps/client/dist /usr/src/app/apps/client/dist
COPY --chown=node:node --from=build /usr/src/app/apps/server/dist /usr/src/app/apps/server/dist
COPY --chown=node:node --from=build /usr/src/app/apps/server/ecosystem.config.js /usr/src/app/apps/server/ecosystem.config.js
COPY --chown=node:node --from=build /usr/src/app/apps/server/.env /usr/src/app/apps/server/.env

WORKDIR /usr/src/app/apps/server

CMD ["dumb-init", "./node_modules/.bin/pm2-runtime", "start", "ecosystem.config.js"]