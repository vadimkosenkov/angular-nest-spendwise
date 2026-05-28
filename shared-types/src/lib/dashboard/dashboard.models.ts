import { Currency } from "../common/currency.enum";

export interface DashboardSummary {
  totalSpent: number;
  currency: Currency;
  remaining: number;
}

export interface DashboardQueryData {
  dashboard: DashboardSummary;
}
