FROM node:20.04

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start:prod"]