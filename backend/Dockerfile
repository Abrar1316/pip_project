FROM node:18.10.0-alpine
WORKDIR /mernBackend
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm","start"]