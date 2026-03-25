"use client";

import { useState } from "react";
import { Sliders, Scale, Zap, Info, ChevronRight, RefreshCcw, Plus, Check } from "lucide-react";
import { RecipeData } from "./RecipeForm";
import { useGroceryList } from "@/hooks/useGroceryList";

const COMMON_SUBSTITUTIONS = [
  { original: "Butter", replacement: "Coconut Oil / Olive Oil", ratio: "1:1" },
  { original: "Egg", replacement: "Flax Meal + Water / Applesauce", ratio: "1 egg = 1 tbsp flax + 3 tbsp water" },
  { original: "Milk", replacement: "Oat Milk / Almond Milk", ratio: "1:1" },
  { original: "Honey", replacement: "Maple Syrup / Agave", ratio: "1:1" },
  { original: "Sugar", replacement: "Stevia / Monk Fruit", ratio: "Refer to package" }
];

const UNIT_CONVERSIONS: Record<string, { to: string, factor: number }> = {
  "cups": { to: "grams", factor: 120 }, // Approximate for flour
  "tbsp": { to: "ml", factor: 15 },
  "tsp": { to: "ml", factor: 5 },
  "oz": { to: "grams", factor: 28.35 },
};

export default function RecipeTweakTools({ recipe }: { recipe: RecipeData }) {
  const [multiplier, setMultiplier] = useState(1);
  const [useGrams, setUseGrams] = useState(false);
  const [activeSubstitutions, setActiveSubstitutions] = useState<string[]>([]);
  const { addItem, message } = useGroceryList();

  const scaleValue = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    return (num * multiplier).toFixed(1).replace(/\.0$/, "");
  };

  const convertIngredient = (text: string) => {
    let scaled = text.replace(/(\d+(?:\.\d+)?)/g, (match) => scaleValue(match));
    
    if (useGrams) {
      Object.entries(UNIT_CONVERSIONS).forEach(([unit, conv]) => {
        const regex = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*${unit}`, "gi");
        scaled = scaled.replace(regex, (_, val) => {
          const grams = (parseFloat(val) * conv.factor).toFixed(0);
          return `${grams} ${conv.to}`;
        });
      });
    }
    return scaled;
  };

  const toggleSubstitution = (ingredient: string) => {
    setActiveSubstitutions(prev => 
      prev.includes(ingredient) ? prev.filter(i => i !== ingredient) : [...prev, ingredient]
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 bg-cream-50 min-h-screen relative">
       {/* Success Toast */}
       {message && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-artisanal-dark text-white px-6 py-3 rounded-full flex items-center shadow-2xl border border-white/10 animate-in slide-in-from-top-4 duration-300">
          <Check className="h-4 w-4 mr-2 text-artisanal-brown" />
          <span className="text-xs font-bold uppercase tracking-widest">{message}</span>
        </div>
      )}

      <div className="mb-12">
        <h1 className="font-serif text-5xl font-bold text-artisanal-dark mb-4">Recipe Tweak Tools</h1>
        <p className="text-artisanal-dark/60 tracking-widest uppercase text-xs font-bold">Adapt for your environment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-white rounded-3xl p-8 border border-cream-200 shadow-sm">
            <h2 className="flex items-center text-sm font-bold uppercase tracking-widest text-artisanal-brown mb-6">
              <Zap className="h-4 w-4 mr-2" />
              Scale Recipe
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[0.5, 1, 2, 3].map((val) => (
                <button
                  key={val}
                  onClick={() => setMultiplier(val)}
                  className={`rounded-2xl py-3 text-sm font-bold transition-all ${multiplier === val ? 'bg-artisanal-dark text-white shadow-lg' : 'bg-cream-50 text-artisanal-dark hover:bg-cream-100'}`}
                >
                  {val}x
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-3xl p-8 border border-cream-200 shadow-sm">
            <h2 className="flex items-center text-sm font-bold uppercase tracking-widest text-artisanal-brown mb-6">
              <Scale className="h-4 w-4 mr-2" />
              Unit Converter
            </h2>
            <button
              onClick={() => setUseGrams(!useGrams)}
              className={`w-full rounded-2xl py-4 flex items-center justify-between px-6 transition-all ${useGrams ? 'bg-artisanal-brown text-white' : 'bg-cream-50 text-artisanal-dark'}`}
            >
              <span className="font-bold text-xs uppercase tracking-widest">Use Metric (Grams/ML)</span>
              <div className={`h-6 w-11 rounded-full bg-black/10 relative transition-colors ${useGrams ? 'bg-white/20' : ''}`}>
                <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${useGrams ? 'translate-x-5' : ''}`} />
              </div>
            </button>
            <p className="mt-4 text-[11px] text-artisanal-dark/40 italic leading-relaxed">
              *Note: Gram conversions are approximated based on standard baking densities.
            </p>
          </section>

          <section className="bg-white rounded-3xl p-8 border border-cream-200 shadow-sm">
            <h2 className="flex items-center text-sm font-bold uppercase tracking-widest text-artisanal-brown mb-6">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Quick Substitutions
            </h2>
            <div className="space-y-3">
              {COMMON_SUBSTITUTIONS.map((sub) => (
                <button
                  key={sub.original}
                  onClick={() => toggleSubstitution(sub.original)}
                  className={`w-full text-left rounded-2xl p-4 border transition-all ${activeSubstitutions.includes(sub.original) ? 'border-artisanal-brown bg-artisanal-brown/5 ring-1 ring-artisanal-brown' : 'border-cream-100 bg-cream-50/50 hover:border-cream-200'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-artisanal-dark">{sub.original}</span>
                    <ChevronRight className={`h-3 w-3 transition-transform ${activeSubstitutions.includes(sub.original) ? 'rotate-90' : ''}`} />
                  </div>
                  {activeSubstitutions.includes(sub.original) && (
                    <div className="mt-2 text-[11px] text-artisanal-dark/60 animate-in fade-in slide-in-from-top-1 duration-200">
                      Use <span className="font-bold text-artisanal-brown">{sub.replacement}</span> ({sub.ratio})
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Live Ingredients View */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] p-12 border border-cream-200 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <span className="text-[100px] font-serif font-bold text-cream-50/80 leading-none select-none">Recipe</span>
            </div>
            
            <div className="relative z-10">
              <h2 className="font-serif text-3xl font-bold text-artisanal-dark mb-2">{recipe.title}</h2>
              <div className="flex items-center text-artisanal-dark/40 text-xs font-bold uppercase tracking-widest mb-12">
                <span>{multiplier}x Batch</span>
                <span className="mx-3">•</span>
                <span>{useGrams ? "Metric" : "Standard"}</span>
              </div>

              <div className="space-y-12">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-artisanal-brown mb-6 border-b border-cream-100 pb-2 inline-block">Adjusted Ingredients</h3>
                  <ul className="space-y-6">
                    {recipe.ingredients.map((ing, idx) => {
                      const processed = convertIngredient(ing);
                      return (
                        <li key={idx} className="flex items-start group">
                          <div className="flex h-5 w-5 items-center justify-center mr-4 flex-shrink-0">
                            <div className="h-5 w-5 rounded-full border-2 border-cream-200 group-hover:scale-0 transition-transform" />
                            <button 
                              onClick={() => addItem(processed)}
                              className="absolute scale-0 group-hover:scale-100 bg-artisanal-brown text-white rounded-full p-1.5 shadow-lg transition-transform hover:rotate-90"
                              title="Add to Grocery List"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-xl font-serif text-artisanal-dark leading-snug">
                            {processed}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="pt-12 border-t border-cream-100">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-artisanal-brown mb-6">Original Process</h3>
                  <div className="space-y-8">
                    {recipe.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-6">
                        <span className="font-serif text-2xl font-bold text-cream-200 leading-none">{(idx + 1).toString().padStart(2, '0')}</span>
                        <p className="text-artisanal-dark/80 text-lg leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-cream-100 flex items-center text-artisanal-dark/30 text-[10px] uppercase font-bold tracking-[0.2em]">
              <Info className="h-3 w-3 mr-2" /> High-altitude adjustments not included.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
