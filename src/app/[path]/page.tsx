import Navbar from "@/components/Navbar";
import RecipeGrid from "@/components/RecipeGrid";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import RecipeForm, { RecipeData } from "@/components/RecipeForm";
import RecipeTweakTools from "@/components/RecipeTweakTools";
import RecipeView from "@/components/RecipeView";
import CookingMode from "@/components/CookingMode";
import GroceryList from "@/components/GroceryList";
import RecipeHistory from "@/components/RecipeHistory";

// Mock data lookup for editing
const getMockRecipe = (id: string): RecipeData | undefined => {
  const recipes: Record<string, RecipeData> = {
    "1": {
      id: "1",
      title: "Artisanal Sourdough",
      description: "A classic, naturally leavened bread with a crisp crust and airy crumb.",
      prepTime: "24h",
      totalTime: "26h",
      category: "Main Course",
      temperature: "Hot",
      difficulty: "Hard",
      ingredients: ["500g Bread Flour", "350g Water", "100g Sourdough Starter", "10g Salt"],
      steps: ["Mix flour and water", "Add starter and salt", "Perform stretch and folds", "Bulk ferment", "Shape and cold proof", "Bake at 450°F"]
    },
    "2": {
      id: "2",
      title: "Lavender Macarons",
      description: "Delicate french cookies infused with dried lavender and honey buttercream.",
      prepTime: "45 mins",
      totalTime: "1.5h",
      category: "Dessert",
      temperature: "Cold",
      difficulty: "Hard",
      ingredients: ["Almond Flour", "Powdered Sugar", "Egg Whites", "Granulated Sugar", "Dried Lavender"],
      steps: ["Sift dry ingredients", "Make meringue", "Macaronage", "Pipe and rest", "Bake", "Fill with buttercream"]
    }
  };
  return recipes[id];
};

export default async function DynamicPathPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ path: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { path } = await params;
  const sParams = await searchParams;
  const id = sParams.id as string;
  
  if (path === "create" || path === "add") {
    return (
      <div className="flex min-h-screen flex-col bg-cream-50">
        <Navbar />
        <main className="flex-grow">
          <RecipeForm />
        </main>
        <Footer />
      </div>
    );
  }

  if (path === "edit" && id) {
    const recipeData = getMockRecipe(id);
    return (
      <div className="flex min-h-screen flex-col bg-cream-50">
        <Navbar />
        <main className="flex-grow">
          <RecipeForm initialData={recipeData} isEdit={true} />
        </main>
        <Footer />
      </div>
    );
  }

  if ((path === "tweak" || path === "manipulate") && id) {
    const recipeData = getMockRecipe(id);
    if (recipeData) {
      return (
        <div className="flex min-h-screen flex-col bg-cream-50">
          <Navbar />
          <main className="flex-grow">
            <RecipeTweakTools recipe={recipeData} />
          </main>
          <Footer />
        </div>
      );
    }
  }

  if (path === "grocery-list" || path === "list") {
    return (
      <div className="flex min-h-screen flex-col bg-cream-50">
        <Navbar />
        <main className="flex-grow">
          <GroceryList />
        </main>
        <Footer />
      </div>
    );
  }

  if (path === "history" && id) {
    const recipeData = getMockRecipe(id);
    if (recipeData) {
      return (
        <div className="flex min-h-screen flex-col bg-cream-50">
          <Navbar />
          <main className="flex-grow">
            <RecipeHistory recipeId={id} currentData={recipeData} />
          </main>
          <Footer />
        </div>
      );
    }
  }

  if ((path === "cook" || path === "cooking-mode") && id) {
    const recipeData = getMockRecipe(id);
    if (recipeData) {
      return (
        <div className="flex min-h-screen flex-col bg-artisanal-dark">
          <CookingMode recipe={recipeData} />
        </div>
      );
    }
  }

  // Handle Recipe View (Direct ID as path)
  const recipeData = getMockRecipe(path);
  if (recipeData) {
    return (
      <div className="flex min-h-screen flex-col bg-cream-50">
        <Navbar />
        <main className="flex-grow">
          <RecipeView recipe={recipeData} />
        </main>
        <Footer />
      </div>
    );
  }

  const isArchive = path === "archive";
  const title = isArchive ? "The Complete Archive" : (path ? path.charAt(0).toUpperCase() + path.slice(1) : "Archive");

  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-artisanal-dark border-b border-white/5 py-24 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
            <span className="text-[200px] font-serif font-bold text-white leading-none select-none">Explore</span>
          </div>

          <div className="mx-auto max-w-7xl px-4 relative z-10 sm:px-6 lg:px-8">
            <span className="text-artisanal-brown font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block">
              Curated Collection
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">{title}</h1>
            <p className="text-white/40 text-sm font-medium uppercase tracking-[0.2em] max-w-lg leading-relaxed">
              {isArchive 
                ? "Every technique, every ingredient, and every discovery we've ever documented, preserved for the curious cook."
                : `Exploring the refined selection of ${title} in our artisanal archive.`
              }
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <RecipeGrid />
            </div>
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
