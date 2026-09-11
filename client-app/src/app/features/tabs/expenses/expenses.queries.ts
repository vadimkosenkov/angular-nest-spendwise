import { gql } from "apollo-angular";

export const GET_EXPENSES = gql`
  query GetExpenses {
    expenses {
      id
      amount
      currency
    }
  }
`;
