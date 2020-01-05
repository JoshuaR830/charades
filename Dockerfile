FROM node:12

WORKDIR /

COPY package*.json ./

RUN npm install

COPY ./src .

EXPOSE 8001

CMD ["node", "index.js"]