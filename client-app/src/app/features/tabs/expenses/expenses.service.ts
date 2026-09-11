import { inject, Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { CREATE_EXPENSE } from "./expenses.mutations";
import { CreateExpenseInput, CreateExpenseMutationData, ExpenseDto } from "@spendwise/shared-types";
import { Observable } from "rxjs";
import { executeMutation, executeQuery } from "../../../shared/utils/graphql.helpers";
import { GET_EXPENSES } from "./expenses.queries";

@Injectable({
  providedIn: "root",
})
export class ExpensesService {
  private readonly apollo = inject(Apollo);

  createExpense(input: CreateExpenseInput): Observable<ExpenseDto> {
    return executeMutation<CreateExpenseMutationData, { input: CreateExpenseInput }, ExpenseDto>(
      this.apollo,
      CREATE_EXPENSE,
      { input },
      (data) => data.createExpense,
      "Expense creation failed: no data returned"
    );
  }

  getExpenses(): Observable<ExpenseDto[]> {
    return executeQuery<{ expenses: ExpenseDto[] }, ExpenseDto[]>(
      this.apollo,
      GET_EXPENSES,
      (data) => data.expenses,
      "Failed to load expenses"
    );
  }
}
