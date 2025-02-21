
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import { PlusCircle, XCircle, ArrowUp, ArrowDown, Heart } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

const Wishlist = () => {
  const {
    items,
    simulatedItem,
    addItem,
    removeItem,
    moveItem,
    updateSimulatedItem,
    getTotalValue,
  } = useWishlist();

  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemImage, setNewItemImage] = useState("https://images.unsplash.com/photo-1618160702438-9b02ab6515c9");

  const handleAddItem = () => {
    if (!newItemName || !newItemPrice) {
      toast.error("Preencha o nome e o valor do item");
      return;
    }

    const price = parseFloat(newItemPrice);
    if (isNaN(price)) {
      toast.error("Digite um valor válido");
      return;
    }

    addItem({
      name: newItemName,
      price: price,
      imageUrl: newItemImage,
    });

    setNewItemName("");
    setNewItemPrice("");
    setNewItemImage("https://images.unsplash.com/photo-1618160702438-9b02ab6515c9");
    updateSimulatedItem(null);
    toast.success("Item adicionado à wishlist!");
  };

  const handleSimulateItem = (name: string, priceStr: string, imageUrl: string) => {
    const price = parseFloat(priceStr);
    if (!name || isNaN(price)) {
      updateSimulatedItem(null);
      return;
    }

    updateSimulatedItem({
      id: "simulated",
      name,
      price,
      imageUrl,
    });
  };

  const handleInputChange = (
    value: string,
    setter: (value: string) => void,
    field: "name" | "price" | "image"
  ) => {
    setter(value);
    handleSimulateItem(
      field === "name" ? value : newItemName,
      field === "price" ? value : newItemPrice,
      field === "image" ? value : newItemImage
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Adicionar Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="URL da imagem"
              value={newItemImage}
              onChange={(e) => handleInputChange(e.target.value, setNewItemImage, "image")}
            />
            <Input
              placeholder="Nome do item"
              value={newItemName}
              onChange={(e) => handleInputChange(e.target.value, setNewItemName, "name")}
            />
            <Input
              type="number"
              placeholder="Valor (R$)"
              value={newItemPrice}
              onChange={(e) => handleInputChange(e.target.value, setNewItemPrice, "price")}
            />
          </div>
          <Button
            onClick={handleAddItem}
            className="w-full md:w-auto flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Adicionar à Wishlist
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow divide-y">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Minha Wishlist</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>R$ {item.price.toFixed(2)}</span>
                    <div className="flex flex-col">
                      <button
                        onClick={() => moveItem(item.id, "up")}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <ArrowUp size={18} />
                      </button>
                      <button
                        onClick={() => moveItem(item.id, "down")}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <ArrowDown size={18} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {simulatedItem && (
                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <img
                      src={simulatedItem.imageUrl}
                      alt={simulatedItem.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <span className="font-medium">{simulatedItem.name}</span>
                      <span className="ml-2 text-sm text-blue-600">(Simulação)</span>
                    </div>
                  </div>
                  <span>R$ {simulatedItem.price.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="text-purple-600" size={24} />
                <span className="text-lg font-semibold">Total da Wishlist:</span>
              </div>
              <span className="text-2xl font-bold text-purple-600">
                R$ {getTotalValue().toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Wishlist;
