export interface CreateExpenseInput {
  amount: number;
  currency: string;
}

export interface CreateExpenseMutationData {
  createExpense: ExpenseDto;
}

export interface ExpenseDto {
  id: string;
  amount: number;
  currency: string;
}