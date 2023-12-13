import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export const createApolloClient = () => {
    return new ApolloClient({
      link: new HttpLink({
        uri: 'https://singular-zebra-54.hasura.app/v1/graphql',
        headers: {
          'x-hasura-admin-secret': '7nIsHRQ7uP3wd1SYxf6vWHVJ4o5nhU2RwvwrDyI859fSGv2kfZJkXY07Q7cjIK3a'
        }
      }),
      cache: new InMemoryCache(),
    });
};