FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
COPY .env .env
RUN npm install typescript
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "dev"]
