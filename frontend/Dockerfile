# Load env
ARG APP_ENV=dev
FROM node:13.6.0-alpine as base

ENV HOST 0.0.0.0

WORKDIR /app

# Install dev env
FROM base as dev-install

# Install prod env
FROM base as prod-install

COPY package.json /app/

RUN apk add python make g++

RUN yarn

COPY ./ /app/

FROM ${APP_ENV}-install as postinstall
FROM node:13.6.0-alpine as cleanup

WORKDIR /app
COPY --from=postinstall /app/ /app/

FROM cleanup as dev-prefinal

RUN apk add python make g++

COPY dev-entrypoint.sh /docker-entrypoint.sh

CMD ["yarn", "dev"]

FROM cleanup as prod-prefinal

RUN yarn build

COPY docker-entrypoint.sh /docker-entrypoint.sh
CMD ["yarn", "dev"]

FROM ${APP_ENV}-prefinal as final

RUN chmod a+x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]