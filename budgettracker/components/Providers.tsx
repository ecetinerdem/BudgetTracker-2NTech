"use client";

import { BudgetProvider } from "@/context/BudgetContext";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <BudgetProvider>{children}</BudgetProvider>
    </ThemeProvider>
  );
}
