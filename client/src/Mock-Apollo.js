import { buildClientSchema } from 'graphql';
import * as introspectionResult from './server-schema.json';
import { addMockFunctionsToSchema } from 'graphql-tools'
import ApolloClient from 'apollo-client'
import { ApolloLink, Observable } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { shallow } from 'enzyme'
import { ApolloProvider } from 'react-apollo'
import React from 'react'

const schema = buildClientSchema(introspectionResult);

addMockFunctionsToSchema({schema});

const link = new ApolloLink(operation => {
  return new Observable(observer => {
    const { query, operationName, variables } = operation;
    delay(100)
      .then(() =>
        graphql(schema, print(query), null, null, variables, operationName)
      )
      .then(result => {
        observer.next(result);
        observer.complete();
      })
      .catch(observer.error.bind(observer));
  });
});

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export const mockClient = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

export const apolloRender = (element) => {
  const wrapper = shallow(<ApolloProvider client={mockClient}>{element}</ApolloProvider>                                                                                                     
                          , { context: { client: mockClient }})                                                                                                                                  
        .dive().dive().dive()
  return wrapper
}
