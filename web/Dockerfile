FROM node:latest
RUN mkdir -p /home/area/web
WORKDIR /home/area/web
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8081
CMD [ "npm", "start" ]
