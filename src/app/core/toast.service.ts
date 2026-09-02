import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ToastService {
  readonly visible = signal(false);
  readonly message = signal("");

  private timeout: ReturnType<typeof setTimeout> | null = null;

  show(message: string): void {
    this.clearTimer();
    this.message.set(message);
    this.visible.set(true);
    this.timeout = setTimeout(() => this.hide(), 6000);
  }

  hide(): void {
    this.clearTimer();
    this.visible.set(false);
  }

  private clearTimer(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }
}