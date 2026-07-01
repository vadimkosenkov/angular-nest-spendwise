import { DocumentNode } from "graphql";
import { Apollo } from "apollo-angular";
import { map, Observable } from "rxjs";
import { FetchPolicy } from "@apollo/client/core";

export function executeQuery<TData, TResult>(
  apollo: Apollo,
  query: DocumentNode,
  mapFn: (data: TData) => TResult,
  fetchPolicy: FetchPolicy = "network-only"
): Observable<TResult> {
  return apollo
    .query<TData>({ query, fetchPolicy })
    .pipe(
      map((result) => {
        if (!result.data) {
          throw new Error("Query returned no data");
        }
        return mapFn(result.data);
      })
    );
}

export function executeMutation<TData, TVariables extends Record<string, unknown>>(
  apollo: Apollo,
  mutation: DocumentNode,
  variables: TVariables
): Observable<TData> {
  return apollo
    .mutate<TData>({ mutation, variables })
    .pipe(
      map((result) => {
        if (!result.data) {
          throw new Error("Mutation returned no data");
        }
        return result.data;
      })
    );
}
