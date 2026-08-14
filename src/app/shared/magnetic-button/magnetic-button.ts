import { Component, ElementRef, HostListener, inject } from "@angular/core";

@Component({
  selector: "app-magnetic-button",
  template: `<ng-content />`,
  styles: [
    `
      :host {
        display: block;
        will-change: transform;
        transition: transform 0.25s ease;
      }

      :host > * {
        display: flex;
        width: 100%;
      }
    `,
  ],
})
export class MagneticButton {
  private readonly el = inject(ElementRef<HTMLElement>);

  @HostListener("mousemove", ["$event"])
  onMove(event: MouseEvent): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);
    this.el.nativeElement.style.transform = `translate3d(${relX * 0.28}px, ${
      relY * 0.28
    }px, 0)`;
  }

  @HostListener("mouseleave")
  onLeave(): void {
    this.el.nativeElement.style.transform = "translate3d(0, 0, 0)";
  }
}
