"use client";

import { Search, ShoppingBasket, X } from "lucide-react";
import Link from "next/link";
import { useGroceryList } from "@/hooks/useGroceryList";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Navbar() {
  const { items } = useGroceryList();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Sync search input with URL on load
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchValue(q);
    if (q) setIsSearchOpen(true);
  }, [searchParams]);

  const openSearch = () => {
    setIsSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchValue("");
    // Clear query param from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`${pathname}${params.size ? `?${params}` : ""}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("q", val);
    } else {
      params.delete("q");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeSearch();
  };

  return (
    <nav className="border-b border-cream-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tighter text-artisanal-dark">
              L&apos;Archive Artisanal
            </Link>
          </div>

          {/* Search input overlay */}
          <div
            className={`absolute inset-x-0 px-8 transition-all duration-300 ${
              isSearchOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="mx-auto max-w-2xl flex items-center bg-white border border-cream-200 rounded-full shadow-lg px-6 py-3.5">
              <Search className="h-4 w-4 text-artisanal-brown mr-4 flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Search recipes by name…"
                className="flex-grow bg-transparent outline-none text-sm font-medium text-artisanal-dark placeholder:text-artisanal-dark/30"
              />
              <button
                onClick={closeSearch}
                className="ml-4 text-artisanal-dark/30 hover:text-artisanal-dark transition-colors flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Standard nav links */}
          <div className={`hidden md:block transition-opacity duration-200 ${isSearchOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
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

          <div className="flex items-center space-x-6 flex-shrink-0">
            <button
              onClick={isSearchOpen ? closeSearch : openSearch}
              className={`transition-colors ${isSearchOpen ? "text-artisanal-brown" : "text-artisanal-dark/40 hover:text-artisanal-dark"}`}
              title="Search recipes"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link href="/grocery-list" className="text-artisanal-dark/40 hover:text-artisanal-dark transition-colors relative">
              <ShoppingBasket className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-3 w-3 bg-artisanal-brown rounded-full" />
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
