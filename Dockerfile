FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY server/package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]
