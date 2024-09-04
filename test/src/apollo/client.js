// apolloClient.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://backend.camelot-register.uz/query', // Replace with your GraphQL endpoint
  cache: new InMemoryCache(),
});

export default client;
