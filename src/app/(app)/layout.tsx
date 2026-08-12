import { logout } from "@/actions/auth";
import { verifySession } from "@/lib/dal";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await verifySession();

  return (
    <div className="flex min-h-full flex-col">
      <div aria-hidden className="bg-scene">
        <div className="bg-grid" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <header className="glass-nav">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="logo-tile">
              <svg
                className="h-5 w-5"
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
            <span className="font-display text-lg font-bold tracking-tight text-gradient">
              Control de Gastos
            </span>
          </div>

          <form action={logout}>
            <button type="submit" className="btn-ghost">
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        {children}
      </main>

      <footer className="relative border-t border-[var(--line)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
        <p className="py-6 text-center text-xs tracking-wide text-[var(--faint)]">
          Control de Gastos <span className="text-emerald-400/80">·</span> Uso
          personal y familiar
        </p>
      </footer>
    </div>
  );
}