import { ApplicationConfig } from '@angular/core';
import { graphqlProvider } from './core/graphql/graphql.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    ...graphqlProvider
  ],
};
