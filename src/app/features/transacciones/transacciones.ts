import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from "../../core/auth.service";
import { ToastService } from "../../core/toast.service";
import {
  ExpensesService,
  type DashboardSummary,
  type ExpenseItem,
} from "../../core/expenses.service";

const money = (value: number): string =>
  new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
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
  "Otros": "violet",
};

const CATEGORY_ICONS: Record<string, string> = {
  "Salario": "wallet",
  "Alimentación": "cart",
  "Servicios": "bulb",
  "Transporte": "bus",
  "Salud": "health",
  "Vivienda": "home",
  "Educación": "book",
  "Ocio": "gamepad",
  "Ropa": "shirt",
  "Otros": "box",
};

interface KpiView {
  icon: "wallet" | "trend-up" | "trend-down" | "list";
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

type Filter = "ALL" | "INCOME" | "EXPENSE";

@Component({
  selector: "app-transacciones",
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: "./transacciones.html",
  styleUrl: "./transacciones.css",
})
export class Transacciones implements OnInit {
  private readonly toast = inject(ToastService);
  private readonly expenses = inject(ExpensesService);
  readonly auth = inject(AuthService);

  readonly user = this.auth.user;
  readonly summary = signal<DashboardSummary | null>(null);
  readonly transactions = signal<ExpenseItem[]>([]);
  loadError = false;

  readonly menuOpen = signal(false);
  readonly filter = signal<Filter>("ALL");
  search = "";
  loading = false;

  readonly tipo = signal<"INCOME" | "EXPENSE">("EXPENSE");
  amount = "";
  category = "Alimentación";
  description = "";
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
    "Salario",
    "Otros",
  ];

  readonly kpis = computed<KpiView[]>(() => {
    const data = this.summary();
    const count = this.transactions().length;
    const months = data?.monthly ?? [];
    const current = months[months.length - 1];
    const previous = months[months.length - 2];

    const balanceTrend = this.buildTrend(
      (current?.income ?? 0) - (current?.expense ?? 0),
      (previous?.income ?? 0) - (previous?.expense ?? 0)
    );
    const incomeTrend = this.buildTrend(
      current?.income ?? 0,
      previous?.income ?? 0
    );
    const expenseTrend = this.buildTrend(
      current?.expense ?? 0,
      previous?.expense ?? 0,
      true
    );

    return [
      {
        icon: "wallet",
        tone: "emerald",
        label: "Balance actual",
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
        icon: "list",
        tone: "violet",
        label: "Transacciones",
        value: `${count}`,
        arrow: null,
        arrowClass: "trend-info",
        percent: null,
        text: "Registradas este mes",
      },
    ];
  });

  readonly categories = computed<CategoryView[]>(() => {
    const raw = this.summary()?.categories ?? [];
    const selected = raw.slice(0, 5).map((item) => ({
      name: item.category,
      raw: item.amount,
      tone: CATEGORY_TONES[item.category] ?? "violet",
      percent: 0,
    }));
    for (const name of this.expenseCategories) {
      if (selected.length >= 5) {
        break;
      }
      if (!selected.some((item) => item.name === name)) {
        selected.push({ name, raw: 0, tone: CATEGORY_TONES[name] ?? "violet", percent: 0 });
      }
    }
    const total = Math.max(1, selected.reduce((sum, item) => sum + item.raw, 0));
    for (const item of selected) {
      item.percent = Math.round((item.raw / total) * 100);
    }
    return selected;
  });

  readonly filteredTransactions = computed<ExpenseItem[]>(() => {
    const query = this.search.trim().toLowerCase();
    return this.transactions().filter((item) => {
      if (query && !item.description.toLowerCase().includes(query)) {
        return false;
      }
      return true;
    });
  });

  readonly totalMonth = computed(() => {
    const data = this.summary();
    return (data?.incomeMonth ?? 0) + (data?.expenseMonth ?? 0);
  });

  ngOnInit(): void {
    this.auth.me().subscribe({
      error: () => {
        this.loadError = true;
      },
    });
    this.load();
  }

  load(): void {
    this.loading = true;
    const current = this.filter();
    const type =
      current === "ALL"
        ? undefined
        : (current as "INCOME" | "EXPENSE");
    this.expenses
      .list({ page: 1, limit: 50, type })
      .subscribe({
        next: (data) => {
          this.transactions.set(data.items);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.loadError = true;
        },
      });
    this.expenses.summary().subscribe({
      next: (data) => this.summary.set(data),
      error: () => {},
    });
  }

  setFilter(value: Filter): void {
    this.filter.set(value);
    this.load();
  }

  money(value: number): string {
    return money(value);
  }

  categoryIcon(category: string): string {
    return CATEGORY_ICONS[category] ?? "box";
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

  formatDate(value: string): string {
    const date = new Date(value);
    return date.toLocaleDateString("es-GT", {
      day: "2-digit",
      month: "short",
    });
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
    this.expenses
      .create({
        description: this.description.trim() || this.category,
        amount,
        type: this.tipo(),
        category: this.category,
        date: this.date ? new Date(this.date).toISOString() : undefined,
      })
      .subscribe({
        next: () => {
          this.toast.show("Transacción registrada correctamente.");
          this.amount = "";
          this.description = "";
          this.submitting = false;
          this.filter.set("ALL");
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
