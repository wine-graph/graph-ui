import {ApolloClient, InMemoryCache, HttpLink} from '@apollo/client';

const domainUri = import.meta.env.DEV
  ? 'http://localhost:8081/graphql'
  : 'https://wine-domain.fly.dev/graphql';

const retailerUri = import.meta.env.DEV
  ? 'http://localhost:8086/graphql'
  : 'https://wine-retailer.fly.dev/graphql';

const producerUri = import.meta.env.DEV
  ? 'http://localhost:8083/graphql'
  : 'https://wine-producer.fly.dev/graphql';

export const domainClient = new ApolloClient({
  link: new HttpLink({uri: domainUri}),
  cache: new InMemoryCache(),
});

export const retailerClient = new ApolloClient({
  link: new HttpLink({uri: retailerUri}),
  cache: new InMemoryCache(),
});

export const producerClient = new ApolloClient({
  link: new HttpLink({uri: producerUri}),
  cache: new InMemoryCache(),
})