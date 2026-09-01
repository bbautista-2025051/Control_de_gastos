import { Component, ElementRef, HostListener, inject } from "@angular/core";

@Component({
  selector: "app-mouse-spotlight",
  template: `<ng-content />`,
  styles: [
    `
      :host {
        position: relative;
        display: block;
        overflow: hidden;
        border-radius: 1.25rem;
        --mx: 50%;
        --my: 50%;
      }

      :host::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background: radial-gradient(
          360px circle at var(--mx) var(--my),
          rgba(16, 185, 129, 0.16),
          transparent 72%
        );
      }

      :host > * {
        position: relative;
        z-index: 1;
      }
    `,
  ],
})
export class MouseSpotlight {
  private readonly el = inject(ElementRef<HTMLElement>);

  @HostListener("mousemove", ["$event"])
  onMove(event: MouseEvent): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    this.el.nativeElement.style.setProperty("--mx", `${x}%`);
    this.el.nativeElement.style.setProperty("--my", `${y}%`);
  }
}
