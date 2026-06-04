import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from "@angular/core";
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
import { finalize } from "rxjs";

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
  private expensesService: ExpensesService = inject(ExpensesService);
  private dashboardStore: DashboardStore = inject(DashboardStore);
  protected readonly currencies: Currency[] = Object.values(Currency);

  protected expenseForm: FormGroup<ExpenseForm> = new FormGroup<ExpenseForm>({
    amount: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0.01)],
    }),
    currency: new FormControl<Currency>(Currency.USD, { validators: [Validators.required], nonNullable: true }),
  });

  loading: WritableSignal<boolean> = signal(false);
  error: WritableSignal<string> = signal("");

  submit(): void {
    if (this.disableSubmit()) return;

    const { amount, currency } = this.expenseForm.getRawValue();
    if (amount === null) return;

    this.loading.set(true);
    this.error.set("");

    this.expensesService.createExpense({
      amount,
      currency
    })
      .pipe(finalize(() => {
        this.loading.set(false);
      }))
      .subscribe({
        next: (): void => {
          this.expenseForm.controls.amount.reset(null);
          this.dashboardStore.loadDashboard();
        },
        error: (err: unknown): void => {
          const message = err instanceof Error ? err.message : "Failed to create expense";
          this.error.set(message);
          console.error("[ExpenseForm] createExpense failed:", err);
        },
      });
  }

  disableSubmit(): boolean {
    return this.loading() || this.expenseForm.invalid;
  }

  getAmountErrorMessage(): string {
    const control = this.expenseForm.get("amount");
    if (!control || control.valid || control.untouched) {
      return "";
    }

    if (control?.hasError("required")) {
      return "Amount is required";
    }
    if (control?.hasError('min')) {
      return "Amount must be a positive number";
    }
    return "";
  }
}
