"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import { MagneticButton } from "@/components/magnetic-button";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div>
        <label htmlFor="email" className="field-label">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="tucorreo@ejemplo.com"
          className="neon-input"
        />
        {state?.errors?.email && (
          <p className="mt-1.5 text-xs font-medium text-red-300">
            {state.errors.email.join(", ")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="field-label">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="neon-input"
        />
        {state?.errors?.password && (
          <p className="mt-1.5 text-xs font-medium text-red-300">
            {state.errors.password.join(", ")}
          </p>
        )}
      </div>

      {state?.message && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.message}
        </div>
      )}

      <MagneticButton
        type="submit"
        disabled={pending}
        className="neon-btn w-full"
      >
        {pending ? "Ingresando..." : "Ingresar"}
      </MagneticButton>
    </form>
  );
}