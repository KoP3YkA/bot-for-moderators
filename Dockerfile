FROM node:21

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/Main.js"]