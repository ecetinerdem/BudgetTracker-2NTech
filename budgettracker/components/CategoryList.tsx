"use client";

import { useBudget } from "@/context/BudgetContext";
import { Progress } from "@/components/ui/progress";

export const CategoryList: React.FC = () => {
  const { categories, getCategoryExpenses, getCategoryIncome, deleteCategory } =
    useBudget();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Kategoriler</h2>
      <ul className="space-y-2">
        {categories.map((category) => {
          const amount =
            category.type === "expense"
              ? getCategoryExpenses(category.id)
              : getCategoryIncome(category.id);
          const percentage = (amount / category.budgetLimit) * 100;
          const isIncome = category.type === "income";
          const progressColor = isIncome ? "bg-green-500" : "bg-red-500";

          return (
            <li key={category.id} className="bg-secondary p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{category.name}</span>
                <span className={isIncome ? "text-green-500" : "text-red-500"}>
                  {isIncome ? "Gelir" : "Gider"}
                </span>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Sil
                </button>
              </div>
              <Progress value={percentage} className={progressColor} />
              <div className="flex justify-between text-sm mt-1">
                <span>
                  ₺{amount.toFixed(2)} / ₺{category.budgetLimit.toFixed(2)}
                </span>
                <span>{percentage.toFixed(0)}%</span>
              </div>
              {isIncome && percentage > 100 && (
                <p className="text-green-500 text-sm mt-1">
                  Kar oranı:{" "}
                  {(((percentage - 100) / 100) * category.budgetLimit).toFixed(
                    2
                  )}
                  ₺ ({(percentage - 100).toFixed(0)}%)
                </p>
              )}
              {!isIncome && percentage >= 80 && (
                <p className="text-yellow-500 text-sm mt-1">
                  Uyarı: Bütçe limitine yaklaşıyorsunuz!
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
