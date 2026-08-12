import { z } from "zod";

// Categorías predefinidas de fábrica (plan: el usuario no puede crearlas, modificarlas ni eliminarlas)
export const EXPENSE_CATEGORIES = [
  "Alimentación",
  "Transporte",
  "Vivienda",
  "Servicios",
  "Salud",
  "Ocio",
  "Educación",
  "Ropa",
  "Salario",
  "Otros",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const createExpenseSchema = z.object({
  description: z
    .string({ error: "Ingresa una descripción." })
    .trim()
    .min(2, { error: "La descripción debe tener al menos 2 caracteres." })
    .max(200, { error: "La descripción no puede superar 200 caracteres." }),
  amount: z
    .number({ error: "Ingresa un monto." })
    .positive("El monto debe ser mayor a 0.")
    .multipleOf(0.01, "El monto no puede tener más de 2 decimales."),
  type: z.enum(["INCOME", "EXPENSE"]).default("EXPENSE"),
  category: z.enum(EXPENSE_CATEGORIES, {
    error: `Categoría inválida. Válidas: ${EXPENSE_CATEGORIES.join(", ")}.`,
  }),
  date: z.coerce.date({ error: "Fecha inválida." }).optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export const listExpensesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  category: z.enum(EXPENSE_CATEGORIES).optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type ListExpensesQuery = z.infer<typeof listExpensesSchema>;