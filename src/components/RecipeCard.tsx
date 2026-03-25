import Image from "next/image";
import Link from "next/link";
import { Clock, Pencil } from "lucide-react";

export interface Recipe {
  id: string;
  title: string;
  prepTime: string;
  image: string;
  category: "Main Course" | "Dessert" | "Appetizer";
  temperature: "Cold" | "Hot";
  datePublished: string;
}

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="group relative bg-cream-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-500 border border-cream-200">
      <div className="aspect-[4/5] relative overflow-hidden">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
        
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="inline-flex items-center rounded-full bg-cream-50/90 px-3 py-1 text-xs font-semibold text-artisanal-dark backdrop-blur-sm">
            {recipe.category}
          </span>
        </div>

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link 
            href={`/edit?id=${recipe.id}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-artisanal-dark shadow-sm hover:bg-white transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-serif text-xl font-bold text-artisanal-dark mb-2 group-hover:text-artisanal-brown transition-colors">
          {recipe.title}
        </h3>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-sm text-artisanal-dark/60">
            <Clock className="h-4 w-4 mr-1.5" />
            {recipe.prepTime}
          </div>
          <span className="text-[10px] uppercase tracking-wider text-artisanal-brown font-bold">
            {recipe.temperature}
          </span>
        </div>
      </div>
    </div>
  );
}
