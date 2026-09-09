import { inject } from '@angular/core';
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors, ServerError } from '@apollo/client/errors';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { environment } from '../../../environments/environment';

function extractGraphQLErrorMessage(bodyText: string): string {
  try {
    const parsed = JSON.parse(bodyText) as { errors?: { message: string }[] };
    return parsed.errors?.map((err) => err.message).join('; ') || bodyText || 'unknown';
  } catch {
    return bodyText || 'unknown';
  }
}

export function apolloOptionsFactory(): ApolloClient.Options {
  const httpLink: HttpLink = inject(HttpLink);

  const errorLink = new ErrorLink(({ error, operation }) => {
    if (CombinedGraphQLErrors.is(error)) {
      for (const err of error.errors) {
        console.error(
          `[GraphQL error]: Message: ${err.message}, Operation: ${operation.operationName}, Path: ${err.path?.join('.')}`
        );
      }
    } else if (ServerError.is(error)) {
      const graphqlMessage = extractGraphQLErrorMessage(error.bodyText);
      console.error(
        `[Server error]: Status: ${error.statusCode}, Operation: ${operation.operationName}, Message: ${graphqlMessage}`
      );
    } else {
      console.error(`[Network error]: ${error.message}, Operation: ${operation.operationName}`);
    }
  });

  return {
    link: ApolloLink.from([errorLink, httpLink.create({ uri: environment.graphqlUri })]),
    cache: new InMemoryCache(),
  };
}

export const graphqlProvider = [
  provideApollo(apolloOptionsFactory),
];
