FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./


COPY . .

RUN rm -rf node_modules

RUN npm install

RUN npm rebuild bcrypt --build-from-source
RUN npm install joi 

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run","dev"]