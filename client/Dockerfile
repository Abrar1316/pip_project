FROM node:18.10.0-alpine as build
WORKDIR /mernClient
COPY package.json ./
RUN npm install
COPY . .
# EXPOSE 3000
# CMD ["npm","start"]

RUN npm run build

FROM nginx:1.19.10-alpine
COPY --from=build /mernClient/build /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]




