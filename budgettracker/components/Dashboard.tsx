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
import { PDFDownloadLink } from "@react-pdf/renderer";
import { BudgetPDFDocument } from "./BudgetPDF";

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"transactions" | "categories">(
    "transactions"
  );
  const {
    checkBudgetLimits,
    categories,
    transactions,
    getTotalIncome,
    getTotalExpenses,
  } = useBudget();
  const [warnings, setWarnings] = useState<
    { categoryId: string; percentage: number }[]
  >([]);

  useEffect(() => {
    setWarnings(checkBudgetLimits());
  }, [checkBudgetLimits]);

  const pdfData = {
    transactions,
    categories,
    totalIncome: getTotalIncome(),
    totalExpenses: getTotalExpenses(),
  };

  return (
    <div className="space-y-6">
      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map(({ categoryId, percentage }) => {
            const category = categories.find((c) => c.id === categoryId);
            return (
              <Alert variant="destructive" key={categoryId}>
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
          <div className="mb-4 flex space-x-2">
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "transactions"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary"
              }`}
              onClick={() => setActiveTab("transactions")}
            >
              İşlemler
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === "categories"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary"
              }`}
              onClick={() => setActiveTab("categories")}
            >
              Kategoriler
            </button>
            <PDFDownloadLink
              document={<BudgetPDFDocument data={pdfData} />}
              fileName="butce-raporu.pdf"
              className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              {({ blob, url, loading, error }) =>
                loading ? "Yükleniyor..." : "Rapor"
              }
            </PDFDownloadLink>
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
