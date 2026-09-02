import type { Router } from "express";
import { expensesRoutes } from "../roots/expenses.routes";

export const expensesModule = {
  path: "/api/expenses",
  routes: expensesRoutes(),
};

export function registerExpensesModule(rootRouter: Router): void {
  rootRouter.use(expensesModule.path, expensesModule.routes);
}