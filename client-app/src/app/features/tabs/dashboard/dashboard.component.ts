import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { ExpenseFormComponent } from "../expenses/expense-form/expense-form.component";
import { FormatCurrencyPipe } from "../../../shared/pipes/format-currency.pipe";
import { DashboardStore } from "./dashboard.store";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [IonicModule, ExpenseFormComponent, FormatCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private readonly dashboardStore = inject(DashboardStore);

  protected readonly dashboard = this.dashboardStore.dashboard;

  ngOnInit() {
    this.dashboardStore.loadDashboard();
  }
}
