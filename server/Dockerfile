FROM node:22-slim

RUN apt-get update && apt-get -y install openssl

WORKDIR /src
COPY package*.json ./
RUN npm ci

# RUN npx prisma generate

COPY . .
EXPOSE 8080
