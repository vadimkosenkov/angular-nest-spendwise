import { inject, Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { CREATE_EXPENSE } from "./expenses.mutations";
import { CreateExpenseInput, CreateExpenseMutationData } from "@spendwise/shared-types";
import { Observable } from "rxjs";
import { ApolloClient } from "@apollo/client/core";

@Injectable({
  providedIn: "root",
})
export class ExpensesService {
  private apollo: Apollo = inject(Apollo);

  createExpense(input: CreateExpenseInput): Observable<ApolloClient.MutateResult<CreateExpenseMutationData>> {
    return this.apollo.mutate<CreateExpenseMutationData>({
      mutation: CREATE_EXPENSE,
      variables: { input }
    });
  }
}
