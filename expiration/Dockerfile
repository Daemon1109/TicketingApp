FROM node:alpine

WORKDIR /ticketing-app/expiration

COPY package.json .

RUN yarn install --production

COPY . .

CMD ["yarn", "start"]