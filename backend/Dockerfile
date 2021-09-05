FROM node:12.13-alpine

ENV PORT 4000

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run prebuild
RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start:dev"]
