import { inject } from '@angular/core';
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

const uri = 'http://localhost:8080/graphql';

export function apolloOptionsFactory(): ApolloClient.Options {
  const httpLink = inject(HttpLink);

  const errorLink = new ErrorLink(({ error, operation }) => {
    if (CombinedGraphQLErrors.is(error)) {
      for (const err of error.errors) {
        console.error(
          `[GraphQL error]: Message: ${err.message}, Operation: ${operation.operationName}, Path: ${err.path?.join('.')}`
        );
      }
    } else {
      console.error(`[Network error]: ${error.message}, Operation: ${operation.operationName}`);
    }
  });

  return {
    link: ApolloLink.from([errorLink, httpLink.create({ uri })]),
    cache: new InMemoryCache(),
  };
}

export const graphqlProvider = [
  provideApollo(apolloOptionsFactory),
];
