import { inject, Injectable, signal, WritableSignal } from "@angular/core";
import { DashboardService } from "./dashboard.service";
import { DashboardSummary } from "@spendwise/shared-types";
import { finalize } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DashboardStore {
  private dashboardService: DashboardService = inject(DashboardService);
  public dashboard: WritableSignal<DashboardSummary | null> = signal(null);
  public loading: WritableSignal<boolean> = signal(false);
  public error: WritableSignal<string> = signal("");

  public loadDashboard(): void {
    this.loading.set(true);
    this.error.set("");

    this.dashboardService.loadDashboard()
      .pipe(
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe({
        next: (dashboard: DashboardSummary): void => {
          this.dashboard.set(dashboard);
        },
        error: (err: unknown): void => {
          this.error.set("Failed to load dashboard");
          console.error("[DashboardStore] loadDashboard failed:", err);
        }
      });
  }
}