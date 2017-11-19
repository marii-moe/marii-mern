const {execute, subscribe} = require('graphql');
const {createServer} = require('http');
const {SubscriptionServer} = require('subscriptions-transport-ws');
const express = require('express');
const bodyParser = require('body-parser');
const buildDataloaders = require('./src/dataloaders')
const formatError = require('./src/formatError');
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');
const {authenticate} = require('./src/authentication')
const schema = require('./src/schema');

const connectMongo = require('./src/mongo-connector');

const start = async () => {
  const mongo = await connectMongo();
  var app = express();

  const buildOptions = async (req,res) => {
    const user = await authenticate(req, mongo.Users)
    return {
      context: {
	dataloaders: buildDataloaders(mongo),
	mongo,
	user
      },
      formatError,
      schema,
    }
  }
  const IQL_PORT = 3001;
  
  app.use('/graphql', bodyParser.json(), graphqlExpress(buildOptions))
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    passHeader: `'Authorization': 'bearer token-marii@marii.moe'`,
    subscriptionsEndpoint: `ws://localhost:${IQL_PORT}/subscriptions`,
  }));

  const PORT = 3000;
  
  const server = createServer(app);
  server.listen(PORT, () => {
    SubscriptionServer.create(
      {execute, subscribe, schema},
      {server, path: '/subscriptions'},
    );
    console.log(`Hackernews GraphQL server running on port ${PORT}.`)
  });
};

start();
