import { inject, Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { CREATE_EXPENSE } from "./expenses.mutations";
import { CreateExpenseInput, CreateExpenseMutationData, ExpenseDto } from "@spendwise/shared-types";
import { map, Observable } from "rxjs";
import { ApolloClient } from "@apollo/client/core";

@Injectable({
  providedIn: "root",
})
export class ExpensesService {
  private apollo: Apollo = inject(Apollo);

  createExpense(input: CreateExpenseInput): Observable<ExpenseDto> {
    return this.apollo.mutate<CreateExpenseMutationData>({
      mutation: CREATE_EXPENSE,
      variables: { input }
    }).pipe(
      map((result: ApolloClient.MutateResult<CreateExpenseMutationData>): ExpenseDto => {
        if (!result.data) {
          throw new Error("Expense creation failed: no data returned");
        }
        return result.data.createExpense;
      })
    );
  }
}
