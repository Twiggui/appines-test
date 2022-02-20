FROM node:16.14.0-alpine3.15
# Version bien définie de node (plutôt que latest) pour être sur que le build Typescript fonctionne

EXPOSE 5565

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .
ENV NODE_ENV=docker

CMD ["npm", "start"]