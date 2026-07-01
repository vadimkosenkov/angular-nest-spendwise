import { inject, Injectable, WritableSignal } from "@angular/core";
import { DashboardService } from "./dashboard.service";
import { DashboardSummary } from "@spendwise/shared-types";
import { LoadingState } from "../../../shared/utils/loading-state";
import { signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DashboardStore {
  private dashboardService: DashboardService = inject(DashboardService);
  private state: LoadingState = new LoadingState();

  public dashboard: WritableSignal<DashboardSummary | null> = signal(null);
  public loading: WritableSignal<boolean> = this.state.loading;
  public error: WritableSignal<string> = this.state.error;

  public loadDashboard(): void {
    this.state.execute(
      this.dashboardService.loadDashboard(),
      {
        next: (dashboard: DashboardSummary): void => {
          this.dashboard.set(dashboard);
        },
      },
      "Failed to load dashboard"
    );
  }
}
