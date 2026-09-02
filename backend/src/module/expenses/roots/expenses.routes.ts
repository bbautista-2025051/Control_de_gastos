import { Router } from "express";
import { ExpensesController } from "../controller/expenses.controller";
import { ExpensesService } from "../services/expenses.service";
import { createExpenseSchema, updateExpenseSchema } from "../expenses.schemas";
import { requireAuth } from "../../../middlewares/auth.middleware";
import { validate } from "../../../lib/validate";

export function expensesRoutes(): Router {
  const router = Router();
  const expensesService = new ExpensesService();
  const expensesController = new ExpensesController(expensesService);

  router.use(requireAuth);

  router.get("/", expensesController.list);
  router.get("/:id", expensesController.getById);
  router.post("/", validate(createExpenseSchema), expensesController.create);
  router.patch("/:id", validate(updateExpenseSchema), expensesController.update);
  router.delete("/:id", expensesController.remove);

  return router;
}