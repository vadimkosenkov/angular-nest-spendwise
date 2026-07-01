import { inject, Injectable } from '@angular/core';
import { DashboardQueryData, DashboardSummary } from "@spendwise/shared-types";
import { GET_DASHBOARD } from './dashboard.queries';
import { Apollo } from "apollo-angular";
import { Observable } from "rxjs";
import { executeQuery } from "../../../shared/utils/graphql.helpers";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private apollo: Apollo = inject(Apollo);

  loadDashboard(): Observable<DashboardSummary> {
    return executeQuery<DashboardQueryData, DashboardSummary>(
      this.apollo,
      GET_DASHBOARD,
      (data) => data.dashboard
    );
  }
}
