
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";

const Index = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Natural Face Cream",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=60",
      discount: 20,
    },
    {
      id: 2,
      name: "Organic Lipstick",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: 3,
      name: "Vitamin C Serum",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1570194065650-d707c8ca0095?w=800&auto=format&fit=crop&q=60",
      discount: 15,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative h-[70vh] flex items-center">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1619451334792-150fd785f2ae?w=800&auto=format&fit=crop&q=60"
              alt="Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          </div>
          
          <div className="container relative z-10 text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-down">
              Discover Your Natural Beauty
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl animate-fade-up">
              Shop premium beauty products at affordable prices. Quality guaranteed.
            </p>
            <Button size="lg" className="animate-fade-up">
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button variant="ghost">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-secondary">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Skincare", "Makeup", "Hair Care", "Fragrances"].map((category) => (
                <div
                  key={category}
                  className="glass-card p-6 rounded-lg text-center transition-transform hover:scale-105"
                >
                  <h3 className="text-lg font-semibold">{category}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
