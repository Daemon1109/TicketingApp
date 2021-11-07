FROM node:alpine

WORKDIR /ticketing-app/client

COPY package.json .

RUN yarn install

COPY . .

CMD ["yarn", "dev"]