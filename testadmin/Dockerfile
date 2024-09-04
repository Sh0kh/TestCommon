FROM node:18 AS build

WORKDIR /app

COPY testadmin/package*.json ./

RUN npm install

COPY testadmin/ .

RUN npm run build

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

