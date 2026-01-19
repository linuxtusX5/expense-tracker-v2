import { ExpenseData, expensesAPI } from "@/services/api";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface Expense {
  _id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Income {
  id: string;
  amount: number;
  description: string;
  source: string;
  date: Date;
}

interface ExpenseContextType {
  expenses: Expense[];
  loading: boolean;
  addExpense: (expense: ExpenseData) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  updateExpense: (id: string, expense: Partial<ExpenseData>) => Promise<void>;
  clearAllExpenses: () => Promise<void>;
  getTodayTotal: () => number;
  getWeeklyTotal: () => number;
  getMonthlyTotal: () => number;
  getCategoryTotals: () => Record<string, number>;
  getMonthlyExpenses: () => Record<string, number>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Load expenses from API on app start
  useEffect(() => {
    refreshExpenses();
  }, []);

  const refreshExpenses = async () => {
    try {
      setLoading(true);
      const response = await expensesAPI.getExpenses({ limit: 100 });
      const expensesWithDates = response.expenses.map((expense: any) => ({
        ...expense,
        date: new Date(expense.date),
      }));
      setExpenses(expensesWithDates);
    } catch (error) {
      console.error("Error loading expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  // const loadExpenses = async () => {
  //   try {
  //     const storedExpenses = await AsyncStorage.getItem(STORAGE_KEY);
  //     if (storedExpenses) {
  //       const parsedExpenses = JSON.parse(storedExpenses).map(
  //         (expense: any) => ({
  //           ...expense,
  //           date: new Date(expense.date),
  //         })
  //       );
  //       setExpenses(parsedExpenses);
  //     }
  //   } catch (error) {
  //     console.error("Error loading expenses:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const loadIncome = async () => {
  //   try {
  //     const storedIncome = await AsyncStorage.getItem(INCOME_STORAGE_KEY);
  //     if (storedIncome) {
  //       const parsedIncome = JSON.parse(storedIncome).map((income: any) => ({
  //         ...income,
  //         date: new Date(income.date),
  //       }));
  //       setIncome(parsedIncome);
  //     }
  //   } catch (error) {
  //     console.error("Error loading income:", error);
  //   }
  // };

  // const loadInitialBalance = async () => {
  //   try {
  //     const storedBalance = await AsyncStorage.getItem(BALANCE_STORAGE_KEY);
  //     if (storedBalance) {
  //       setInitialBalanceState(parseFloat(storedBalance));
  //     }
  //   } catch (error) {
  //     console.error("Error loading initial balance:", error);
  //   }
  // };

  // const saveIncome = async (newIncome: Income[]) => {
  //   try {
  //     await AsyncStorage.setItem(INCOME_STORAGE_KEY, JSON.stringify(newIncome));
  //   } catch (error) {
  //     console.error("Error saving income:", error);
  //   }
  // };

  // const addIncome = async (incomeData: Omit<Income, "id">) => {
  //   const newIncome: Income = {
  //     ...incomeData,
  //     id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  //   };

  //   const updatedIncome = [newIncome, ...income];
  //   setIncome(updatedIncome);
  //   await saveIncome(updatedIncome);
  // };

  const addExpense = async (expenseData: ExpenseData) => {
    try {
      const response = await expensesAPI.createExpense(expenseData);
      const newExpense = {
        ...response.expense,
        date: new Date(response.expense.date),
      };
      setExpenses([newExpense, ...expenses]);
    } catch (error) {
      console.error("Error adding expense:", error);
      throw error;
    }
  };

  // const deleteIncome = async (id: string) => {
  //   const updatedIncome = income.filter((inc) => inc.id !== id);
  //   setIncome(updatedIncome);
  //   await saveIncome(updatedIncome);
  // };

  const deleteExpense = async (id: string) => {
    try {
      await expensesAPI.deleteExpense(id);
      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error;
    }
  };

  // const updateIncome = async (id: string, updates: Partial<Income>) => {
  //   const updatedIncome = income.map((inc) =>
  //     inc.id === id ? { ...inc, ...updates } : inc
  //   );
  //   setIncome(updatedIncome);
  //   await saveIncome(updatedIncome);
  // };

  const updateExpense = async (id: string, updates: Partial<ExpenseData>) => {
    try {
      const response = await expensesAPI.updateExpense(id, updates);
      const updatedExpense = {
        ...response.expense,
        date: new Date(response.expense.date),
      };
      setExpenses(
        expenses.map((expense) =>
          expense._id === id ? updatedExpense : expense
        )
      );
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error;
    }
  };

  const clearAllExpenses = async () => {
    try {
      setExpenses([]);
    } catch (error) {
      console.error("Error clearing expenses:", error);
    }
  };

  const getTodayTotal = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= today && expenseDate < tomorrow;
      })
      .reduce((total, expense) => total + expense.amount, 0);
  };

  // const getTotalIncome = () => {
  //   return income.reduce((total, inc) => total + inc.amount, 0);
  // };

  // const getMonthlyIncome = () => {
  //   const now = new Date();
  //   const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  //   return income
  //     .filter((inc) => new Date(inc.date) >= startOfMonth)
  //     .reduce((total, inc) => total + inc.amount, 0);
  // };

  const getWeeklyTotal = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return expenses
      .filter((expense) => new Date(expense.date) >= startOfWeek)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getMonthlyTotal = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return expenses
      .filter((expense) => new Date(expense.date) >= startOfMonth)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getCategoryTotals = () => {
    return expenses.reduce((totals, expense) => {
      totals[expense.category] =
        (totals[expense.category] || 0) + expense.amount;
      return totals;
    }, {} as Record<string, number>);
  };

  const getMonthlyExpenses = () => {
    const monthlyTotals: Record<string, number> = {};

    expenses.forEach((expense) => {
      const monthKey = new Date(expense.date).toISOString().slice(0, 7); // YYYY-MM
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + expense.amount;
    });

    return monthlyTotals;
  };

  const value: ExpenseContextType = {
    expenses: expenses.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ),
    loading,
    addExpense,
    deleteExpense,
    updateExpense,
    clearAllExpenses,
    getTodayTotal,
    getWeeklyTotal,
    getMonthlyTotal,
    getCategoryTotals,
    getMonthlyExpenses,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
}

export const useExpenseContext = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenseContext must be used within an ExpenseProvider");
  }
  return context;
};
