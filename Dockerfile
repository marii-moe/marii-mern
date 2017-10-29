FROM node:8-alpine
COPY ./package.json /var/www/marii-mern/package.json
WORKDIR /var/www/marii-mern/
RUN yarn install
COPY . .
RUN yarn build
CMD ["yarn","start"]