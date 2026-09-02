import { Component, inject } from "@angular/core";
import { InactivityService } from "../../core/inactivity.service";
import { ToastService } from "../../core/toast.service";

@Component({
  selector: "app-session-toast",
  templateUrl: "./session-toast.html",
  styleUrl: "./session-toast.css",
})
export class SessionToast {
  readonly toast = inject(ToastService);
  readonly inactivity = inject(InactivityService);

  extendSession(): void {
    this.inactivity.extendSession();
  }
}
