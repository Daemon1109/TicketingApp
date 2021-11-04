FROM node:alpine

WORKDIR /ticketing-app/auth

COPY package.json .

RUN yarn install

COPY . .

CMD ["yarn", "start"]