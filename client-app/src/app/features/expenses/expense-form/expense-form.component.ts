import { Component, inject, signal, WritableSignal } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { ExpensesService } from "../expenses.service";

@Component({
  selector: "app-expense-form",
  templateUrl: "./expense-form.component.html",
  styleUrls: ["./expense-form.component.scss"],
  imports: [IonicModule, FormsModule],
})
export class ExpenseFormComponent {
  private expensesService: ExpensesService = inject(ExpensesService);

  amount: WritableSignal<number | null> = signal(null);
  currency: WritableSignal<string> = signal("EUR");
  loading: WritableSignal<boolean> = signal(false);

  submit(): void {
    if (!this.amount()) return;

    this.loading.set(true);

    this.expensesService.createExpense({
        amount: this.amount()!,
        currency: this.currency(),
      })
      .subscribe({
        next: () => {
          this.amount.set(null);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }
}
