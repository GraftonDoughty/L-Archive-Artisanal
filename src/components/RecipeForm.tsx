"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Trash2, CheckCircle2, Clock, BarChart } from "lucide-react";
import { useRecipeHistory } from "@/hooks/useRecipeHistory";

export interface RecipeData {
  id?: string;
  title: string;
  description?: string;
  prepTime: string;
  totalTime: string;
  category: string;
  temperature: string;
  difficulty: string;
  ingredients: string[];
  steps: string[];
}

interface RecipeFormProps {
  initialData?: RecipeData;
  isEdit?: boolean;
}

export default function RecipeForm({ initialData, isEdit = false }: RecipeFormProps) {
  const router = useRouter();
  const { pushVersion } = useRecipeHistory();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [prepTime, setPrepTime] = useState(initialData?.prepTime || "");
  const [totalTime, setTotalTime] = useState(initialData?.totalTime || "");
  const [category, setCategory] = useState(initialData?.category || "Main Course");
  const [temperature, setTemperature] = useState(initialData?.temperature || "Hot");
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || "Medium");
  const [ingredients, setIngredients] = useState<string[]>(initialData?.ingredients || [""]);
  const [steps, setSteps] = useState<string[]>(initialData?.steps || [""]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{ title?: string }>({});

  const addIngredient = () => setIngredients([...ingredients, ""]);
  const removeIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index));
  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addStep = () => setSteps([...steps, ""]);
  const removeStep = (index: number) => setSteps(steps.filter((_, i) => i !== index));
  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrors({ title: "Title is required" });
      return;
    }
    
    if (isEdit && initialData) {
      pushVersion(initialData.id || "1", initialData);
    }
    
    setShowSuccess(true);
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 bg-cream-50 min-h-screen">
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[110] flex items-center bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
          <CheckCircle2 className="h-5 w-5 mr-3 text-green-600" />
          <span className="font-semibold">{isEdit ? "Changes saved successfully!" : "Recipe saved successfully!"} Redirecting...</span>
        </div>
      )}

      <div className="mb-12">
        <h1 className="font-serif text-5xl font-bold text-artisanal-dark mb-4">
          {isEdit ? "Edit Recipe" : "New Recipe"}
        </h1>
        <p className="text-artisanal-dark/60 tracking-widest uppercase text-xs font-bold">
          {isEdit ? "Refining your masterpiece" : "Documenting your culinary journey"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12 pb-24">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-cream-200 pb-12">
          <div className="space-y-6 lg:col-span-2">
            <label className="block text-sm font-bold uppercase tracking-widest text-artisanal-brown">Recipe Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors({}); }}
              placeholder="e.g. Heirloom Tomato Tart"
              className={`w-full rounded-2xl border ${errors.title ? 'border-red-300 ring-1 ring-red-100' : 'border-cream-200'} bg-white px-8 py-5 text-xl font-serif focus:ring-artisanal-brown focus:border-artisanal-brown outline-none transition-all placeholder:text-artisanal-dark/10`}
            />
            {errors.title && <p className="text-red-500 text-sm font-medium">{errors.title}</p>}
          </div>

          <div className="space-y-6 lg:col-span-2">
            <label className="block text-sm font-bold uppercase tracking-widest text-artisanal-brown">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share the story behind this recipe or a brief overview..."
              rows={3}
              className="w-full rounded-2xl border border-cream-200 bg-white px-8 py-5 text-base focus:ring-artisanal-brown focus:border-artisanal-brown outline-none transition-all placeholder:text-artisanal-dark/10 resize-none"
            />
          </div>

          <div className="space-y-6">
            <label className="block text-sm font-bold uppercase tracking-widest text-artisanal-brown">Prep Time</label>
            <div className="relative">
              <Clock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-artisanal-dark/20" />
              <input
                type="text"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                placeholder="20 mins"
                className="w-full rounded-2xl border border-cream-200 bg-white pl-14 pr-8 py-4 text-base focus:ring-artisanal-brown focus:border-artisanal-brown outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-6">
            <label className="block text-sm font-bold uppercase tracking-widest text-artisanal-brown">Total Time</label>
            <div className="relative">
              <Clock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-artisanal-dark/20" />
              <input
                type="text"
                value={totalTime}
                onChange={(e) => setTotalTime(e.target.value)}
                placeholder="45 mins"
                className="w-full rounded-2xl border border-cream-200 bg-white pl-14 pr-8 py-4 text-base focus:ring-artisanal-brown focus:border-artisanal-brown outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Categorization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-cream-200 pb-12">
          <div className="space-y-4">
            <label className="block text-sm font-bold uppercase tracking-widest text-artisanal-brown">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl border border-cream-200 bg-white px-6 py-4 text-base focus:ring-artisanal-brown focus:border-artisanal-brown outline-none transition-all appearance-none cursor-pointer"
            >
              <option>Main Course</option>
              <option>Dessert</option>
              <option>Appetizer</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold uppercase tracking-widest text-artisanal-brown">Temperature</label>
            <select
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full rounded-2xl border border-cream-200 bg-white px-6 py-4 text-base focus:ring-artisanal-brown focus:border-artisanal-brown outline-none transition-all appearance-none cursor-pointer"
            >
              <option>Hot</option>
              <option>Cold</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold uppercase tracking-widest text-artisanal-brown">Difficulty</label>
            <div className="flex bg-white rounded-2xl border border-cream-200 p-1">
              {["Easy", "Medium", "Hard"].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 rounded-xl py-3 text-xs font-bold uppercase tracking-widest transition-all ${difficulty === d ? 'bg-artisanal-dark text-white shadow-md' : 'text-artisanal-dark/40 hover:bg-cream-100'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold uppercase tracking-widest text-artisanal-brown">Ingredients</label>
            <button
              type="button"
              onClick={addIngredient}
              className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-artisanal-brown hover:text-artisanal-dark transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Ingredient
            </button>
          </div>
          <div className="space-y-4">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  placeholder="e.g. 250g Type 00 Flour"
                  className="flex-grow rounded-2xl border border-cream-200 bg-white px-6 py-4 text-base focus:ring-artisanal-brown focus:border-artisanal-brown outline-none transition-all"
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-4 text-artisanal-dark/20 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold uppercase tracking-widest text-artisanal-brown">Instructions</label>
            <button
              type="button"
              onClick={addStep}
              className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-artisanal-brown hover:text-artisanal-dark transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Step
            </button>
          </div>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-cream-200 text-artisanal-dark font-serif font-bold text-sm">
                  {index + 1}
                </div>
                <textarea
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  placeholder="Describe this step of your process..."
                  rows={2}
                  className="flex-grow rounded-3xl border border-cream-200 bg-white px-8 py-5 text-base focus:ring-artisanal-brown focus:border-artisanal-brown outline-none transition-all resize-none"
                />
                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="p-4 text-artisanal-dark/20 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-12 border-t border-cream-200 flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-artisanal-dark px-12 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-2xl hover:bg-artisanal-brown hover:-translate-y-1 transition-all duration-300"
          >
            {isEdit ? "Update Recipe" : "Save Recipe"}
          </button>
        </div>
      </form>
    </div>
  );
}
