import { inject, Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { CREATE_EXPENSE } from "./expenses.mutations";
import { CreateExpenseInput, CreateExpenseMutationData } from "@spendwise/shared-types";
import { Observable } from "rxjs";
import { executeMutation } from "../../../shared/utils/graphql.helpers";

@Injectable({
  providedIn: "root",
})
export class ExpensesService {
  private apollo: Apollo = inject(Apollo);

  createExpense(input: CreateExpenseInput): Observable<CreateExpenseMutationData> {
    return executeMutation<CreateExpenseMutationData, { input: CreateExpenseInput }>(
      this.apollo,
      CREATE_EXPENSE,
      { input }
    );
  }
}
