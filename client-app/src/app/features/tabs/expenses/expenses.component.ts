import { ChangeDetectionStrategy, Component, inject, OnInit, WritableSignal } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ExpensesStore } from "./expenses.store";
import { ExpenseDto } from "@spendwise/shared-types";

@Component({
  selector: "app-expenses",
  templateUrl: "./expenses.component.html",
  styleUrls: ["./expenses.component.scss"],
  imports: [IonicModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpensesComponent implements OnInit {
  private readonly expensesStore: ExpensesStore = inject(ExpensesStore);

  protected readonly expenses: WritableSignal<ExpenseDto[]> = this.expensesStore.expenses;

  ngOnInit(): void {
    this.expensesStore.loadExpenses();
  }
}

