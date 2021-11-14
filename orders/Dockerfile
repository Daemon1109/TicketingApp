FROM node:alpine

WORKDIR /ticketing-app/orders

COPY package.json .

RUN yarn install --production

COPY . .

CMD ["yarn", "start"]