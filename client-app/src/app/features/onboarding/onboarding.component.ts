import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject, signal,
  ViewChild,
  WritableSignal
} from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { Router } from "@angular/router";

type SwiperElement = HTMLElement & {
  swiper?: {
    activeIndex: number;
    slideNext: () => void;
  };
};

type OnboardingSlide = {
  title: string;
  description: string;
  image: string;
};

@Component({
  selector: "app-onboarding",
  templateUrl: "./onboarding.component.html",
  styleUrls: ["./onboarding.component.scss"],
  host: { class: "ion-page" },
  imports: [IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnboardingComponent {
  @ViewChild("swiper")
  private swiper?: ElementRef<SwiperElement>;

  public router: Router = inject(Router);

  protected currentSlide: WritableSignal<number> = signal(0);

  protected slides: OnboardingSlide[] = [
    {
      title: "Track Expenses",
      image: "cash-outline",
      description: "Monitor your daily spending and stay in control of your finances"
    },
    {
      title: "Smart Analytics",
      image: "analytics-outline",
      description: "Get powerful insights and visualizations of your spending patterns"
    },
    {
      title: "Set Budgets",
      image: "cart-outline",
      description: "Create monthly budgets and stay on track with your financial goals"
    },
    {
      title: "Secure & Private",
      image: "finger-print-outline",
      description: "Your financial data is encrypted and protected with bank-level security"
    },
  ];

  public nextSlide(): void {
    if (this.isLastSlide()) {
      void this.router.navigateByUrl("/tabs/dashboard");
      return;
    }
    this.swiper?.nativeElement.swiper?.slideNext();
  }

  protected isLastSlide(): boolean {
    return this.currentSlide() === this.slides.length - 1;
  }

  public onSlideChange(): void {
    const activeIndex: number = this.swiper?.nativeElement.swiper?.activeIndex ?? 0;
    this.currentSlide.set(activeIndex);
  }
}
