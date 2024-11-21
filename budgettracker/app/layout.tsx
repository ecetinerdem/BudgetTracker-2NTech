import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
// import { ThemeProvider } from '@/components/theme-provider'
// import { BudgetProvider } from '@/context/BudgetContext'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kişisel Bütçe Takip Uygulaması",
  description: "Gelir ve giderlerinizi takip edin, bütçenizi yönetin.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
