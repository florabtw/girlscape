FROM node:24.12

WORKDIR /usr/src/app

COPY .env          .env
COPY src           src
COPY package.json  .

RUN yarn global add pm2
RUN yarn install --production --pure-lockfile

ENV NODE_ENV=production

CMD ["pm2-runtime", "start", "src/index.js"]
