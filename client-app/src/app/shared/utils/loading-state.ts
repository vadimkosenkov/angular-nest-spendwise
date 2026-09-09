import { inject, signal, WritableSignal } from "@angular/core";
import { Observable, finalize } from "rxjs";
import { GlobalLoadingService } from "../../core/loading/global-loading.service";

export type LoadingStateOptions = {
  global?: boolean;
};

export class LoadingState {
  private readonly globalLoading: GlobalLoadingService = inject(GlobalLoadingService);
  public readonly loading: WritableSignal<boolean> = signal(false);
  public readonly error: WritableSignal<string> = signal("");

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

    this.loading.set(true);
    this.error.set("");
    if (useGlobalOverlay) {
      this.globalLoading.show();
    }

    source$
      .pipe(
        finalize((): void => {
          this.loading.set(false);
          if (useGlobalOverlay) {
            this.globalLoading.hide();
          }
        })
      )
      .subscribe({
        next: handlers.next,
        error: (error: unknown): void => {
          this.error.set(errorMessage);
          handlers.error?.(error);
        },
      });
  }
}
