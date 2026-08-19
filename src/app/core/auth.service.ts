import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import type { AuthUser, LoginResponse, MeResponse } from "./auth.models";
import { ToastService } from "./toast.service";

export const TOKEN_KEY = "auth_token";

const EXPIRED_MESSAGE = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private logoutTimer: ReturnType<typeof setTimeout> | null = null;

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
          this.scheduleLogout(token);
        })
      );
  }

  me(): Observable<MeResponse> {
    return this.http.get<MeResponse>("/api/auth/me").pipe(
      tap(({ user }) => {
        this.userSignal.set(user);
        const token = this.token;
        if (token) {
          this.scheduleLogout(token);
        }
      })
    );
  }

  logout(): void {
    this.clearLogoutTimer();
    localStorage.removeItem(TOKEN_KEY);
    this.userSignal.set(null);
    void this.router.navigate(["/login"]);
  }

  private scheduleLogout(token: string): void {
    this.clearLogoutTimer();
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiresAt = payload.exp * 1000;
      const now = Date.now();
      const delay = expiresAt - now;

      if (delay <= 0) {
        this.toast.show(EXPIRED_MESSAGE);
        this.logout();
        return;
      }

      this.logoutTimer = setTimeout(() => {
        this.toast.show(EXPIRED_MESSAGE);
        this.logout();
      }, delay);
    } catch {
      this.logout();
    }
  }

  private clearLogoutTimer(): void {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }
}
