"use client";

import { useBudget } from "@/context/BudgetContext";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const ExpenseChart: React.FC = () => {
  const { transactions, categories } = useBudget();

  const expensesByCategory = categories
    .filter((category) => category.type === "expense")
    .map((category) => {
      const totalExpense = transactions
        .filter((t) => t.type === "expense" && t.category === category.id)
        .reduce((sum, t) => sum + t.amount, 0);
      return { category: category.name, amount: totalExpense };
    })
    .filter((item) => item.amount > 0);

  const data = {
    labels: expensesByCategory.map((item) => item.category),
    datasets: [
      {
        data: expensesByCategory.map((item) => item.amount),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gider Dağılımı</h2>
      <Pie data={data} />
    </div>
  );
};
