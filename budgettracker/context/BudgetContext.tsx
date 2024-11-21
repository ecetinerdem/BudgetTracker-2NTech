"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { addDays, format, parseISO, startOfMonth, endOfMonth } from "date-fns";

export type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
};

type Category = {
  id: string;
  name: string;
  type: "income" | "expense";
  budgetLimit: number;
};

type BudgetContextType = {
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteTransaction: (id: string) => void;
  deleteCategory: (id: string) => void;
  getMonthlyTransactions: () => Transaction[];
  getCategoryExpenses: (categoryId: string) => number;
  getCategoryIncome: (categoryId: string) => number;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  checkBudgetLimits: () => { categoryId: string; percentage: number }[];
  updateTransaction: (
    id: string,
    updates: Partial<Omit<Transaction, "id" | "type">>
  ) => void;
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
};

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactions");
    const storedCategories = localStorage.getItem("categories");
    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
    if (storedCategories) setCategories(JSON.parse(storedCategories));
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [transactions, categories]);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = { ...transaction, id: uuidv4() };
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory = { ...category, id: uuidv4() };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const updateTransaction = (
    id: string,
    updates: Partial<Omit<Transaction, "id" | "type">>
  ) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const getMonthlyTransactions = () => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    return transactions.filter((t) => {
      const date = parseISO(t.date);
      return date >= start && date <= end;
    });
  };

  const getCategoryExpenses = (categoryId: string) => {
    return transactions
      .filter((t) => t.type === "expense" && t.category === categoryId)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getCategoryIncome = (categoryId: string) => {
    return transactions
      .filter((t) => t.type === "income" && t.category === categoryId)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalIncome = () => {
    return transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const checkBudgetLimits = () => {
    return categories
      .filter((cat) => cat.type === "expense")
      .map((cat) => {
        const expenses = getCategoryExpenses(cat.id);
        const percentage = (expenses / cat.budgetLimit) * 100;
        return { categoryId: cat.id, percentage };
      })
      .filter(({ percentage }) => percentage >= 80);
  };

  return (
    <BudgetContext.Provider
      value={{
        transactions,
        categories,
        addTransaction,
        addCategory,
        updateCategory,
        deleteTransaction,
        deleteCategory,
        updateTransaction,
        getMonthlyTransactions,
        getCategoryExpenses,
        getCategoryIncome,
        getTotalIncome,
        getTotalExpenses,
        checkBudgetLimits,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
