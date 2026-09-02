import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
import { AuthService } from "../services/auth.service";
import { loginSchema } from "../auth.schemas";
import { requireAuth } from "../../../middlewares/auth.middleware";
import { validate } from "../../../lib/validate";

export function authRoutes(): Router {
  const router = Router();
  const authService = new AuthService();
  const authController = new AuthController(authService);

  router.post("/login", validate(loginSchema), authController.login);
  router.get("/me", requireAuth, authController.me);
  router.post("/logout", requireAuth, authController.logout);

  return router;
}