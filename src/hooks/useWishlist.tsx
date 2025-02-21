
import { useState, useEffect } from 'react';

export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

export const useWishlist = () => {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    const savedItems = localStorage.getItem('wishlist');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  const [simulatedItem, setSimulatedItem] = useState<WishlistItem | null>(null);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<WishlistItem, 'id'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    setItems(prev => {
      const index = prev.findIndex(item => item.id === id);
      if (index === -1) return prev;

      const newItems = [...prev];
      if (direction === 'up' && index > 0) {
        [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
      } else if (direction === 'down' && index < prev.length - 1) {
        [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      }
      return newItems;
    });
  };

  const updateSimulatedItem = (item: WishlistItem | null) => {
    setSimulatedItem(item);
  };

  const getTotalValue = () => {
    const itemsTotal = items.reduce((acc, curr) => acc + curr.price, 0);
    const simulatedAmount = simulatedItem?.price || 0;
    return itemsTotal + simulatedAmount;
  };

  return {
    items,
    simulatedItem,
    addItem,
    removeItem,
    moveItem,
    updateSimulatedItem,
    getTotalValue,
  };
};
