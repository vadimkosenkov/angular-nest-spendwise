import { gql } from "apollo-angular";


export const CREATE_EXPENSE = gql`
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      id
      amount
      currency
    }
  }
`;
