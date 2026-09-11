import { inject, Injectable, signal } from "@angular/core";
import { DashboardService } from "./dashboard.service";
import { DashboardSummary } from "@spendwise/shared-types";
import { LoadingState } from "../../../shared/utils/loading-state";

@Injectable({
  providedIn: "root",
})
export class DashboardStore {
  private readonly dashboardService = inject(DashboardService);
  private readonly state = new LoadingState();

  private readonly dashboardSignal = signal<DashboardSummary | null>(null);
  public readonly dashboard = this.dashboardSignal.asReadonly();

  public loadDashboard(): void {
    this.state.execute(
      this.dashboardService.loadDashboard(),
      {
        next: (dashboard: DashboardSummary): void => {
          this.dashboardSignal.set(dashboard);
        },
        error: (err: unknown): void => {
          console.error("[DashboardStore] loadDashboard failed:", err);
        },
      },
      "Failed to load dashboard",
      { global: true }
    );
  }
}
