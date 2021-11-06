FROM node:alpine

WORKDIR /ticketing-app/client

COPY package.json .

RUN yarn install --production

COPY . .

CMD ["yarn", "dev"]