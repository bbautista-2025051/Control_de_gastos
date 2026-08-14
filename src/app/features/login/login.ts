import { Component, inject } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../core/auth.service";

@Component({
  selector: "app-login",
  imports: [ReactiveFormsModule],
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
