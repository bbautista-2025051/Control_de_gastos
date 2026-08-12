const icons: Record<string, React.ReactNode> = {
  transacciones: (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
      />
    </svg>
  ),
  dashboard: (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
      />
    </svg>
  ),
  alerta: (
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
      />
    </svg>
  ),
};

const tileTones: Record<string, string> = {
  transacciones: "tile-emerald",
  dashboard: "tile-cyan",
  alerta: "tile-violet",
};

const iconKeys: Record<string, string> = {
  transacciones: "transacciones",
  dashboard: "dashboard",
  alerta: "alerta",
};

export function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <article className="glass-card group relative flex flex-col overflow-hidden p-6">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-cyan-500/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-60" />
      <div className={`icon-tile ${tileTones[icon]}`}>{icons[iconKeys[icon] ?? icon]}</div>
      <h3 className="mt-5 font-display text-base font-semibold text-slate-100">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">
        {description}
      </p>
      <span className="neon-chip mt-5 w-fit">Próximamente</span>
    </article>
  );
}