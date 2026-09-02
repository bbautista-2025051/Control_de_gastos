import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Role } from "../generated/prisma/client";
import { env } from "../config/env";
import { HttpError } from "../lib/errors";

export interface AuthPayload {
  userId: string;
  role: Role;
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    next(new HttpError(401, "Autenticación requerida."));
    return;
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, env.jwtSecret) as AuthPayload;
    req.auth = { userId: payload.userId, role: payload.role };
    next();
  } catch {
    next(new HttpError(401, "Token inválido o expirado."));
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      next(new HttpError(401, "Autenticación requerida."));
      return;
    }

    if (!roles.includes(req.auth.role)) {
      next(new HttpError(403, "No tienes permisos para esta operación."));
      return;
    }

    next();
  };
}