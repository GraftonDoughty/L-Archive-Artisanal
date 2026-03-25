"use client";

import { Search, User, Menu, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { useGroceryList } from "@/hooks/useGroceryList";

export default function Navbar() {
  const { items } = useGroceryList();

  return (
    <nav className="border-b border-cream-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tighter text-artisanal-dark">
              L'Archive Artisanal
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-12 px-8">
              <Link href="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-artisanal-dark/60 hover:text-artisanal-dark transition-colors">Archive</Link>
              <Link href="/collections" className="text-[10px] font-bold uppercase tracking-[0.2em] text-artisanal-dark/60 hover:text-artisanal-dark transition-colors">Collections</Link>
              <Link href="/create" className="text-[10px] font-bold uppercase tracking-[0.2em] text-artisanal-dark/60 hover:text-artisanal-dark transition-colors">Add Recipe</Link>
              <Link href="/grocery-list" className="relative text-[10px] font-bold uppercase tracking-[0.2em] text-artisanal-dark hover:text-artisanal-brown transition-colors flex items-center">
                Grocery List
                {items.length > 0 && (
                  <span className="absolute -top-3 -right-4 h-4 w-4 bg-artisanal-brown text-white text-[8px] flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                    {items.length}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-artisanal-dark/40 hover:text-artisanal-dark transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/grocery-list" className="text-artisanal-dark/40 hover:text-artisanal-dark transition-colors relative">
              <ShoppingBasket className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-3 w-3 bg-artisanal-brown rounded-full" />
              )}
            </Link>
            <button className="text-artisanal-dark/40 hover:text-artisanal-dark transition-colors">
              <User className="h-5 w-5" />
            </button>
            <button className="md:hidden text-artisanal-dark/40 hover:text-artisanal-dark transition-colors">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
