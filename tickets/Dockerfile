FROM node:alpine

WORKDIR /ticketing-app/tickets

COPY package.json .

RUN yarn install --production

COPY . .

CMD ["yarn", "start"]