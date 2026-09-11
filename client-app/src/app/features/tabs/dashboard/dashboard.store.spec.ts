import { TestBed } from '@angular/core/testing';
import { DashboardStore } from './dashboard.store';
import { DashboardService } from './dashboard.service';
import { of, throwError } from 'rxjs';
import { Currency, DashboardSummary } from '@spendwise/shared-types';
import { GlobalLoadingService } from '../../../core/loading/global-loading.service';

describe('DashboardStore', () => {
  let store: DashboardStore;
  let dashboardServiceMock: { loadDashboard: ReturnType<typeof vi.fn> };
  let globalLoadingMock: { show: ReturnType<typeof vi.fn>; hide: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    dashboardServiceMock = { loadDashboard: vi.fn() };
    globalLoadingMock = { show: vi.fn(), hide: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        DashboardStore,
        { provide: DashboardService, useValue: dashboardServiceMock },
        { provide: GlobalLoadingService, useValue: globalLoadingMock },
      ],
    });

    store = TestBed.inject(DashboardStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should have initial state with null dashboard', () => {
    expect(store.dashboard()).toBeNull();
  });

  describe('loadDashboard', () => {
    it('should show and hide the global loading overlay while fetching', () => {
      dashboardServiceMock.loadDashboard.mockReturnValue(of({
        totalSpent: 100, currency: Currency.USD, remaining: 900
      }));

      store.loadDashboard();

      expect(globalLoadingMock.show).toHaveBeenCalled();
      expect(globalLoadingMock.hide).toHaveBeenCalled();
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
    });

    it('should keep dashboard null on failure', () => {
      dashboardServiceMock.loadDashboard.mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      store.loadDashboard();

      expect(store.dashboard()).toBeNull();
    });

    it('should update dashboard on a subsequent successful load after a failure', () => {
      dashboardServiceMock.loadDashboard.mockReturnValue(
        throwError(() => new Error('fail'))
      );
      store.loadDashboard();
      expect(store.dashboard()).toBeNull();

      const mockDashboard: DashboardSummary = {
        totalSpent: 200,
        currency: Currency.TRY,
        remaining: 800,
      };
      dashboardServiceMock.loadDashboard.mockReturnValue(of(mockDashboard));
      store.loadDashboard();

      expect(store.dashboard()).toEqual(mockDashboard);
    });
  });
});
