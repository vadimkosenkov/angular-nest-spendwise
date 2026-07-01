import { inject } from '@angular/core';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { environment } from '../../../environments/environment';

export function apolloOptionsFactory(): ApolloClient.Options {
  const httpLink = inject(HttpLink);

  return {
    link: httpLink.create({ uri: environment.graphqlUri }),
    cache: new InMemoryCache(),
  };
}

export const graphqlProvider = [
  provideApollo(apolloOptionsFactory),
];
