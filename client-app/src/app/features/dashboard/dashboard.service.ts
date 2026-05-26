import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { DashboardQueryData, DashboardSummary } from "@spendwise/shared-types";
import { GET_DASHBOARD } from './dashboard.queries';
import { Apollo } from "apollo-angular";
import QueryResult = Apollo.QueryResult;

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private apollo: Apollo = inject(Apollo);

  dashboard: WritableSignal<DashboardSummary | null> = signal(null);
  loading: WritableSignal<boolean> = signal(false);
  error: WritableSignal<string> = signal("");

  loadDashboard(): void {
    this.loading.set(true);
    this.error.set("");

    this.apollo.query<DashboardQueryData>({query: GET_DASHBOARD})
      .subscribe({
        next: (result: QueryResult<DashboardQueryData>): void => {
          if (!result?.data) return;
          this.dashboard.set(result.data.dashboard);
        },
        error: (): void => {
          this.error.set("Failed to load dashboard");
        },
        complete: (): void => {
          this.loading.set(false);
        }
      });
  }
}
