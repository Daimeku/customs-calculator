FROM node:current-slim

WORKDIR /app/customs-calc

COPY package.json .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]

COPY . .