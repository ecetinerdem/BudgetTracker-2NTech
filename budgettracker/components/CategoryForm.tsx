"use client";

import { useState } from "react";
import { useBudget } from "@/context/BudgetContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CategoryForm: React.FC = () => {
  const { addCategory } = useBudget();
  const [name, setName] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [budgetLimit, setBudgetLimit] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !budgetLimit) return;

    addCategory({
      name,
      type,
      budgetLimit: parseFloat(budgetLimit),
    });

    setName("");
    setType("income");
    setBudgetLimit("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <Select
        onValueChange={(value) => setType(value as "income" | "expense")}
        defaultValue={type}
      >
        <SelectTrigger>
          <SelectValue placeholder="Kategori Türü" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="income">Gelir</SelectItem>
          <SelectItem value="expense">Gider</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Kategori Adı"
        required
      />
      <Input
        type="number"
        value={budgetLimit}
        onChange={(e) => setBudgetLimit(e.target.value)}
        placeholder={type === "income" ? "Kazanç Miktarı" : "Bütçe Limiti"}
        required
      />
      <Button type="submit">Kategori Ekle</Button>
    </form>
  );
};
