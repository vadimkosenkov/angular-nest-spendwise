import { TestBed } from '@angular/core/testing';
import { ExpensesService } from './expenses.service';
import { Apollo } from 'apollo-angular';
import { of, firstValueFrom } from 'rxjs';
import { Currency } from '@spendwise/shared-types';
import { CREATE_EXPENSE } from './expenses.mutations';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let apolloMock: { mutate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    apolloMock = { mutate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        ExpensesService,
        { provide: Apollo, useValue: apolloMock },
      ],
    });

    service = TestBed.inject(ExpensesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call apollo.mutate with CREATE_EXPENSE and input variables', () => {
    const input = { amount: 42.5, currency: Currency.USD };
    apolloMock.mutate.mockReturnValue(of({
      data: { createExpense: { id: '1', amount: 42.5, currency: Currency.USD } }
    }));

    service.createExpense(input).subscribe();

    expect(apolloMock.mutate).toHaveBeenCalledWith({
      mutation: CREATE_EXPENSE,
      variables: { input },
    });
  });

  it('should return the mutation result observable', async () => {
    const input = { amount: 10, currency: Currency.EUR };
    const mockResult = {
      data: { createExpense: { id: '2', amount: 10, currency: Currency.EUR } }
    };
    apolloMock.mutate.mockReturnValue(of(mockResult));

    const result = await firstValueFrom(service.createExpense(input));
    expect(result).toEqual(mockResult);
  });
});
