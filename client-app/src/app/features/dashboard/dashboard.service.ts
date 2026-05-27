import { inject, Injectable } from '@angular/core';
import { DashboardQueryData, DashboardSummary } from "@spendwise/shared-types";
import { GET_DASHBOARD } from './dashboard.queries';
import { Apollo } from "apollo-angular";
import QueryResult = Apollo.QueryResult;
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private apollo: Apollo = inject(Apollo);

  loadDashboard(): Observable<DashboardSummary> {
    return this.apollo
      .query<DashboardQueryData>({
        query: GET_DASHBOARD,
        fetchPolicy: "network-only",
      })
      .pipe(
        map((result: QueryResult<DashboardQueryData>): DashboardSummary => {
          if (!result.data) {
            throw new Error("Dashboard data is missing");
          }
          return result.data.dashboard;
        })
      );
  }
}
