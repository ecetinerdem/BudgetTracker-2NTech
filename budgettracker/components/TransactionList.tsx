"use client";

import { useState } from "react";
import { useBudget } from "@/context/BudgetContext";
import { format, parse, isValid } from "date-fns";
import { tr } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Transaction } from "@/context/BudgetContext";

export const TransactionList: React.FC = () => {
  const { transactions, deleteTransaction, categories, updateTransaction } =
    useBudget();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedAmount, setEditedAmount] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedDate, setEditedDate] = useState("");

  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditedAmount(transaction.amount.toString());
    setEditedCategory(transaction.category);
    setEditedDescription(transaction.description);
    setEditedDate(format(new Date(transaction.date), "dd/MM/yyyy"));
  };

  const handleSave = (id: string) => {
    let formattedDate = editedDate;
    if (isValid(parse(editedDate, "dd/MM/yyyy", new Date()))) {
      formattedDate = format(
        parse(editedDate, "dd/MM/yyyy", new Date()),
        "yyyy-MM-dd"
      );
    }

    updateTransaction(id, {
      amount: parseFloat(editedAmount),
      category: editedCategory,
      description: editedDescription,
      date: formattedDate,
    });
    setEditingId(null);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
    if (inputDate.includes("-")) {
      // If the date is in yyyy-MM-dd format (from date picker)
      const formattedDate = format(new Date(inputDate), "dd/MM/yyyy");
      setEditedDate(formattedDate);
    } else {
      // If the date is manually entered
      setEditedDate(inputDate);
    }
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
    return isValid(parsedDate) ? format(parsedDate, "yyyy-MM-dd") : "";
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Son İşlemler</h2>
      <ul className="space-y-2">
        {transactions.map((transaction) => (
          <li
            key={transaction.id}
            className="flex justify-between items-center bg-secondary p-3 rounded"
          >
            {editingId === transaction.id ? (
              <div className="flex-1 space-y-2">
                <Input
                  type="number"
                  value={editedAmount}
                  onChange={(e) => setEditedAmount(e.target.value)}
                  placeholder="Tutar"
                />
                <Select
                  onValueChange={setEditedCategory}
                  defaultValue={editedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((cat) => cat.type === transaction.type)
                      .map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Açıklama"
                />
                <div className="relative">
                  <Input
                    type="date"
                    value={formatDateForInput(editedDate)}
                    onChange={handleDateChange}
                    required
                    className="w-full pr-10"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500">
                      {editedDate || "dd/mm/yyyy"}
                    </span>
                  </div>
                </div>
                <Button onClick={() => handleSave(transaction.id)}>
                  Kaydet
                </Button>
                <Button variant="outline" onClick={() => setEditingId(null)}>
                  İptal
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <p className="font-semibold">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {
                      categories.find((c) => c.id === transaction.category)
                        ?.name
                    }{" "}
                    -
                    {format(new Date(transaction.date), "dd/MM/yyyy", {
                      locale: tr,
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={
                      transaction.type === "income"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {transaction.type === "income" ? "+" : "-"}₺
                    {transaction.amount.toFixed(2)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(transaction)}
                  >
                    Düzenle
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTransaction(transaction.id)}
                  >
                    Sil
                  </Button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
