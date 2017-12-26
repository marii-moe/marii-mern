import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom' 
import { ApolloProvider } from 'react-apollo'
import { mockClient } from "./Mock-Apollo"
import { GC_USER_ID, GC_AUTH_TOKEN  } from './constants'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <ApolloProvider client={mockClient}>
	<App />
      </ApolloProvider>
    </BrowserRouter>
      , div);
});
