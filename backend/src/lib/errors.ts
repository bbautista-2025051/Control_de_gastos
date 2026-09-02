import type { NextFunction, Request, Response } from "express";

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "JsonWebTokenError"
  ) {
    res.status(401).json({ error: "Token inválido o expirado." });
    return;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    error.statusCode === 400 &&
    "type" in error &&
    error.type === "entity.parse.failed"
  ) {
    res.status(400).json({ error: "Cuerpo de la solicitud inválido." });
    return;
  }

  console.error("Error no controlado:", error);
  res.status(500).json({ error: "Error interno del servidor." });
}