import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6">
      <div aria-hidden className="bg-scene">
        <div className="bg-grid" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="logo-tile h-14 w-14 rounded-2xl shadow-[0_0_34px_rgba(16,185,129,0.55)]">
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9"
              />
            </svg>
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-gradient">
            Control de Gastos
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Ingresa a tu cuenta para administrar tus finanzas personales y
            familiares
          </p>
        </div>

        <div className="glass-strong panel overflow-hidden rounded-2xl p-6 sm:p-8">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <div className="mt-6 glass rounded-xl border-cyan-400/20 p-4 text-xs leading-5 text-slate-300">
          <p className="flex items-center gap-2 font-semibold text-cyan-300">
            <span className="status-dot status-dot-cyan" />
            Cuentas de prueba
          </p>
          <p className="mt-2">
            Administrador:{" "}
            <code className="code-chip">admin@controlgastos.com</code>{" "}
            <span className="text-[var(--faint)]">/</span>{" "}
            <code className="code-chip">Admin123!</code>
          </p>
          <p className="mt-1.5">
            Usuario: <code className="code-chip">usuario@controlgastos.com</code>{" "}
            <span className="text-[var(--faint)]">/</span>{" "}
            <code className="code-chip">Usuario123!</code>
          </p>
        </div>
      </div>
    </div>
  );
}