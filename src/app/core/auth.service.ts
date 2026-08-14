import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import type { AuthUser, LoginResponse, MeResponse } from "./auth.models";

export const TOKEN_KEY = "auth_token";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly userSignal = signal<AuthUser | null>(null);
  readonly user = this.userSignal.asReadonly();

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>("/api/auth/login", { email, password })
      .pipe(
        tap(({ token, user }) => {
          localStorage.setItem(TOKEN_KEY, token);
          this.userSignal.set(user);
        })
      );
  }

  me(): Observable<MeResponse> {
    return this.http.get<MeResponse>("/api/auth/me").pipe(
      tap(({ user }) => this.userSignal.set(user))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.userSignal.set(null);
    void this.router.navigate(["/login"]);
  }
}
