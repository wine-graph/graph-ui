import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const uri = 'http://localhost:8081/graphql';

const httpLink = new HttpLink({ uri });

export const domainClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

export default domainClient;