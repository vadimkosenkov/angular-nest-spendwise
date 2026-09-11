import { inject, signal } from "@angular/core";
import { Observable, finalize } from "rxjs";
import { GlobalLoadingService } from "../../core/loading/global-loading.service";

export type LoadingStateOptions = {
  global?: boolean;
};

export class LoadingState {
  // Only call `new LoadingState()` from a field initializer (e.g.`private readonly state = new LoadingState();`).
  // Never from inside a method — inject() below only works while Angular is still constructing the surrounding class.
  // Elsewhere, it throws NG0203.
  private readonly globalLoading = inject(GlobalLoadingService);

  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal("");

  public readonly loading = this.loadingSignal.asReadonly();
  public readonly error = this.errorSignal.asReadonly();

  execute<T>(
    source$: Observable<T>,
    handlers: {
      next: (value: T) => void;
      error?: (error: unknown) => void;
    },
    errorMessage = "An unexpected error occurred",
    options: LoadingStateOptions = {}
  ): void {
    const useGlobalOverlay: boolean = options.global ?? false;

    this.loadingSignal.set(true);
    this.errorSignal.set("");
    if (useGlobalOverlay) {
      this.globalLoading.show();
    }

    source$
      .pipe(
        finalize((): void => {
          this.loadingSignal.set(false);
          if (useGlobalOverlay) {
            this.globalLoading.hide();
          }
        })
      )
      .subscribe({
        next: handlers.next,
        error: (error: unknown): void => {
          this.errorSignal.set(errorMessage);
          handlers.error?.(error);
        },
      });
  }
}
