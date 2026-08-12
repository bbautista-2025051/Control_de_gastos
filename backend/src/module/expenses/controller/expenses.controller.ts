import type { NextFunction, Request, Response } from "express";
import type { ExpensesService } from "../services/expenses.service";
import { listExpensesSchema } from "../expenses.schemas";

function paramId(req: Request): string {
  return String(req.params.id);
}

export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = listExpensesSchema.parse(req.query);
      const result = await this.expensesService.list(req.auth!, query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const expense = await this.expensesService.getById(req.auth!, paramId(req));
      res.json({ expense });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const expense = await this.expensesService.create(req.auth!, req.body);
      res.status(201).json({ expense });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const expense = await this.expensesService.update(
        req.auth!,
        paramId(req),
        req.body
      );
      res.json({ expense });
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.expensesService.remove(req.auth!, paramId(req));
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}