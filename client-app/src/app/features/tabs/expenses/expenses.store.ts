import { inject, Injectable, signal } from "@angular/core";
import { ExpensesService } from "./expenses.service";
import { LoadingState } from "../../../shared/utils/loading-state";
import { ExpenseDto } from "@spendwise/shared-types";

@Injectable({
  providedIn: "root",
})
export class ExpensesStore {
  private readonly expensesService = inject(ExpensesService);
  private readonly state = new LoadingState();

  private readonly expensesSignal = signal<ExpenseDto[]>([]);
  public readonly expenses = this.expensesSignal.asReadonly();

  loadExpenses(): void {
    this.state.execute(
      this.expensesService.getExpenses(),
      {
        next: (expenses: ExpenseDto[]) => {
          this.expensesSignal.set(expenses);
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
