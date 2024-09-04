FROM node:18

WORKDIR /app

COPY test/package*.json ./

RUN npm install

COPY test/ .

CMD ["node", "build/index.js"]

EXPOSE 80
