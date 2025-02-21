
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useExpenses } from "@/hooks/useExpenses";
import { PlusCircle, XCircle, Calculator } from "lucide-react";
import { toast } from "sonner";

const Finances = () => {
  const {
    expenses,
    simulatedExpense,
    addExpense,
    removeExpense,
    updateSimulatedExpense,
    getTotalExpenses,
  } = useExpenses();

  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");

  const handleAddExpense = () => {
    if (!newExpenseName || !newExpenseAmount) {
      toast.error("Preencha todos os campos");
      return;
    }

    const amount = parseFloat(newExpenseAmount);
    if (isNaN(amount)) {
      toast.error("Digite um valor válido");
      return;
    }

    addExpense({
      name: newExpenseName,
      amount: amount,
    });

    setNewExpenseName("");
    setNewExpenseAmount("");
    toast.success("Gasto fixo adicionado com sucesso!");
  };

  const handleSimulateExpense = (name: string, amountStr: string) => {
    const amount = parseFloat(amountStr);
    if (!name || isNaN(amount)) {
      updateSimulatedExpense(null);
      return;
    }

    updateSimulatedExpense({
      id: "simulated",
      name,
      amount,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Finanças</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Adicionar Gasto Fixo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="Nome do gasto"
              value={newExpenseName}
              onChange={(e) => setNewExpenseName(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Valor (R$)"
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(e.target.value)}
            />
          </div>
          <Button
            onClick={handleAddExpense}
            className="w-full md:w-auto flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Adicionar Gasto Fixo
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Simulação de Novo Gasto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Nome do gasto"
              value={simulatedExpense?.name || ""}
              onChange={(e) =>
                handleSimulateExpense(
                  e.target.value,
                  simulatedExpense?.amount?.toString() || ""
                )
              }
            />
            <Input
              type="number"
              placeholder="Valor (R$)"
              value={simulatedExpense?.amount || ""}
              onChange={(e) =>
                handleSimulateExpense(
                  simulatedExpense?.name || "",
                  e.target.value
                )
              }
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow divide-y">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Lista de Gastos Fixos</h2>
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                >
                  <span className="font-medium">{expense.name}</span>
                  <div className="flex items-center gap-4">
                    <span>R$ {expense.amount.toFixed(2)}</span>
                    <button
                      onClick={() => removeExpense(expense.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {simulatedExpense && (
                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                  <div>
                    <span className="font-medium">{simulatedExpense.name}</span>
                    <span className="ml-2 text-sm text-blue-600">(Simulação)</span>
                  </div>
                  <span>R$ {simulatedExpense.amount.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="text-purple-600" size={24} />
                <span className="text-lg font-semibold">Total Mensal:</span>
              </div>
              <span className="text-2xl font-bold text-purple-600">
                R$ {getTotalExpenses().toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Finances;
