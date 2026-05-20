import { Component, effect, inject, WritableSignal } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { DashboardService } from "./services/dashboard.service";
import { DashboardSummary } from "./models/dashboard.models";
import { ExpenseFormComponent } from "../expenses/expense-form/expense-form.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [IonicModule, ExpenseFormComponent],
  providers: [DashboardService]
})
export class DashboardPage {
  private dashboardService: DashboardService = inject(DashboardService);

  public dashboard: WritableSignal<DashboardSummary | null> = this.dashboardService.dashboard;
  public loading: WritableSignal<boolean> = this.dashboardService.loading;
  public error: WritableSignal<string> = this.dashboardService.error;

  constructor() {
    effect((): void => {
      this.dashboardService.loadDashboard();
    });
  }
}

