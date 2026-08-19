import { Component, OnInit, inject } from "@angular/core";
import { AuthService } from "../../core/auth.service";
import type { AuthUser } from "../../core/auth.models";

const esMonths = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

interface Feature {
  icon: "transacciones" | "dashboard" | "alerta";
  title: string;
  description: string;
}

@Component({
  selector: "app-dashboard",
  imports: [],
  templateUrl: "./dashboard.html",
  styleUrl: "./dashboard.css",
})
export class Dashboard implements OnInit {
  private readonly auth = inject(AuthService);

  readonly user = this.auth.user;

  loadError = false;

  readonly features: Feature[] = [
    {
      icon: "transacciones",
      title: "Registro de transacciones",
      description:
        "Crea y administra tus ingresos y gastos con categorías, montos y notas.",
    },
    {
      icon: "dashboard",
      title: "Reportes y estadísticas",
      description:
        "Visualiza gráficas y resúmenes de tus finanzas por mes, categoría y más.",
    },
    {
      icon: "alerta",
      title: "Alertas y presupuestos",
      description:
        "Define presupuestos y recibe notificaciones cuando te acerques al límite.",
    },
  ];

  ngOnInit(): void {
    this.auth.me().subscribe({
      error: () => {
        this.loadError = true;
      },
    });
  }

  logout(): void {
    this.auth.logout();
  }

  roleLabel(role: AuthUser["role"]): string {
    return role === "ADMIN" ? "Administrador" : "Usuario";
  }

  formatDate(iso: string | undefined): string {
    if (!iso) {
      return "—";
    }
    const date = new Date(iso);
    return `${date.getDate()} de ${esMonths[date.getMonth()]} de ${date.getFullYear()}`;
  }
}
