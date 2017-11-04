FROM node:8-alpine as webpack
COPY ./package.json /var/www/marii-mern/package.json
WORKDIR /var/www/marii-mern/
RUN yarn install
COPY . .
RUN yarn build
CMD ["yarn","start:dev"]

FROM nginx:1.13-alpine as nginx
COPY --from=webpack /var/www/marii-mern/dist /usr/share/nginx/html
