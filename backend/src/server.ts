import { createApp } from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";

const app = createApp();

const server = app.listen(env.port, () => {
  console.log(`API de Control de Gastos escuchando en http://localhost:${env.port}`);
});

async function shutdown(signal: string) {
  console.log(`\nRecibida señal ${signal}. Cerrando servidor...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));