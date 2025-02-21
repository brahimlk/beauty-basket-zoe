
import { useState } from "react";
import { Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const products = [
    {
      id: 1,
      name: "Natural Face Cream",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=60",
      category: "skincare",
      discount: 20,
      description: "A gentle, natural face cream that nourishes and hydrates your skin.",
    },
    {
      id: 2,
      name: "Organic Lipstick",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=60",
      category: "makeup",
      description: "Long-lasting organic lipstick with natural ingredients.",
    },
    {
      id: 3,
      name: "Vitamin C Serum",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1570194065650-d707c8ca0095?w=800&auto=format&fit=crop&q=60",
      category: "skincare",
      discount: 15,
      description: "High-potency Vitamin C serum for brighter, more radiant skin.",
    },
  ];

  const categories = ["all", "skincare", "makeup", "haircare", "fragrances"];

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">All Products</h1>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Products;
