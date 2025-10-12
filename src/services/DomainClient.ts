import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const uri = import.meta.env.DEV ? 'http://localhost:8081/graphql' : 'https://wine-domain.fly.dev/graphql';
const httpLink = new HttpLink({ uri });

export const domainClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

export default domainClient;