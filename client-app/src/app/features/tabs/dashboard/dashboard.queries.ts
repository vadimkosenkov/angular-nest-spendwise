import { gql } from 'apollo-angular';

export const GET_DASHBOARD = gql`
  query GetDashboard {
    dashboard {
      totalSpent
      currency
      remaining
    }
  }
`;
