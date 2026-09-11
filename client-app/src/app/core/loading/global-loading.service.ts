import { inject, Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular/standalone";

@Injectable({
  providedIn: "root",
})
export class GlobalLoadingService {
  private readonly loadingController = inject(LoadingController);
  private count = 0;
  private loadingElement: HTMLIonLoadingElement | null = null;
  private operationQueue: Promise<void> = Promise.resolve();

  show(): void {
    this.count++;
    this.enqueue();
  }

  hide(): void {
    this.count = Math.max(0, this.count - 1);
    this.enqueue();
  }

  private enqueue(): void {
    this.operationQueue = this.operationQueue
      .then(() => this.reconcile())
      .catch((error: unknown): void => {
        console.error("[GlobalLoadingService] failed to reconcile overlay state:", error);
      });
  }

  private async reconcile(): Promise<void> {
    if (this.count > 0 && !this.loadingElement) {
      const element = await this.loadingController.create({
        message: "Loading...",
      });

      if (this.count <= 0) {
        return;
      }

      this.loadingElement = element;
      await element.present();
      return;
    }

    if (this.count <= 0 && this.loadingElement) {
      const element = this.loadingElement;
      this.loadingElement = null;
      await element.dismiss();
    }
  }
}
