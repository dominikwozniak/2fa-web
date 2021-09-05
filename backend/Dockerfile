FROM node:12.13-alpine

ENV PORT 4000

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
RUN npm install

EXPOSE 4000

CMD ["npm", "run", "start:dev"]
