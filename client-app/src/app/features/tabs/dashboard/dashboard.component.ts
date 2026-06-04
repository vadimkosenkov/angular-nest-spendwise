import { ChangeDetectionStrategy, Component, effect, inject, WritableSignal } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { DashboardSummary } from "@spendwise/shared-types";
import { ExpenseFormComponent } from "../expenses/expense-form/expense-form.component";
import { FormatCurrencyPipe } from "../../../shared/pipes/format-currency.pipe";
import { DashboardStore } from "./dashboard.store";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [IonicModule, ExpenseFormComponent, FormatCurrencyPipe],
  providers: [DashboardStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private dashboardStore: DashboardStore = inject(DashboardStore);

  public dashboard: WritableSignal<DashboardSummary | null> = this.dashboardStore.dashboard;
  public loading: WritableSignal<boolean> = this.dashboardStore.loading;
  public error: WritableSignal<string> = this.dashboardStore.error;

  constructor() {
    effect((): void => {
      this.dashboardStore.loadDashboard();
    });
  }
}
