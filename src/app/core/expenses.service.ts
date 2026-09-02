import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

export interface CategorySum {
  category: string;
  amount: number;
}

export interface MonthSum {
  label: string;
  income: number;
  expense: number;
}

export interface BudgetSummary {
  limit: number;
  spent: number;
  remaining: number;
  percent: number;
}

export interface BudgetAlert {
  category: string;
  percent: number;
  spent: number;
  limit: number;
}

export interface DashboardSummary {
  balance: number;
  incomeMonth: number;
  expenseMonth: number;
  budget: BudgetSummary;
  categories: CategorySum[];
  monthly: MonthSum[];
  alerts: BudgetAlert[];
}

@Injectable({ providedIn: "root" })
export class ExpensesService {
  private readonly http = inject(HttpClient);

  summary() {
    return this.http.get<DashboardSummary>("/api/expenses/summary");
  }
}