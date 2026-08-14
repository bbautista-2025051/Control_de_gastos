import { HttpInterceptorFn } from "@angular/common/http";
import { TOKEN_KEY } from "./auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return next(req);
  }

  const authorized = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authorized);
};
