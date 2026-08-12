import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { registerAuthModule } from "./module/auth/modules/auth.module";
import { registerExpensesModule } from "./module/expenses/modules/expenses.module";
import { errorHandler, notFoundHandler } from "./lib/errors";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigin,
      methods: ["GET", "POST", "PATCH", "DELETE"],
    })
  );
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "control-de-gastos-backend" });
  });

  registerAuthModule(app);
  registerExpensesModule(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}