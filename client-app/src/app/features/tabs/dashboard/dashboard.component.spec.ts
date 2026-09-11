import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Currency } from '@spendwise/shared-types';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';
import { ExpensesService } from '../expenses/expenses.service';
import { GlobalLoadingService } from '../../../core/loading/global-loading.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DashboardService,
          useValue: { loadDashboard: () => of({ totalSpent: 0, currency: Currency.USD, remaining: 0 }) },
        },
        { provide: ExpensesService, useValue: { createExpense: vi.fn() } },
        { provide: GlobalLoadingService, useValue: { show: vi.fn(), hide: vi.fn() } },
      ],
    });

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
