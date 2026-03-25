import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RecipeGrid from "@/components/RecipeGrid";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      
      <main className="flex-grow">
        <Hero />
        
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Main Content Area */}
            <div className="lg:col-span-8">
              <div className="mb-12">
                <h2 className="font-serif text-4xl font-bold text-artisanal-dark mb-4">Latest In The Archive</h2>
                <div className="h-1 w-20 bg-artisanal-brown rounded-full" />
              </div>
              
              <Suspense fallback={<div className="animate-pulse grid grid-cols-2 gap-8"><div className="h-80 bg-cream-100 rounded-3xl" /><div className="h-80 bg-cream-100 rounded-3xl" /></div>}>
                <RecipeGrid />
              </Suspense>
            </div>

            {/* Sidebar */}
            <div className="mt-16 lg:col-span-4 lg:mt-0">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
