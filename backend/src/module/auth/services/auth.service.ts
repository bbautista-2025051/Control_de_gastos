import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { env } from "../../../config/env";
import { HttpError } from "../../../lib/errors";
import type { AuthPayload } from "../../../middlewares/auth.middleware";
import type { LoginInput } from "../auth.schemas";

const TOKEN_EXPIRATION = "20m";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

export class AuthService {
  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        passwordHash: true,
      },
    });

    const isValid =
      user && (await bcrypt.compare(input.password, user.passwordHash));

    if (!user || !isValid) {
      throw new HttpError(401, "Credenciales incorrectas.");
    }

    if (!user.isActive) {
      throw new HttpError(403, "Tu cuenta está desactivada.");
    }

    const payload: AuthPayload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, env.jwtSecret, {
      expiresIn: TOKEN_EXPIRATION,
    });

    const { passwordHash: _passwordHash, isActive: _isActive, ...safeUser } = user;
    void _passwordHash;
    void _isActive;

    return { token, user: safeUser };
  }

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: publicUserSelect,
    });

    if (!user) {
      throw new HttpError(404, "Usuario no encontrado.");
    }

    return user;
  }
}