FROM node:9-alpine as webpack
COPY ./package.json /var/www/marii-mern/package.json
WORKDIR /var/www/marii-mern/
RUN npm install
COPY . .
RUN npm run-script build
CMD ["npm","run-script","start:dev"]

FROM nginx:1.13-alpine as nginx
COPY --from=webpack /var/www/marii-mern/dist /usr/share/nginx/html
