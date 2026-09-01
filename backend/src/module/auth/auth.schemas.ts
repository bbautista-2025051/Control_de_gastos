import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email({ error: "Ingresa un correo electrónico válido." })
    .trim(),
  password: z
    .string({ error: "Ingresa tu contraseña." })
    .min(1, { error: "Ingresa tu contraseña." }),
});

export type LoginInput = z.infer<typeof loginSchema>;