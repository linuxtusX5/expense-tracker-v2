import { incomeAPI } from "@/services/api";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface Income {
  _id: string;
  amount: number;
  source: string;
  description: string;
  createdAt: string;
}

type IncomeContextType = {
  income: Income[];
  totalIncome: number;
  refreshIncome: () => Promise<void>;
  addIncome: (data: {
    amount: number;
    description: string;
    source: string;
  }) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
};

const IncomeContext = createContext<IncomeContextType | null>(null);

export const IncomeProvider = ({ children }: { children: React.ReactNode }) => {
  const [income, setIncome] = useState<Income[]>([]);

  const refreshIncome = async () => {
    try {
      const data = await incomeAPI.getIncome();
      setIncome(data);
    } catch (err) {
      console.log("Income fetch error:", err);
    }
  };

  const addIncome = async (data: {
    amount: number;
    description: string;
    source: string;
  }) => {
    await incomeAPI.createIncome(data);
    await refreshIncome();
  };
  const deleteIncome = async (id: string) => {
    await incomeAPI.deleteIncome(id);
    await refreshIncome();
  };

  useEffect(() => {
    refreshIncome();
  }, []);

  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);

  return (
    <IncomeContext.Provider
      value={{ income, totalIncome, refreshIncome, addIncome, deleteIncome }}
    >
      {children}
    </IncomeContext.Provider>
  );
};

export const useIncome = () => {
  const ctx = useContext(IncomeContext);
  if (!ctx) {
    throw new Error("useIncome must be used inside IncomeProvider");
  }
  return ctx;
};
