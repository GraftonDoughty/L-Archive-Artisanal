"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Clock, Thermometer, Utensils, BarChart, Scale, Zap, RefreshCcw, Info, ChevronRight, Play, Plus, Check, History, Percent, Printer } from "lucide-react";
import Link from "next/link";
import { RecipeData } from "./RecipeForm";
import { useGroceryList } from "@/hooks/useGroceryList";

const COMMON_SUBSTITUTIONS = [
  { original: "Butter", replacement: "Coconut Oil / Olive Oil", ratio: "1:1" },
  { original: "Egg", replacement: "Flax Meal + Water / Applesauce", ratio: "1 egg = 1 tbsp flax + 3 tbsp water" },
  { original: "Milk", replacement: "Oat Milk / Almond Milk", ratio: "1:1" },
  { original: "Honey", replacement: "Maple Syrup / Agave", ratio: "1:1" },
];

export default function RecipeView({ recipe }: { recipe: RecipeData }) {
  const [multiplier, setMultiplier] = useState(1);
  const [unitSystem, setUnitSystem] = useState<"original" | "metric" | "imperial">("original");
  const [showBakersPercentage, setShowBakersPercentage] = useState(false);
  const { addItem, message } = useGroceryList();

  const baseFlourWeight = useMemo(() => {
    const flourIng = recipe.ingredients.find(i => i.toLowerCase().includes("flour"));
    if (!flourIng) return null;
    const match = flourIng.match(/^(\d+(?:\.\d+)?)\s*(?:g|grams|cups|oz|lb)/i);
    if (!match) return null;
    let weight = parseFloat(match[1]);
    if (flourIng.toLowerCase().includes('cups')) weight *= 120; // rough gram conversion for cups
    if (flourIng.toLowerCase().includes('oz')) weight *= 28.35;
    if (flourIng.toLowerCase().includes('lb')) weight *= 453.6;
    return weight;
  }, [recipe.ingredients]);

  const scaleValue = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    return (num * multiplier).toFixed(1).replace(/\.0$/, "");
  };

  const processIngredient = (text: string) => {
    let result = text.replace(/(\d+(?:\.\d+)?)/g, (match) => scaleValue(match));
    
    if (unitSystem === "metric") {
      // cups -> grams (120g per cup), tbsp -> ml (15ml), oz -> g, lb -> g
      result = result.replace(/(\d+(?:\.\d+)?)\s*cups?/gi, (_, v) => `${(parseFloat(v) * 120).toFixed(0)}g`);
      result = result.replace(/(\d+(?:\.\d+)?)\s*tbsp/gi, (_, v) => `${(parseFloat(v) * 15).toFixed(0)}ml`);
      result = result.replace(/(\d+(?:\.\d+)?)\s*oz/gi, (_, v) => `${(parseFloat(v) * 28.35).toFixed(0)}g`);
      result = result.replace(/(\d+(?:\.\d+)?)\s*lbs?/gi, (_, v) => `${(parseFloat(v) * 453.6).toFixed(0)}g`);
    } else if (unitSystem === "imperial") {
      // Prefer volume for imperial home bakes: grams -> cups/tbsp/tsp, ml -> tbsp/tsp
      result = result.replace(/(\d+(?:\.\d+)?)\s*(?:g|grams)/gi, (_, v) => {
        const grams = parseFloat(v);
        if (grams >= 120) return `${(grams / 120).toFixed(1).replace(/\.0$/, "")} cups`;
        if (grams >= 15) return `${(grams / 15).toFixed(1).replace(/\.0$/, "")} tbsp`;
        return `${(grams / 5).toFixed(1).replace(/\.0$/, "")} tsp`;
      });
      result = result.replace(/(\d+(?:\.\d+)?)\s*ml/gi, (_, v) => {
        const ml = parseFloat(v);
        if (ml >= 15) return `${(ml / 15).toFixed(1).replace(/\.0$/, "")} tbsp`;
        return `${(ml / 5).toFixed(1).replace(/\.0$/, "")} tsp`;
      });
      result = result.replace(/(\d+(?:\.\d+)?)\s*kg/gi, (_, v) => {
        const lb = parseFloat(v) * 2.20462;
        return `${lb.toFixed(1).replace(/\.0$/, "")}lb`;
      });
    }

    let percent: string | null = null;
    if (showBakersPercentage && baseFlourWeight) {
      const origMatch = text.match(/^(\d+(?:\.\d+)?)\s*(g|grams|ml|kg|l|oz|lb|cups|tbsp|tsp)/i);
      if (origMatch) {
         let origNum = parseFloat(origMatch[1]);
         const unit = origMatch[2].toLowerCase();
         if (unit.startsWith('cup')) origNum *= 120;
         if (unit.startsWith('tbsp')) origNum *= 15;
         if (unit.startsWith('tsp')) origNum *= 5;
         if (unit === 'oz') origNum *= 28.35;
         if (unit === 'lb') origNum *= 453.6;
         
         const pct = ((origNum / baseFlourWeight) * 100).toFixed(1).replace(/\.0$/, "");
         percent = `${pct}%`;
      }
    }

    return { result, percent };
  };

  return (
    <div className="bg-cream-50 min-h-screen pb-24 relative print:bg-white print:pb-0">
      {/* Success Toast */}
      {message && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-artisanal-dark text-white px-6 py-3 rounded-full flex items-center shadow-2xl border border-white/10 animate-in slide-in-from-top-4 duration-300 print:hidden">
          <Check className="h-4 w-4 mr-2 text-artisanal-brown" />
          <span className="text-xs font-bold uppercase tracking-widest">{message}</span>
        </div>
      )}

      {/* Print-Only Header */}
      <div className="hidden print:block text-center border-b-2 border-black pb-8 mb-8 mt-4 mx-8">
        <h1 className="font-serif text-5xl font-bold text-black mb-4">{recipe.title}</h1>
        <p className="font-serif italic text-xl text-black/80 max-w-2xl mx-auto">{recipe.description}</p>
        <p className="text-[10px] uppercase tracking-[0.3em] mt-6 text-black/40 font-bold">Volume {recipe.id} • L'Archive Artisanal</p>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-[70vh] w-full overflow-hidden print:hidden">
        <Image 
          src={`/images/${recipe.id === '1' ? 'hero.png' : 'macarons.png'}`} 
          alt={recipe.title} 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-artisanal-dark/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6 max-w-4xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-artisanal-brown/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.3em] mb-4 md:mb-6">
              {recipe.category}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6 drop-shadow-2xl">{recipe.title}</h1>
            <p className="font-serif italic text-base sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-0 drop-shadow-md">
              {recipe.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 -mt-20 relative z-10 sm:px-6 lg:px-8 print:m-0 print:p-0 print:max-w-none">
        <div className="bg-white rounded-[3rem] shadow-2xl border border-cream-200 overflow-hidden lg:grid lg:grid-cols-12 print:shadow-none print:border-none print:rounded-none">
          {/* Main Content Area */}
          <div className="lg:col-span-8 p-8 md:p-16 print:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-16 gap-8 pb-12 border-b border-cream-100 print:border-black/20 print:mb-10 print:pb-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 print:w-full print:gap-4 print:grid-cols-4">
                <div className="text-center md:text-left print:text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-artisanal-dark/30 mb-1 print:text-black/40">Time</p>
                  <p className="text-artisanal-dark font-serif font-bold flex items-center justify-center md:justify-start print:justify-start print:text-black">
                    <Clock className="h-4 w-4 mr-2 text-artisanal-brown print:text-black/60" /> {recipe.totalTime}
                  </p>
                </div>
                <div className="text-center md:text-left print:text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-artisanal-dark/30 mb-1 print:text-black/40">Temp</p>
                  <p className="text-artisanal-dark font-serif font-bold flex items-center justify-center md:justify-start print:justify-start print:text-black">
                    <Thermometer className="h-4 w-4 mr-2 text-artisanal-brown print:text-black/60" /> {recipe.temperature}
                  </p>
                </div>
                <div className="text-center md:text-left print:text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-artisanal-dark/30 mb-1 print:text-black/40">Difficulty</p>
                  <p className="text-artisanal-dark font-serif font-bold flex items-center justify-center md:justify-start print:justify-start print:text-black">
                    <BarChart className="h-4 w-4 mr-2 text-artisanal-brown print:text-black/60" /> {recipe.difficulty}
                  </p>
                </div>
                <div className="text-center md:text-left print:text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-artisanal-dark/30 mb-1 print:text-black/40">Serves</p>
                  <p className="text-artisanal-dark font-serif font-bold flex items-center justify-center md:justify-start print:justify-start print:text-black">
                    <Utensils className="h-4 w-4 mr-2 text-artisanal-brown print:text-black/60" /> {multiplier * 4}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full lg:w-auto print:hidden">
                {/* Tweak Controls Integrated */}
                <div className="flex bg-cream-50 rounded-2xl p-2 items-center justify-between sm:justify-start gap-1 border border-cream-100 w-full lg:w-max">
                  <button onClick={() => setMultiplier(0.5)} className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${multiplier === 0.5 ? 'bg-artisanal-dark text-white shadow-md' : 'text-artisanal-dark/40 hover:bg-cream-100'}`}>0.5x</button>
                  <button onClick={() => setMultiplier(1)} className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${multiplier === 1 ? 'bg-artisanal-dark text-white shadow-md' : 'text-artisanal-dark/40 hover:bg-cream-100'}`}>1x</button>
                  <button onClick={() => setMultiplier(2)} className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${multiplier === 2 ? 'bg-artisanal-dark text-white shadow-md' : 'text-artisanal-dark/40 hover:bg-cream-100'}`}>2x</button>
                  
                  <div className="hidden sm:block w-[1px] h-4 bg-cream-200 mx-2" />
                  
                  <button onClick={() => setUnitSystem("original")} className={`p-2 rounded-xl transition-all ${unitSystem === "original" ? 'bg-artisanal-brown text-white' : 'text-artisanal-dark/40 hover:bg-cream-100'}`} title="Original Units">
                    <RefreshCcw className="h-4 w-4" />
                  </button>
                  <button onClick={() => setUnitSystem("metric")} className={`p-2 rounded-xl transition-all ${unitSystem === "metric" ? 'bg-artisanal-brown text-white' : 'text-artisanal-dark/40 hover:bg-cream-100'}`} title="Metric Units">
                    <Scale className="h-4 w-4" />
                  </button>
                  <button onClick={() => setUnitSystem("imperial")} className={`p-2 rounded-xl transition-all ${unitSystem === "imperial" ? 'bg-artisanal-brown text-white' : 'text-artisanal-dark/40 hover:bg-cream-100'}`} title="Imperial Units">
                    <span className="text-[10px] font-bold px-1">IMP</span>
                  </button>

                  {baseFlourWeight && (
                    <button onClick={() => setShowBakersPercentage(!showBakersPercentage)} className={`p-2 rounded-xl transition-all ${showBakersPercentage ? 'bg-artisanal-brown text-white' : 'text-artisanal-dark/40 hover:bg-cream-100'}`} title="Baker's Percentage">
                      <Percent className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Link 
                    href={`/cook?id=${recipe.id}`}
                    className="flex-1 group flex justify-center items-center bg-artisanal-brown text-white px-4 py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-md hover:bg-artisanal-dark transition-all transform hover:-translate-y-0.5"
                  >
                    <Play className="h-4 w-4 md:mr-2 fill-current" />
                    <span className="hidden md:inline">Cook Mode</span>
                    <span className="md:hidden">Cook</span>
                  </Link>
                  <Link 
                    href={`/history?id=${recipe.id}`}
                    className="flex-1 flex justify-center items-center bg-white text-artisanal-dark border border-cream-200 px-4 py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-cream-50 transition-all transform hover:-translate-y-0.5"
                  >
                    <History className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">History</span>
                    <span className="md:hidden">Log</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-24 print:space-y-12">
              <section>
                <h2 className="font-serif text-3xl font-bold text-artisanal-dark mb-10 print:text-black print:mb-6">Ingredients</h2>
                <ul className="space-y-6 print:space-y-2">
                  {recipe.ingredients.map((ing, idx) => {
                    const { result: processed, percent } = processIngredient(ing);
                    const match = processed.match(/^(\d+(?:\.\d+)?\s*[a-zA-Z]*)\s+(.*)$/i);
                    return (
                      <li key={idx} className="flex items-center text-xl text-artisanal-dark/80 font-serif leading-tight border-b border-cream-50 pb-6 last:border-0 group print:text-black print:text-base print:border-b-black/10 print:pb-2">
                        <div className="flex h-5 w-5 items-center justify-center mr-6 relative print:hidden">
                           <div className="h-2 w-2 rounded-full bg-artisanal-brown/30 transition-all group-hover:scale-0" />
                           <button 
                            onClick={() => addItem(processed)}
                            className="absolute scale-0 group-hover:scale-100 bg-artisanal-brown text-white rounded-full p-1.5 shadow-lg transition-transform hover:rotate-90 z-10"
                            title="Add to Grocery List"
                           >
                            <Plus className="h-3 w-3" />
                           </button>
                        </div>
                        <span className="flex-grow flex items-center flex-wrap gap-2">
                          <span>
                            {match ? (
                              <>
                                <span className="text-artisanal-brown font-bold mr-2 print:text-black">{match[1]}</span>
                                <span className="opacity-80 print:opacity-100">{match[2]}</span>
                              </>
                            ) : (
                              processed
                            )}
                          </span>
                          {percent && (
                            <span className="text-artisanal-brown font-sans font-bold text-xs px-2.5 py-1 bg-artisanal-brown/10 rounded-full ml-auto md:ml-2 print:text-black/60 print:bg-transparent print:border print:border-black/20 print:ml-2">
                              {percent}
                            </span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-3xl font-bold text-artisanal-dark mb-10 print:text-black print:mb-6">Instructions</h2>
                <div className="space-y-12 print:space-y-6">
                  {recipe.steps.map((step: string, idx: number) => (
                    <div key={idx} className="flex gap-8 group print:gap-4">
                      <span className="font-serif text-4xl font-bold text-cream-200 mt-1 transition-colors group-hover:text-artisanal-brown/20 select-none print:text-black/20 print:text-2xl">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <p className="text-lg leading-relaxed text-artisanal-dark/70 pt-2 print:text-black print:text-base print:pt-0">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-20 pt-12 border-t border-cream-100 print:hidden flex justify-center">
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center bg-white text-artisanal-dark border border-cream-200 px-10 py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-cream-50 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <Printer className="h-4 w-4 mr-3" />
                    Print Recipe Card
                  </button>
                </div>
              </section>
            </div>
          </div>

          {/* Sidebar Area for Post-recipe Content */}
          <div className="lg:col-span-4 bg-cream-50/30 p-8 md:p-12 border-l border-cream-100 flex flex-col justify-between print:bg-white print:border-none print:p-8">
            <div>
              <div className="bg-artisanal-dark/5 p-8 rounded-[2rem] border border-artisanal-dark/5 mb-12 print:bg-transparent print:border-black/20 print:p-6 print:rounded-xl">
                <div className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-artisanal-brown mb-6 print:text-black">
                  <Info className="h-3 w-3 mr-2" /> Artisanal Note
                </div>
                <p className="text-xs text-artisanal-dark/60 leading-relaxed font-medium print:text-black/80">
                  This recipe requires high-quality ingredients. We recommend using locally sourced, organic flour and hand-harvested sea salt for the best results in your environment.
                </p>
              </div>

              <section>
                <h3 className="flex items-center text-[10px] font-bold uppercase tracking-[0.3em] text-artisanal-dark/40 mb-8 pb-4 border-b border-artisanal-dark/5">
                  <RefreshCcw className="h-3 w-3 mr-2" /> Potential Substitutions
                </h3>
                <div className="space-y-4">
                  {COMMON_SUBSTITUTIONS.map((sub) => (
                    <div key={sub.original} className="bg-white p-6 rounded-2xl border border-cream-200 shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-artisanal-dark/20 mb-2">If no {sub.original}</p>
                      <p className="text-sm font-serif font-bold text-artisanal-dark mb-1">Use {sub.replacement}</p>
                      <p className="text-[10px] font-medium text-artisanal-brown tracking-wide mb-0.5">{sub.ratio}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-24 pt-12 border-t border-cream-100">
               <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-artisanal-dark/20">
                <span>L'Archive Artisanal</span>
                <span>© 2026</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
