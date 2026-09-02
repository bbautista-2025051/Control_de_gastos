import { Component, computed, inject } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../core/auth.service";
import { MagneticButton } from "../../shared/magnetic-button/magnetic-button";
import { MouseSpotlight } from "../../shared/mouse-spotlight/mouse-spotlight";

const STRENGTH_META = [
  { label: "Muy débil", bar: "#f87171", text: "#f87171" },
  { label: "Débil", bar: "#fb923c", text: "#fdba74" },
  { label: "Media", bar: "#eab308", text: "#fde047" },
  { label: "Fuerte", bar: "#84cc16", text: "#bef264" },
  { label: "Muy fuerte", bar: "#34d399", text: "#6ee7b7" },
] as const;

@Component({
  selector: "app-login",
  imports: [ReactiveFormsModule, MouseSpotlight, MagneticButton],
  templateUrl: "./login.html",
  styleUrl: "./login.css",
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]],
  });

  errorMessage = "";
  pending = false;
  showPassword = false;

  readonly passwordScore = computed(() => {
    const value = this.password.value ?? "";
    if (!value) {
      return 0;
    }
    let score = 0;
    if (value.length >= 8) score++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^a-zA-Z0-9]/.test(value)) score++;
    return score;
  });

  readonly strengthMeta = computed(() =>
    this.passwordScore() > 0
      ? STRENGTH_META[this.passwordScore() - 1]
      : null
  );

  readonly strengthSegments = [1, 2, 3, 4];

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.errorMessage = "";
    this.pending = true;

    const email = this.email.value ?? "";
    const password = this.password.value ?? "";

    this.auth.login(email, password).subscribe({
      next: () => void this.router.navigate(["/dashboard"]),
      error: (err: HttpErrorResponse) => {
        this.pending = false;
        this.errorMessage =
          err.status === 0
            ? "No se pudo conectar con el servidor. Intenta de nuevo."
            : (err.error?.error as string | undefined) ??
              "Credenciales incorrectas.";
      },
    });
  }
}
