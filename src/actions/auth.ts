"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";

export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
};

const LoginFormSchema = z.object({
  email: z.email({ error: "Ingresa un correo electrónico válido." }).trim(),
  password: z
    .string({ error: "Ingresa tu contraseña." })
    .min(1, { error: "Ingresa tu contraseña." }),
});

const apiUrl = process.env.API_URL;

export async function login(
  state: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  let response: Response;
  try {
    response = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return { message: "No se pudo conectar con el servidor. Intenta de nuevo." };
  }

  const data = (await response.json()) as
    | { token: string; user: { role: string; isActive: boolean } }
    | { error: string };

  if (!response.ok || !("token" in data)) {
    const message = "error" in data ? data.error : "Credenciales incorrectas.";
    return { message };
  }

  await createSession(data.token);

  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}