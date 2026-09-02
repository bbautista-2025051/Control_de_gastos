import type { Role } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";
import { HttpError } from "../../../lib/errors";
import type {
  CreateExpenseInput,
  ListExpensesQuery,
  UpdateExpenseInput,
} from "../expenses.schemas";

const expenseSelect = {
  id: true,
  description: true,
  amount: true,
  type: true,
  category: true,
  date: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class ExpensesService {
  isAdmin(role: Role) {
    return role === "ADMIN";
  }

  async list(actor: { userId: string; role: Role }, query: ListExpensesQuery) {
    const { page, limit, category, type, from, to } = query;

    const where = {
      ...(this.isAdmin(actor.role) ? {} : { userId: actor.userId }),
      ...(category ? { category } : {}),
      ...(type ? { type } : {}),
      ...(from || to
        ? { date: { gte: from, lte: to } }
        : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.expense.findMany({
        where,
        select: expenseSelect,
        orderBy: { date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.expense.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async getById(actor: { userId: string; role: Role }, id: string) {
    const expense = await prisma.expense.findUnique({
      where: { id },
      select: expenseSelect,
    });

    if (!expense || (!this.isAdmin(actor.role) && expense.userId !== actor.userId)) {
      throw new HttpError(404, "Registro no encontrado.");
    }

    return expense;
  }

  async create(actor: { userId: string }, input: CreateExpenseInput) {
    return prisma.expense.create({
      data: {
        description: input.description,
        amount: input.amount,
        type: input.type,
        category: input.category,
        date: input.date,
        userId: actor.userId,
      },
      select: expenseSelect,
    });
  }

  async update(
    actor: { userId: string; role: Role },
    id: string,
    input: UpdateExpenseInput
  ) {
    const existing = await this.getById(actor, id);

    return prisma.expense.update({
      where: { id: existing.id },
      data: input,
      select: expenseSelect,
    });
  }

  async remove(actor: { userId: string; role: Role }, id: string) {
    const existing = await this.getById(actor, id);
    await prisma.expense.delete({ where: { id: existing.id } });
    return { message: "Registro eliminado." };
  }
}