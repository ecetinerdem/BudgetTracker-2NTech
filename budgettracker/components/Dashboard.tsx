"use client";

import { useState, useEffect } from "react";
import { useBudget } from "@/context/BudgetContext";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { CategoryForm } from "./CategoryForm";
import { CategoryList } from "./CategoryList";
import { BudgetSummary } from "./BudgetSummary";
import { ExpenseChart } from "./ExpenseChart";
import { IncomeChart } from "./IncomeChart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"transactions" | "categories">(
    "transactions"
  );
  const { checkBudgetLimits, categories } = useBudget();
  const [warnings, setWarnings] = useState<
    { categoryId: string; percentage: number }[]
  >([]);

  useEffect(() => {
    setWarnings(checkBudgetLimits());
  }, [checkBudgetLimits]);

  return (
    <div className="space-y-6 dark:bg-gray-800">
      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map(({ categoryId, percentage }) => {
            const category = categories.find((c) => c.id === categoryId);
            return (
              <Alert
                variant="destructive"
                key={categoryId}
                className="dark:bg-red-900 dark:text-white"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Bütçe Uyarısı</AlertTitle>
                <AlertDescription>
                  {category?.name} kategorisinde bütçe limitinin{" "}
                  {percentage.toFixed(0)}%'ine ulaştınız!
                </AlertDescription>
              </Alert>
            );
          })}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <button
              className={`mr-2 px-4 py-2 rounded ${
                activeTab === "transactions"
                  ? "bg-primary text-primary-foreground dark:bg-blue-600 dark:text-white"
                  : "bg-secondary dark:bg-gray-700 dark:text-gray-200"
              }`}
              onClick={() => setActiveTab("transactions")}
            >
              İşlemler
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "categories"
                  ? "bg-primary text-primary-foreground dark:bg-blue-600 dark:text-white"
                  : "bg-secondary dark:bg-gray-700 dark:text-gray-200"
              }`}
              onClick={() => setActiveTab("categories")}
            >
              Kategoriler
            </button>
          </div>
          {activeTab === "transactions" ? (
            <>
              <TransactionForm />
              <TransactionList />
            </>
          ) : (
            <>
              <CategoryForm />
              <CategoryList />
            </>
          )}
        </div>
        <div>
          <BudgetSummary />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <ExpenseChart />
            <IncomeChart />
          </div>
        </div>
      </div>
    </div>
  );
};
