import { inject, Injectable, signal, WritableSignal } from "@angular/core";
import { ExpensesService } from "./expenses.service";
import { LoadingState } from "../../../shared/utils/loading-state";
import { ExpenseDto } from "@spendwise/shared-types";

@Injectable({
  providedIn: "root",
})
export class ExpensesStore {
  private readonly expensesService: ExpensesService = inject<ExpensesService>(ExpensesService);
  private readonly state: LoadingState = new LoadingState();

  public readonly expenses: WritableSignal<ExpenseDto[]> = signal<ExpenseDto[]>([]);

  loadExpenses(): void {
    this.state.execute(
      this.expensesService.getExpenses(),
      {
        next: (expenses: ExpenseDto[]) => {
          this.expenses.set(expenses);
        },
        error: (err: unknown): void => {
          console.error("[ExpensesStore] getExpenses failed:", err);
        },
      },
      "Failed to load expenses",
      { global: true }
    );
  }
}