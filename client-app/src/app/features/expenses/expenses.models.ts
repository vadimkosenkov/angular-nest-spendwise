export interface CreateExpenseInput {
  amount: number;
  currency: string;
}

export interface CreateExpenseResponse {
  createExpense: {
    id: string;
    amount: number;
    currency: string;
  };
}
