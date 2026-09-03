import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { Apollo } from 'apollo-angular';
import { of, throwError, firstValueFrom } from 'rxjs';
import { Currency } from '@spendwise/shared-types';
import { GET_DASHBOARD } from './dashboard.queries';

describe('DashboardService', () => {
  let service: DashboardService;
  let apolloMock: { query: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    apolloMock = { query: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        DashboardService,
        { provide: Apollo, useValue: apolloMock },
      ],
    });

    service = TestBed.inject(DashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call apollo.query with GET_DASHBOARD and network-only policy', () => {
    apolloMock.query.mockReturnValue(of({
      data: {
        dashboard: { totalSpent: 100, currency: Currency.USD, remaining: 900 }
      }
    }));

    service.loadDashboard().subscribe();

    expect(apolloMock.query).toHaveBeenCalledWith({
      query: GET_DASHBOARD,
      fetchPolicy: 'network-only',
    });
  });

  it('should map the response to DashboardSummary', async () => {
    const mockDashboard = { totalSpent: 250, currency: Currency.EUR, remaining: 750 };
    apolloMock.query.mockReturnValue(of({ data: { dashboard: mockDashboard } }));

    const result = await firstValueFrom(service.loadDashboard());
    expect(result).toEqual(mockDashboard);
  });

  it('should throw an error when data is missing', async () => {
    apolloMock.query.mockReturnValue(of({ data: null }));

    await expect(firstValueFrom(service.loadDashboard())).rejects.toThrow('Dashboard data is missing');
  });

  it('should propagate apollo errors', async () => {
    const apolloError = new Error('Network error');
    apolloMock.query.mockReturnValue(throwError(() => apolloError));

    await expect(firstValueFrom(service.loadDashboard())).rejects.toThrow('Network error');
  });
});
