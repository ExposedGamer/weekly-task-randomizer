
import { useState, useEffect } from 'react';

export type Expense = {
  id: string;
  name: string;
  amount: number;
};

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [simulatedExpense, setSimulatedExpense] = useState<Expense | null>(null);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const removeExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const updateSimulatedExpense = (expense: Expense | null) => {
    setSimulatedExpense(expense);
  };

  const getTotalExpenses = () => {
    const fixedTotal = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const simulatedAmount = simulatedExpense?.amount || 0;
    return fixedTotal + simulatedAmount;
  };

  return {
    expenses,
    simulatedExpense,
    addExpense,
    removeExpense,
    updateSimulatedExpense,
    getTotalExpenses,
  };
};
