FROM node:9-alpine as webpack
COPY ./package.json /var/www/marii-mern/package.json
WORKDIR /var/www/marii-mern/
RUN npm install
COPY . .
RUN npm run-script build
CMD ["npm","start"]

FROM webpack as tests
CMD ["npm","test"]

FROM nginx:1.13-alpine as nginx
COPY --from=webpack /var/www/marii-mern/build /usr/share/nginx/html