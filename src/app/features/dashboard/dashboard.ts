import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../core/auth.service";
import { ToastService } from "../../core/toast.service";
import {
  ExpensesService,
  type DashboardSummary,
  type MonthSum,
} from "../../core/expenses.service";

const money = (value: number): string =>
  new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
  }).format(value);

const moneyNoDecimals = (value: number): string =>
  new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    maximumFractionDigits: 0,
  }).format(value);

const CATEGORY_TONES: Record<string, string> = {
  "Alimentación": "emerald",
  "Transporte": "cyan",
  "Vivienda": "violet",
  "Servicios": "amber",
  "Salud": "red",
  "Ocio": "emerald",
  "Educación": "cyan",
  "Ropa": "violet",
  "Salario": "emerald",
  "Otros": "amber",
};

const DESIGN_CATEGORIES = [
  "Alimentación",
  "Transporte",
  "Vivienda",
  "Servicios",
  "Salud",
  "Ocio",
];

interface KpiView {
  icon: "wallet" | "trend-up" | "trend-down" | "percent";
  tone: "emerald" | "cyan" | "red" | "violet";
  label: string;
  value: string;
  arrow: "up" | "down" | null;
  arrowClass: string;
  percent: number | null;
  text: string;
}

interface Trend {
  arrow: "up" | "down" | null;
  arrowClass: string;
  percent: number | null;
}

interface CategoryView {
  name: string;
  raw: number;
  tone: string;
  percent: number;
}

@Component({
  selector: "app-dashboard",
  imports: [FormsModule],
  templateUrl: "./dashboard.html",
  styleUrl: "./dashboard.css",
})
export class Dashboard implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);
  private readonly expenses = inject(ExpensesService);
  readonly auth = inject(AuthService);

  readonly user = this.auth.user;
  readonly summary = signal<DashboardSummary | null>(null);
  loadError = false;

  readonly tipo = signal<"INCOME" | "EXPENSE">("INCOME");
  readonly menuOpen = signal(false);
  amount = "";
  category = "Alimentación";
  date = new Date().toISOString().slice(0, 10);
  submitting = false;

  readonly expenseCategories = [
    "Alimentación",
    "Transporte",
    "Vivienda",
    "Servicios",
    "Salud",
    "Ocio",
    "Educación",
    "Ropa",
    "Otros",
  ];

  readonly kpis = computed<KpiView[]>(() => {
    const data = this.summary();
    const months = data?.monthly ?? [];
    const current = months[months.length - 1];
    const previous = months[months.length - 2];
    const budget = data?.budget;

    const incomeTrend = this.buildTrend(
      current?.income ?? 0,
      previous?.income ?? 0
    );
    const expenseTrend = this.buildTrend(
      current?.expense ?? 0,
      previous?.expense ?? 0,
      true
    );
    const balanceTrend = this.buildTrend(
      (current?.income ?? 0) - (current?.expense ?? 0),
      (previous?.income ?? 0) - (previous?.expense ?? 0)
    );

    return [
      {
        icon: "wallet",
        tone: "emerald",
        label: "Balance total",
        value: money(data?.balance ?? 0),
        ...balanceTrend,
        text: "vs mes anterior",
      },
      {
        icon: "trend-up",
        tone: "cyan",
        label: "Ingresos del mes",
        value: money(data?.incomeMonth ?? 0),
        ...incomeTrend,
        text: "vs mes anterior",
      },
      {
        icon: "trend-down",
        tone: "red",
        label: "Gastos del mes",
        value: money(data?.expenseMonth ?? 0),
        ...expenseTrend,
        text: "vs mes anterior",
      },
      {
        icon: "percent",
        tone: "violet",
        label: "Presupuesto restante",
        value: `${budget?.percent ?? 0}%`,
        arrow: (budget?.remaining ?? 0) > 0 ? "up" : null,
        arrowClass: (budget?.remaining ?? 0) > 0 ? "trend-up" : "trend-info",
        percent: null,
        text: `${moneyNoDecimals(budget?.remaining ?? 0)} disponibles`,
      },
    ];
  });

  readonly categories = computed<CategoryView[]>(() => {
    const raw = this.summary()?.categories ?? [];
    const selected = raw.slice(0, 6).map((item) => ({
      name: item.category,
      raw: item.amount,
      tone: CATEGORY_TONES[item.category] ?? "violet",
      percent: 0,
    }));
    for (const name of DESIGN_CATEGORIES) {
      if (selected.length >= 6) {
        break;
      }
      if (!selected.some((item) => item.name === name)) {
        selected.push({ name, raw: 0, tone: CATEGORY_TONES[name] ?? "violet", percent: 0 });
      }
    }
    const max = Math.max(0, ...selected.map((item) => item.raw));
    for (const item of selected) {
      item.percent = max > 0 ? Math.round((item.raw / max) * 100) : 0;
    }
    return selected;
  });

  readonly alerts = computed(() => this.summary()?.alerts ?? []);

  readonly chart = computed<MonthSum[]>(() => this.summary()?.monthly ?? []);

  ngOnInit(): void {
    this.auth.me().subscribe({
      error: () => {
        this.loadError = true;
      },
    });
    this.load();
  }

  load(): void {
    this.expenses.summary().subscribe({
      next: (data) => this.summary.set(data),
      error: () => {
        this.loadError = true;
      },
    });
  }

  money(value: number): string {
    return money(value);
  }

  chartMax(): number {
    return Math.max(0, ...this.chart().flatMap((m) => [m.income, m.expense]));
  }

  barHeight(value: number): number {
    const max = this.chartMax();
    return max > 0 ? (value / max) * 100 : 0;
  }

  private buildTrend(current: number, previous: number, invert = false): Trend {
    if (previous <= 0 && current <= 0) {
      return { arrow: null, arrowClass: "trend-info", percent: null };
    }
    if (previous <= 0) {
      return { arrow: "up", arrowClass: "trend-up", percent: null };
    }
    const percent = Math.round(((current - previous) / previous) * 100);
    const positive = current - previous >= 0;
    const good = invert ? !positive : positive;
    return {
      arrow: positive ? "up" : "down",
      arrowClass: good ? "trend-up" : "trend-down",
      percent,
    };
  }

  initials(name: string | undefined): string {
    if (!name) {
      return "FB";
    }
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase() || "US";
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  settings(): void {
    this.menuOpen.set(false);
    this.toast.show("Los ajustes de la cuenta estarán disponibles próximamente.");
  }

  setTipo(value: "INCOME" | "EXPENSE"): void {
    this.tipo.set(value);
  }

  submit(): void {
    const amount = Number(this.amount);
    if (!amount || amount <= 0) {
      this.toast.show("Ingresa un monto válido.");
      return;
    }
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    this.http
      .post("/api/expenses", {
        description: this.category,
        amount,
        type: this.tipo(),
        category: this.category,
        date: this.date ? new Date(this.date) : undefined,
      })
      .subscribe({
        next: () => {
          this.toast.show("Transacción registrada correctamente.");
          this.amount = "";
          this.submitting = false;
          this.load();
        },
        error: () => {
          this.toast.show("No se pudo registrar la transacción.");
          this.submitting = false;
        },
      });
  }

  logout(): void {
    this.auth.logout();
  }
}