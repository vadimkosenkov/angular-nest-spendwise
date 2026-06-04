import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Currency } from '@spendwise/shared-types';

type ExpenseForm = {
  amount: FormControl<number | null>;
  currency: FormControl<Currency>;
};

function createExpenseForm(): FormGroup<ExpenseForm> {
  return new FormGroup<ExpenseForm>({
    amount: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0.01)],
    }),
    currency: new FormControl<Currency>(Currency.USD, {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
}

function getAmountErrorMessage(form: FormGroup<ExpenseForm>): string {
  const control = form.get('amount');
  if (!control || control.valid || control.untouched) {
    return '';
  }
  if (control.hasError('required')) {
    return 'Amount is required';
  }
  if (control.hasError('min')) {
    return 'Amount must be a positive number';
  }
  return '';
}

function disableSubmit(form: FormGroup<ExpenseForm>, loading: boolean): boolean {
  return loading || form.invalid;
}

describe('ExpenseFormComponent logic', () => {
  let form: FormGroup<ExpenseForm>;

  beforeEach(() => {
    form = createExpenseForm();
  });

  describe('form validation', () => {
    it('should have an invalid form initially (amount is null)', () => {
      expect(form.invalid).toBe(true);
    });

    it('should be valid when amount is positive and currency is set', () => {
      form.controls.amount.setValue(10);
      expect(form.valid).toBe(true);
    });

    it('should be invalid when amount is 0', () => {
      form.controls.amount.setValue(0);
      expect(form.controls.amount.valid).toBe(false);
    });

    it('should be invalid when amount is negative', () => {
      form.controls.amount.setValue(-5);
      expect(form.controls.amount.valid).toBe(false);
    });

    it('should accept minimum positive value (0.01)', () => {
      form.controls.amount.setValue(0.01);
      expect(form.controls.amount.valid).toBe(true);
    });

    it('should default currency to USD', () => {
      expect(form.controls.currency.value).toBe(Currency.USD);
    });

    it('should accept all defined currencies', () => {
      for (const currency of Object.values(Currency)) {
        form.controls.currency.setValue(currency);
        expect(form.controls.currency.valid).toBe(true);
      }
    });
  });

  describe('disableSubmit', () => {
    it('should return true when form is invalid', () => {
      expect(disableSubmit(form, false)).toBe(true);
    });

    it('should return false when form is valid and not loading', () => {
      form.controls.amount.setValue(10);
      expect(disableSubmit(form, false)).toBe(false);
    });

    it('should return true when loading even if form is valid', () => {
      form.controls.amount.setValue(10);
      expect(disableSubmit(form, true)).toBe(true);
    });

    it('should return true when both invalid and loading', () => {
      expect(disableSubmit(form, true)).toBe(true);
    });
  });

  describe('getAmountErrorMessage', () => {
    it('should return empty string when control is untouched', () => {
      expect(getAmountErrorMessage(form)).toBe('');
    });

    it('should return "Amount is required" when touched and empty', () => {
      form.controls.amount.markAsTouched();
      expect(getAmountErrorMessage(form)).toBe('Amount is required');
    });

    it('should return "Amount must be a positive number" when value is 0', () => {
      form.controls.amount.setValue(0);
      form.controls.amount.markAsTouched();
      expect(getAmountErrorMessage(form)).toBe('Amount must be a positive number');
    });

    it('should return "Amount must be a positive number" when value is negative', () => {
      form.controls.amount.setValue(-1);
      form.controls.amount.markAsTouched();
      expect(getAmountErrorMessage(form)).toBe('Amount must be a positive number');
    });

    it('should return empty string when value is valid', () => {
      form.controls.amount.setValue(5);
      form.controls.amount.markAsTouched();
      expect(getAmountErrorMessage(form)).toBe('');
    });
  });
});
