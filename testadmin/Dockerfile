FROM node:18

WORKDIR /app

COPY testadmin/package*.json ./

RUN npm install

COPY testadmin/ .

CMD ["node", "build/index.js"]

EXPOSE 80

