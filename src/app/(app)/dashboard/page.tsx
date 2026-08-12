import { getUser, verifySession } from "@/lib/dal";
import { RoleBadge } from "./role-badge";
import { FeatureCard } from "./feature-card";

const upcomingFeatures = [
  {
    title: "Registro de transacciones",
    description:
      "Registra tus ingresos y egresos con categorías predefinidas (alimentación, transporte, vivienda, etc.).",
    icon: "transacciones",
  },
  {
    title: "Dashboard financiero",
    description:
      "Indicadores en tiempo real: balance total, gastos por categoría y comparativa mensual.",
    icon: "dashboard",
  },
  {
    title: "Alertas de presupuesto",
    description:
      "Recibe alertas cuando te acerques al presupuesto mensual de cada categoría.",
    icon: "alerta",
  },
] as const;

export default async function DashboardPage() {
  await verifySession();
  const user = await getUser();

  if (!user) {
    return (
      <p className="text-sm text-red-300">
        No se pudo cargar tu información de usuario.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/90">
            Panel de control
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="text-gradient">Hola, {user.name}</span>
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Accediste como{" "}
            <span className="font-medium text-slate-200">{user.email}</span>
          </p>
        </div>
        <RoleBadge role={user.role} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <article className="glass-card relative overflow-hidden p-6">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            <span className="status-dot status-dot-emerald" />
            Estado de la cuenta
          </p>
          <p className="mt-3 font-display text-xl font-semibold text-gradient">
            Sesión activa
          </p>
          <p className="mt-1.5 text-xs text-[var(--faint)]">
            Vigencia de 7 días
          </p>
        </article>

        <article className="glass-card relative overflow-hidden p-6">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl" />
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            <span className="status-dot status-dot-cyan" />
            Rol asignado
          </p>
          <p className="mt-3 font-display text-xl font-semibold capitalize text-slate-100">
            {user.role === "ADMIN" ? "Administrador" : "Usuario"}
          </p>
          <p className="mt-1.5 text-xs text-[var(--faint)]">
            {user.role === "ADMIN"
              ? "Gestión completa del aplicativo"
              : "Uso personal y familiar"}
          </p>
        </article>

        <article className="glass-card relative overflow-hidden p-6">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl" />
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            <span className="status-dot status-dot-violet" />
            Miembro desde
          </p>
          <p className="mt-3 font-display text-xl font-semibold text-slate-100">
            {new Intl.DateTimeFormat("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(user.createdAt))}
          </p>
          <p className="mt-1.5 text-xs text-[var(--faint)]">
            Fecha de alta de tu cuenta
          </p>
        </article>
      </div>

      <section>
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-xl font-semibold text-slate-100">
            Próximas funcionalidades
          </h2>
          <p className="text-sm text-[var(--muted)]">
            El proyecto avanza por fases. Estas son las funcionalidades que se
            implementarán próximamente.
          </p>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>
    </div>
  );
}