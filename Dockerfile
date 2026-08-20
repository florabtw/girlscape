FROM node:24.12

WORKDIR /usr/src/app

RUN npm run build

COPY .env.prod     .env
COPY dist          dist
COPY package.json  .

RUN yarn global add pm2
RUN yarn install --production --pure-lockfile

ENV NODE_ENV=production

CMD ["pm2-runtime", "start", "dist/index.js"]
