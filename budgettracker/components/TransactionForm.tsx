"use client";

import { useState, useEffect } from "react";
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
import { format, parse, isValid } from "date-fns";

export const TransactionForm: React.FC = () => {
  const { addTransaction, categories } = useBudget();
  const [type, setType] = useState<"income" | "expense">("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const [filteredCategories, setFilteredCategories] = useState(categories);

  useEffect(() => {
    setFilteredCategories(categories.filter((cat) => cat.type === type));
    setCategory("");
  }, [type, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !description || !date) return;

    addTransaction({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date: format(parse(date, "dd/MM/yyyy", new Date()), "yyyy-MM-dd"),
    });

    setAmount("");
    setCategory("");
    setDescription("");
    setDate("");
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
    if (inputDate.includes("-")) {
      // If the date is in yyyy-MM-dd format (from date picker)
      const formattedDate = format(new Date(inputDate), "dd/MM/yyyy");
      setDate(formattedDate);
    } else {
      // If the date is manually entered
      setDate(inputDate);
    }
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
    return isValid(parsedDate) ? format(parsedDate, "yyyy-MM-dd") : "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <Select
        onValueChange={(value) => setType(value as "income" | "expense")}
        defaultValue={type}
      >
        <SelectTrigger>
          <SelectValue placeholder="İşlem Türü" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="income">Gelir</SelectItem>
          <SelectItem value="expense">Gider</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={setCategory} value={category}>
        <SelectTrigger>
          <SelectValue placeholder="Kategori" />
        </SelectTrigger>
        <SelectContent>
          {filteredCategories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Tutar"
        required
      />
      <Input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Açıklama"
        required
      />
      <div className="relative">
        <Input
          type="date"
          value={formatDateForInput(date)}
          onChange={handleDateChange}
          required
          className="w-full pr-10"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-gray-500">{date || "dd/mm/yyyy"}</span>
        </div>
      </div>
      <Button type="submit">İşlem Ekle</Button>
    </form>
  );
};
