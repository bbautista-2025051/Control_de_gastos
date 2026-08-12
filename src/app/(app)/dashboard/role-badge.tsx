type Role = "ADMIN" | "USER";

const roleStyles: Record<Role, string> = {
  ADMIN:
    "bg-violet-500/10 text-violet-300 ring-violet-400/40 shadow-[0_0_16px_rgba(167,139,250,0.25)]",
  USER:
    "bg-cyan-500/10 text-cyan-300 ring-cyan-400/40 shadow-[0_0_16px_rgba(34,211,238,0.25)]",
};

const roleDots: Record<Role, string> = {
  ADMIN: "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.9)]",
  USER: "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]",
};

const roleLabels: Record<Role, string> = {
  ADMIN: "Administrador",
  USER: "Usuario",
};

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full border border-transparent px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider ring-1 ring-inset backdrop-blur ${roleStyles[role]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${roleDots[role]}`} />
      {roleLabels[role]}
    </span>
  );
}