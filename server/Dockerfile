FROM node:9-alpine as dev-server
COPY ./package.json /var/www/marii-mern/package.json
WORKDIR /var/www/marii-mern/
RUN npm install --no-optional
COPY . .
CMD ["npm","start"]

FROM dev-server as tests
CMD ["npm","test"]