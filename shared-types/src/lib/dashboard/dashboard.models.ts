export interface DashboardSummary {
  totalSpent: number;
  currency: string;
  remaining: number;
}

export interface DashboardQueryData {
  dashboard: DashboardSummary;
}
