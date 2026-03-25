"use client";

import { useRecipeHistory, RecipeVersion } from "@/hooks/useRecipeHistory";
import { RecipeData } from "./RecipeForm";
import { ArrowLeft, RotateCcw, Clock, Check, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RecipeHistory({ recipeId, currentData }: { recipeId: string, currentData: RecipeData }) {
  const { getVersions, pushVersion } = useRecipeHistory();
  const versions = getVersions(recipeId);
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const handleRevert = (version: RecipeVersion) => {
    // In a real app, this would update the database. 
    // Here we'll simulate it by pushing the current as a new version 
    // and "reverting" (which in mock terms just means we'd need to update the mock source).
    // For this demonstration, we'll alert and redirect.
    alert(`Reverting to version from ${new Date(version.timestamp).toLocaleString()}`);
    // Simulate "saving" the old data as the new current one
    // pushVersion(recipeId, version.data); 
    router.push(`/view?id=${recipeId}`);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 bg-cream-50 min-h-screen relative">
      <div className="flex items-center justify-between mb-16">
        <div>
          <Link href={`/view?id=${recipeId}`} className="inline-flex items-center text-artisanal-dark/40 hover:text-artisanal-dark transition-colors mb-4 group">
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Back to Recipe</span>
          </Link>
          <h1 className="font-serif text-5xl font-bold text-artisanal-dark">Recipe History</h1>
        </div>
      </div>

      {versions.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-24 text-center border border-cream-200 border-dashed">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-cream-50 mb-8">
            <Clock className="h-10 w-10 text-cream-200" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-artisanal-dark mb-4">No history yet</h2>
          <p className="text-artisanal-dark/40 max-w-xs mx-auto text-sm leading-relaxed">
            History is captured automatically whenever you edit and save changes to a recipe.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {versions.map((version, vIdx) => (
            <div key={version.id} className="bg-white rounded-[3rem] shadow-xl border border-cream-200 overflow-hidden">
              <div className="p-8 md:p-12 border-b border-cream-100 flex items-center justify-between bg-cream-50/30">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-artisanal-brown mb-2">Version {versions.length - vIdx}</p>
                  <h3 className="font-serif text-2xl font-bold text-artisanal-dark">
                    Saved {new Date(version.timestamp).toLocaleString()}
                  </h3>
                </div>
                <button 
                  onClick={() => setShowConfirm(version.id)}
                  className="flex items-center bg-artisanal-dark text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-artisanal-brown transition-all"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Revert to this
                </button>
              </div>

              <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Changes summary */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-artisanal-dark/30 mb-6 pb-2 border-b border-cream-100">Snapshot Differences</h4>
                  <div className="space-y-6">
                    {version.data.title !== currentData.title && (
                      <div>
                        <p className="text-xs font-bold text-artisanal-brown mb-1">Title Changed</p>
                        <p className="text-sm line-through text-artisanal-dark/30">{version.data.title}</p>
                        <p className="text-sm text-artisanal-dark font-serif font-bold">{currentData.title}</p>
                      </div>
                    )}
                    {version.data.ingredients.length !== currentData.ingredients.length && (
                      <div>
                        <p className="text-xs font-bold text-artisanal-brown mb-1">Ingredients Mask</p>
                        <p className="text-sm text-artisanal-dark/60">{version.data.ingredients.length} items in this version vs {currentData.ingredients.length} now.</p>
                      </div>
                    )}
                    <div className="pt-4">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-artisanal-dark/20 italic">
                         "Preserving the integrity of your process across iterations."
                       </p>
                    </div>
                  </div>
                </div>

                {/* Preview Mini */}
                <div className="bg-cream-50/50 rounded-3xl p-8 border border-cream-100">
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-artisanal-dark/30 mb-4">Quick Preview</h4>
                   <p className="font-serif text-lg font-bold text-artisanal-dark mb-4">{version.data.title}</p>
                   <ul className="space-y-2">
                     {version.data.ingredients.slice(0, 3).map((ing, i) => (
                       <li key={i} className="text-xs text-artisanal-dark/60 flex items-center">
                         <div className="h-1 w-1 rounded-full bg-artisanal-brown/30 mr-2" />
                         {ing}
                       </li>
                     ))}
                     {version.data.ingredients.length > 3 && <li className="text-[8px] text-artisanal-dark/20 uppercase font-bold tracking-widest">+{version.data.ingredients.length - 3} more</li>}
                   </ul>
                </div>
              </div>

              {showConfirm === version.id && (
                <div className="p-12 bg-artisanal-brown/5 border-t border-artisanal-brown/10 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center gap-6 max-w-2xl mx-auto">
                    <div className="h-16 w-16 rounded-full bg-artisanal-brown/10 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="h-8 w-8 text-artisanal-brown" />
                    </div>
                    <div>
                      <h4 className="font-serif text-2xl font-bold text-artisanal-dark mb-2">Revert to this version?</h4>
                      <p className="text-sm text-artisanal-dark/60 mb-6">
                        This will overwrite your current recipe data with the snapshot from {new Date(version.timestamp).toLocaleString()}. This action cannot be undone.
                      </p>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => handleRevert(version)}
                          className="bg-artisanal-dark text-white px-10 py-4 rounded-full font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-green-800 transition-all"
                        >
                          Yes, Revert
                        </button>
                        <button 
                          onClick={() => setShowConfirm(null)}
                          className="text-artisanal-dark/40 hover:text-artisanal-dark font-bold text-xs uppercase tracking-[0.2em] px-6 py-4"
                        >
                          No, Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
