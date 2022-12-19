FROM node:16.18-alpine3.16

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --production=true

COPY . /app

EXPOSE 3001

FROM node:16.18-alpine3.16

WORKDIR /app

COPY --from=0 /app /app

CMD ["node", "server.js"]





