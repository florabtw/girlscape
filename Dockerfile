FROM node:24.12

WORKDIR /usr/src/app

COPY .env.prod     .env
COPY package.json  .
COPY tsconfig.json tsconfig.json
COPY src           src

RUN npm install
RUN npm install pm2 -g
RUN npm run build

ENV NODE_ENV=production

CMD ["pm2-runtime", "start", "dist/index.js"]
