FROM node:16.18-alpine3.16

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . /app

RUN npm run build

FROM nginx:stable-alpine

COPY --from=0 /app/build /usr/share/nginx/html


COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

