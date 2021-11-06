FROM node:alpine

WORKDIR /ticketing-app/auth

COPY package.json .

RUN yarn install --production

COPY . .

CMD ["yarn", "start"]