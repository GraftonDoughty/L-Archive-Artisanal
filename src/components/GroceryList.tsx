"use client";

import { useGroceryList } from "@/hooks/useGroceryList";
import { Trash2, Plus, Minus, ShoppingBasket, ArrowLeft, Save, Check } from "lucide-react";
import Link from "next/link";

export default function GroceryList() {
  const { items, updateQuantity, removeItem, clearList, message } = useGroceryList();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 bg-cream-50 min-h-screen relative">
      {/* Success Toast */}
      {message && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-artisanal-dark text-white px-6 py-3 rounded-full flex items-center shadow-2xl border border-white/10 animate-in slide-in-from-top-4 duration-300">
          <Check className="h-4 w-4 mr-2 text-artisanal-brown" />
          <span className="text-xs font-bold uppercase tracking-widest text-[10px]">{message}</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-16">
        <div>
          <Link href="/" className="inline-flex items-center text-artisanal-dark/40 hover:text-artisanal-dark transition-colors mb-4 group">
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Back to Archive</span>
          </Link>
          <h1 className="font-serif text-5xl font-bold text-artisanal-dark">Smart Grocery List</h1>
        </div>
        {items.length > 0 && (
          <button 
            onClick={() => { if(confirm('Delete entire list?')) clearList(); }}
            className="flex items-center text-red-800/40 hover:text-red-800 transition-colors group"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Clear All</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-24 text-center border border-cream-200 border-dashed">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-cream-50 mb-8">
            <ShoppingBasket className="h-10 w-10 text-cream-200" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-artisanal-dark mb-4">Your list is empty</h2>
          <p className="text-artisanal-dark/40 max-w-xs mx-auto text-sm leading-relaxed">
            Browse your archive and click the "+" next to ingredients to build your smart grocery list.
          </p>
          <Link href="/" className="mt-12 inline-flex items-center bg-artisanal-dark text-white px-10 py-4 rounded-full font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-artisanal-brown transition-all">
            Browse Recipes
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white rounded-[3rem] shadow-xl border border-cream-200 overflow-hidden">
            <div className="p-8 md:p-12 space-y-2">
              <div className="flex items-center text-[10px] font-bold uppercase tracking-[0.3em] text-artisanal-brown mb-8 border-b border-cream-100 pb-4">
                 Unified Ingredients
              </div>
              <div className="divide-y divide-cream-50">
                {items.map((item) => (
                  <div key={item.id} className="py-8 flex items-center justify-between group">
                    <div className="flex-grow">
                      <h3 className="font-serif text-2xl font-bold text-artisanal-dark group-hover:text-artisanal-brown transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-artisanal-dark/20 mt-1">
                        From scaled recipes
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="bg-cream-50 rounded-2xl p-2 flex items-center border border-cream-100">
                        <button 
                          onClick={() => updateQuantity(item.id, -0.1)}
                          className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white text-artisanal-dark transition-all"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <div className="px-6 text-xl font-serif font-bold text-artisanal-dark min-w-[5rem] text-center">
                          {item.quantity.toFixed(1).replace(/\.0$/, "")}
                          <span className="text-xs ml-1 text-artisanal-dark/40 uppercase tracking-widest">{item.unit}</span>
                        </div>
                        <button 
                          onClick={() => updateQuantity(item.id, 0.1)}
                          className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-white text-artisanal-dark transition-all"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-3 text-red-800/20 hover:text-red-800 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-artisanal-dark p-12 flex items-center justify-between">
              <div className="text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-1">Total items</p>
                <p className="text-3xl font-serif font-bold">{items.length}</p>
              </div>
              <button 
                onClick={() => alert('List saved for your next market visit!')}
                className="flex items-center bg-artisanal-brown text-white px-12 py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-white hover:text-artisanal-dark transition-all"
              >
                <Save className="h-4 w-4 mr-3" />
                Save Permanent List
              </button>
            </div>
          </div>
          
          <div className="bg-cream-100/50 p-8 rounded-3xl border border-cream-200">
            <p className="text-[10px] font-medium text-artisanal-dark/40 leading-relaxed max-w-md mx-auto text-center italic">
              "Cooking is an art, but shopping is a science. This list auto-combines ingredients from different recipes to ensure you never buy more than you need."
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
