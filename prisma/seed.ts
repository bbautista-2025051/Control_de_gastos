import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "../backend/src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const users = [
  {
    name: "Administrador",
    email: "admin@controlgastos.com",
    password: "Admin123!",
    role: Role.ADMIN,
  },
  {
    name: "Usuario Demo",
    email: "usuario@controlgastos.com",
    password: "Usuario123!",
    role: Role.USER,
  },
];

const sampleExpenses = [
  {
    description: "Supermercado semanal",
    amount: 85.5,
    type: "EXPENSE",
    category: "Alimentación",
  },
  {
    description: "Gasolina",
    amount: 40.0,
    type: "EXPENSE",
    category: "Transporte",
  },
  {
    description: "Recibo de electricidad",
    amount: 55.2,
    type: "EXPENSE",
    category: "Servicios",
  },
  {
    description: "Salario mensual",
    amount: 1500.0,
    type: "INCOME",
    category: "Salario",
  },
] as const;

async function main() {
  console.log("Cargando usuarios de prueba...");

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        passwordHash: await bcryptHash(user.password),
        role: user.role,
      },
    });
  }

  console.log("Usuarios creados:");
  for (const user of users) {
    console.log(`  - ${user.email} (${user.role}) / contraseña: ${user.password}`);
  }

  const demoUser = await prisma.user.findUnique({
    where: { email: "usuario@controlgastos.com" },
  });

  if (demoUser) {
    const count = await prisma.expense.count();
    if (count === 0) {
      for (const expense of sampleExpenses) {
        await prisma.expense.create({
          data: {
            description: expense.description,
            amount: expense.amount,
            type: expense.type,
            category: expense.category,
            date: new Date(),
            userId: demoUser.id,
          },
        });
      }
      console.log(`Gastos de ejemplo creados (${sampleExpenses.length}) para ${demoUser.email}`);
    } else {
      console.log(`Ya existen ${count} registros de gastos; no se crearon ejemplos.`);
    }
  }
}

async function bcryptHash(password: string): Promise<string> {
  const bcrypt = await import("bcryptjs");
  return bcrypt.hash(password, 12);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });