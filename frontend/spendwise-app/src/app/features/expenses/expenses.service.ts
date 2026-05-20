import { inject, Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { CREATE_EXPENSE } from "./expenses.mutations";
import { CreateExpenseInput, CreateExpenseResponse } from "./expenses.models";

@Injectable({
  providedIn: "root",
})
export class ExpensesService {
  private apollo: Apollo = inject(Apollo);

  createExpense(input: CreateExpenseInput) {
    return this.apollo.mutate<CreateExpenseResponse>({
      mutation: CREATE_EXPENSE,
      variables: { input }
    });
  }
}
