"use client";

import { useBudget } from "@/context/BudgetContext";

export const BudgetSummary: React.FC = () => {
  const { getMonthlyTransactions } = useBudget();

  const monthlyTransactions = getMonthlyTransactions();
  const totalIncome = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="bg-secondary p-4 rounded-lg mb-6">
      <h2 className="text-2xl font-bold mb-4">Aylık Özet</h2>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-muted-foreground">Toplam Gelir</p>
          <p className="text-lg font-semibold text-green-500">
            ₺{totalIncome.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Toplam Gider</p>
          <p className="text-lg font-semibold text-red-500">
            ₺{totalExpenses.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Bakiye</p>
          <p
            className={`text-lg font-semibold ${
              balance >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            ₺{balance.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};
