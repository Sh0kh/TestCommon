FROM node:18 AS build

WORKDIR /app

COPY test/package*.json ./

RUN npm install

COPY test/ .

RUN npm run build


COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

