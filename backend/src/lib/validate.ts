import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";
import { HttpError } from "./errors";

export function validate<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const messages = result.error.issues
        .map((issue) => issue.message)
        .join(" | ");
      next(new HttpError(400, messages || "Datos inválidos."));
      return;
    }

    req.body = result.data;
    next();
  };
}