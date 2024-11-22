import { Dashboard } from "@/components/Dashboard";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="container mx-auto p-4 dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kişisel Bütçe Takip Uygulaması</h1>
        <ThemeToggle />
      </div>
      <Dashboard />
    </main>
  );
}
