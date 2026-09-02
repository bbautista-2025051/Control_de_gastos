import type { Router } from "express";
import { authRoutes } from "../roots/auth.routes";

export const authModule = {
  path: "/api/auth",
  routes: authRoutes(),
};

export { authRoutes };

export type AuthModule = typeof authModule;

// Conveniencia para registry de módulos en app.ts
export function registerAuthModule(rootRouter: Router): void {
  rootRouter.use(authModule.path, authModule.routes);
}