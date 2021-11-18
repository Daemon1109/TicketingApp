FROM node:alpine

WORKDIR /ticketing-app/payments

COPY package.json .

RUN yarn install --production

COPY . .

CMD ["yarn", "start"]