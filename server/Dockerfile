FROM node:22-slim

WORKDIR /src
COPY package*.json ./
RUN npm ci

COPY . .
EXPOSE 8080
