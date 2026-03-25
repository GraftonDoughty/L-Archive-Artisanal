"use client";

import { useState, useEffect } from "react";
import { RecipeData } from "@/components/RecipeForm";

export interface RecipeVersion {
  id: string;
  recipeId: string;
  data: RecipeData;
  timestamp: string;
}

export function useRecipeHistory() {
  const [historyMap, setHistoryMap] = useState<Record<string, RecipeVersion[]>>({});

  useEffect(() => {
    const saved = localStorage.getItem("artisanal_recipe_history");
    if (saved) {
      setHistoryMap(JSON.parse(saved));
    }
  }, []);

  const saveToStorage = (newMap: Record<string, RecipeVersion[]>) => {
    localStorage.setItem("artisanal_recipe_history", JSON.stringify(newMap));
    setHistoryMap(newMap);
  };

  const pushVersion = (recipeId: string, data: RecipeData) => {
    const currentHistory = historyMap[recipeId] || [];
    const newVersion: RecipeVersion = {
      id: Math.random().toString(36).substr(2, 9),
      recipeId,
      data: JSON.parse(JSON.stringify(data)), // Deep clone
      timestamp: new Date().toISOString()
    };

    const updatedHistory = [newVersion, ...currentHistory].slice(0, 2);
    const newMap = { ...historyMap, [recipeId]: updatedHistory };
    saveToStorage(newMap);
  };

  const getVersions = (recipeId: string) => {
    return historyMap[recipeId] || [];
  };

  return { pushVersion, getVersions };
}
