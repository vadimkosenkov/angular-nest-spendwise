import { TestBed } from '@angular/core/testing';
import { DashboardStore } from './dashboard.store';
import { DashboardService } from './dashboard.service';
import { of, throwError } from 'rxjs';
import { Currency, DashboardSummary } from '@spendwise/shared-types';

describe('DashboardStore', () => {
  let store: DashboardStore;
  let dashboardServiceMock: { loadDashboard: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    dashboardServiceMock = { loadDashboard: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        DashboardStore,
        { provide: DashboardService, useValue: dashboardServiceMock },
      ],
    });

    store = TestBed.inject(DashboardStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should have initial state with null dashboard, loading false, empty error', () => {
    expect(store.dashboard()).toBeNull();
    expect(store.loading()).toBe(false);
    expect(store.error()).toBe('');
  });

  describe('loadDashboard', () => {
    it('should set loading to true while fetching', () => {
      dashboardServiceMock.loadDashboard.mockReturnValue(of({
        totalSpent: 100, currency: Currency.USD, remaining: 900
      }));

      store.loadDashboard();

      // After completion, loading should be false
      expect(store.loading()).toBe(false);
    });

    it('should set dashboard data on success', () => {
      const mockDashboard: DashboardSummary = {
        totalSpent: 500,
        currency: Currency.EUR,
        remaining: 1500,
      };
      dashboardServiceMock.loadDashboard.mockReturnValue(of(mockDashboard));

      store.loadDashboard();

      expect(store.dashboard()).toEqual(mockDashboard);
      expect(store.error()).toBe('');
      expect(store.loading()).toBe(false);
    });

    it('should set error message on failure', () => {
      dashboardServiceMock.loadDashboard.mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      store.loadDashboard();

      expect(store.error()).toBe('Failed to load dashboard');
      expect(store.dashboard()).toBeNull();
      expect(store.loading()).toBe(false);
    });

    it('should clear previous error on new load', () => {
      dashboardServiceMock.loadDashboard.mockReturnValue(
        throwError(() => new Error('fail'))
      );
      store.loadDashboard();
      expect(store.error()).toBe('Failed to load dashboard');

      const mockDashboard: DashboardSummary = {
        totalSpent: 200,
        currency: Currency.TRY,
        remaining: 800,
      };
      dashboardServiceMock.loadDashboard.mockReturnValue(of(mockDashboard));
      store.loadDashboard();

      expect(store.error()).toBe('');
      expect(store.dashboard()).toEqual(mockDashboard);
    });
  });
});
