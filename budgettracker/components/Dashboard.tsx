"use client";

import React, { useState, useEffect } from "react";
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
import { PDFDownloadLink, BlobProviderParams } from "@react-pdf/renderer";

import { BudgetPDFDocument } from "./BudgetPDF";

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"transactions" | "categories">(
    "transactions"
  );

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  if (!isMounted) return null;

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
            <React.Suspense fallback={<div>Rapor Yükleniyor...</div>}>
              <PDFDownloadLink
                document={<BudgetPDFDocument data={pdfData} />}
                fileName="butce-raporu.pdf"
                className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
              >
                {({ loading, error }: BlobProviderParams) => {
                  if (loading) return <span>Yükleniyor...</span>;
                  if (error) return <span>Rapor Oluşturulamadı</span>;
                  return <span>Rapor</span>;
                }}
              </PDFDownloadLink>
            </React.Suspense>
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
