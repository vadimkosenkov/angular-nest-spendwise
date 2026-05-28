import { Currency } from "../common/currency.enum";

export interface CreateExpenseInput {
  amount: number;
  currency: Currency;
}

export interface CreateExpenseMutationData {
  createExpense: ExpenseDto;
}

export interface ExpenseDto {
  id: string;
  amount: number;
  currency: Currency;
}