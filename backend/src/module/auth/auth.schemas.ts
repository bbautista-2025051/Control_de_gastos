import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email({ error: "Ingresa un correo electrónico válido." })
    .trim(),
  password: z
    .string({ error: "Ingresa su contraseña." })
    .min(1, { error: "Ingresa su contraseña." }),
});

export type LoginInput = z.infer<typeof loginSchema>;