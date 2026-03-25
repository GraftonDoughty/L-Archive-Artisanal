"use client";

import { useState, useEffect } from "react";

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  originalText: string;
}

export function useGroceryList() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("artisanal_grocery_list");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  const saveToStorage = (newItems: GroceryItem[]) => {
    localStorage.setItem("artisanal_grocery_list", JSON.stringify(newItems));
    setItems(newItems);
  };

  const parseIngredient = (text: string): { quantity: number; unit: string; name: string } => {
    // Basic regex to extract quantity, unit, and name
    // Matches "100g Butter", "1 cup Flour", "2 Eggs"
    const match = text.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]*)\s+(.*)$/i);
    if (match) {
      return {
        quantity: parseFloat(match[1]),
        unit: match[2].toLowerCase(),
        name: match[3].trim()
      };
    }
    return { quantity: 1, unit: "", name: text };
  };

  const addItem = (ingredientText: string) => {
    const parsed = parseIngredient(ingredientText);
    const existingIndex = items.findIndex(
      (item) => item.name.toLowerCase() === parsed.name.toLowerCase() && item.unit === parsed.unit
    );

    let newItems: GroceryItem[];
    if (existingIndex > -1) {
      newItems = [...items];
      newItems[existingIndex].quantity += parsed.quantity;
    } else {
      newItems = [
        ...items,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: parsed.name,
          quantity: parsed.quantity,
          unit: parsed.unit,
          originalText: ingredientText
        }
      ];
    }

    saveToStorage(newItems);
    setMessage(`${parsed.name} added to list!`);
    setTimeout(() => setMessage(null), 3000);
  };

  const updateQuantity = (id: string, delta: number) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ).filter(item => item.quantity > 0);
    saveToStorage(newItems);
  };

  const removeItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    saveToStorage(newItems);
  };

  const clearList = () => {
    saveToStorage([]);
  };

  return { items, addItem, updateQuantity, removeItem, clearList, message };
}
