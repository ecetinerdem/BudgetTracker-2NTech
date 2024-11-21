"use client";

import { useBudget } from "@/context/BudgetContext";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const IncomeChart: React.FC = () => {
  const { transactions, categories } = useBudget();

  const incomeByCategory = categories
    .filter((category) => category.type === "income")
    .map((category) => {
      const totalIncome = transactions
        .filter((t) => t.type === "income" && t.category === category.id)
        .reduce((sum, t) => sum + t.amount, 0);
      return { category: category.name, amount: totalIncome };
    })
    .filter((item) => item.amount > 0);

  const data = {
    labels: incomeByCategory.map((item) => item.category),
    datasets: [
      {
        data: incomeByCategory.map((item) => item.amount),
        backgroundColor: [
          "#4BC0C0",
          "#FF9F40",
          "#9966FF",
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
        ],
      },
    ],
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gelir Dağılımı</h2>
      <Pie data={data} />
    </div>
  );
};
