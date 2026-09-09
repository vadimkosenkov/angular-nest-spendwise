import { inject, Injectable, WritableSignal } from "@angular/core";
import { DashboardService } from "./dashboard.service";
import { DashboardSummary } from "@spendwise/shared-types";
import { LoadingState } from "../../../shared/utils/loading-state";
import { signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DashboardStore {
  private readonly dashboardService: DashboardService = inject(DashboardService);
  private readonly state: LoadingState = new LoadingState();

  public readonly dashboard: WritableSignal<DashboardSummary | null> = signal(null);

  public loadDashboard(): void {
    this.state.execute(
      this.dashboardService.loadDashboard(),
      {
        next: (dashboard: DashboardSummary): void => {
          this.dashboard.set(dashboard);
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
