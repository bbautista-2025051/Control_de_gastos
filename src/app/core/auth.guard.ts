import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { TOKEN_KEY } from "./auth.service";

function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token || !isTokenValid(token)) {
    localStorage.removeItem(TOKEN_KEY);
    alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
    return router.createUrlTree(["/login"]);
  }

  return true;
};
