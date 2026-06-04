import { signal, WritableSignal } from "@angular/core";
import { Observable, finalize } from "rxjs";

export class LoadingState {
  readonly loading: WritableSignal<boolean> = signal(false);
  readonly error: WritableSignal<string> = signal("");

  execute<T>(
    source$: Observable<T>,
    handlers: {
      next: (value: T) => void;
      error?: (message: string) => void;
    },
    errorMessage = "An unexpected error occurred"
  ): void {
    this.loading.set(true);
    this.error.set("");

    source$
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: handlers.next,
        error: (): void => {
          if (handlers.error) {
            handlers.error(errorMessage);
          } else {
            this.error.set(errorMessage);
          }
        },
      });
  }
}
