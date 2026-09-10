import { ChangeDetectionStrategy, Component, inject, WritableSignal } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ExpensesService } from "../expenses.service";
import { DashboardStore } from "../../dashboard/dashboard.store";
import { Currency } from "@spendwise/shared-types";
import { LoadingState } from "../../../../shared/utils/loading-state";
import { getFieldErrorMessage } from "../../../../shared/utils/form-validation";
import { ExpensesStore } from "../expenses.store";

type ExpenseForm = {
  amount: FormControl<number | null>;
  currency: FormControl<Currency>;
};

@Component({
  selector: "app-expense-form",
  templateUrl: "./expense-form.component.html",
  styleUrls: ["./expense-form.component.scss"],
  imports: [IonicModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpenseFormComponent {
  private readonly expensesService: ExpensesService = inject(ExpensesService);
  private readonly dashboardStore: DashboardStore = inject(DashboardStore);
  private readonly expensesStore: ExpensesStore = inject(ExpensesStore);
  private readonly state: LoadingState = new LoadingState();
  protected readonly currencies: Currency[] = Object.values(Currency);

  protected readonly expenseForm: FormGroup<ExpenseForm> = new FormGroup<ExpenseForm>({
    amount: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0.01)] }),
    currency: new FormControl<Currency>(Currency.USD, {
      validators: [Validators.required], nonNullable: true })
  });

  protected readonly loading: WritableSignal<boolean> = this.state.loading;
  protected readonly error: WritableSignal<string> = this.state.error;

  submit(): void {
    if (this.disableSubmit()) return;

    const { amount, currency } = this.expenseForm.getRawValue();
    if (amount === null) return;

    this.state.execute(
      this.expensesService.createExpense({ amount, currency }),
      {
        next: (): void => {
          this.expenseForm.controls.amount.reset(null);
          this.dashboardStore.loadDashboard();
          this.expensesStore.loadExpenses();
        },
        error: (err: unknown): void => {
          console.error("[ExpenseForm] createExpense failed:", err);
        },
      },
      "Failed to create expense",
      { global: true }
    );
  }

  disableSubmit(): boolean {
    return this.loading() || this.expenseForm.invalid;
  }

  getAmountErrorMessage(): string {
    return getFieldErrorMessage(this.expenseForm.get("amount"), [
      { error: "required", message: "Amount is required" },
      { error: "min", message: "Amount must be a positive number" },
    ]);
  }
}
