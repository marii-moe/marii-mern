FROM node:9-alpine
COPY ./package.json /var/www/marii-mern/package.json
WORKDIR /var/www/marii-mern/
RUN npm install
COPY . .
CMD ["npm","start"]