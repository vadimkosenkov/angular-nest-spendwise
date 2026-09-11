import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ExpensesStore } from "./expenses.store";

@Component({
  selector: "app-expenses",
  templateUrl: "./expenses.component.html",
  styleUrls: ["./expenses.component.scss"],
  imports: [IonicModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpensesComponent implements OnInit {
  private readonly expensesStore = inject(ExpensesStore);

  protected readonly expenses = this.expensesStore.expenses;

  ngOnInit(): void {
    this.expensesStore.loadExpenses();
  }
}
