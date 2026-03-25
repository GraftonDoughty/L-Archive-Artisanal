import Navbar from "@/components/Navbar";
import RecipeGrid from "@/components/RecipeGrid";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import RecipeForm, { RecipeData } from "@/components/RecipeForm";
import RecipeTweakTools from "@/components/RecipeTweakTools";
import RecipeView from "@/components/RecipeView";
import CookingMode from "@/components/CookingMode";
import GroceryList from "@/components/GroceryList";

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

  const title = path ? path.charAt(0).toUpperCase() + path.slice(1) : "Archive";

  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-artisanal-brown/5 border-b border-cream-200">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="font-serif text-4xl font-bold text-artisanal-dark">{title}</h1>
            <p className="mt-2 text-sm text-artisanal-dark/60 font-medium uppercase tracking-widest">
              Exploring the {title} collection
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
