import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { TOKEN_KEY } from "./auth.service";

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const hasToken = Boolean(localStorage.getItem(TOKEN_KEY));

  return hasToken ? true : router.createUrlTree(["/login"]);
};
