// apolloClient.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://204.48.28.153:8080/query', // Replace with your GraphQL endpoint
  cache: new InMemoryCache(),
});

export default client;
